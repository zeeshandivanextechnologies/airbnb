import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { FaSearch, FaPaperPlane, FaShieldAlt, FaComments, FaClock, FaCheck, FaArrowLeft } from 'react-icons/fa';
import styles from '../../components/styles/HostMessage.module.css';
import { apiRequest } from '../../services/api.js';

function GuestMessage() {
  const { user } = useSelector((state) => state.auth);
  const guestName = user?.firstName || user?.first_name || user?.name || 'Guest';

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [otherPartyTyping, setOtherPartyTyping] = useState(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const socketRef = useRef(null);
  const selectedTicketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    selectedTicketRef.current = selectedTicket;
  }, [selectedTicket]);

  // Keep chat scrolled to bottom internally without forcing the page to jump
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, otherPartyTyping]);

  // Load tickets on component mount
  const loadTickets = async () => {
    try {
      const res = await apiRequest('/support/tickets');
      if (res && res.success && res.tickets) {
        setTickets(res.tickets);
        // Default select first ticket if none selected on desktop
        if (!selectedTicket && res.tickets.length > 0 && window.innerWidth > 768) {
          setSelectedTicket(res.tickets[0]);
          setMessages(res.tickets[0].messages || []);
        }
      }
    } catch (err) {
      console.warn('Could not fetch support tickets:', err.message);
    }
  };

  useEffect(() => {
    loadTickets();

    const socketUrl = import.meta.env.VITE_API_BASE_URL 
      ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') 
      : 'http://localhost:5000';

    const socket = io(socketUrl, {
      transports: ['websocket', 'polling']
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Guest connected to Live Socket:', socket.id);
    });

    socket.on('new_message', (msg) => {
      if (selectedTicketRef.current && selectedTicketRef.current.id === msg.ticketId) {
        setMessages((prev) => {
          const exists = prev.some((m) => 
            (m.id && msg.id && m.id === msg.id) ||
            (m.clientTempId && msg.clientTempId && m.clientTempId === msg.clientTempId)
          );
          if (exists) {
            return prev.map(m => 
              (m.clientTempId && msg.clientTempId && m.clientTempId === msg.clientTempId) 
                ? { ...m, id: msg.id } 
                : m
            );
          }
          return [...prev, {
            id: msg.id,
            sender: msg.sender,
            text: msg.text,
            createdAt: msg.createdAt || new Date().toISOString()
          }];
        });
      }

      // Update message preview in sidebar ticket list
      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === msg.ticketId) {
            const exists = (t.messages || []).some((m) => 
              (m.id && msg.id && m.id === msg.id) ||
              (m.clientTempId && msg.clientTempId && m.clientTempId === msg.clientTempId)
            );
            const updatedMessages = exists 
              ? (t.messages || []).map(m => (m.clientTempId && msg.clientTempId && m.clientTempId === msg.clientTempId) ? { ...m, id: msg.id } : m)
              : [...(t.messages || []), {
                  id: msg.id,
                  sender: msg.sender,
                  text: msg.text,
                  createdAt: msg.createdAt || new Date().toISOString()
                }];
            return {
              ...t,
              messages: updatedMessages
            };
          }
          return t;
        })
      );
    });

    // Real-time typing indicators
    socket.on('user_typing', (data) => {
      if (selectedTicketRef.current && selectedTicketRef.current.id === data.ticketId) {
        if (data.user && data.user !== guestName) {
          setOtherPartyTyping(data.user);
        }
      }
    });

    socket.on('user_stopped_typing', (data) => {
      if (selectedTicketRef.current && selectedTicketRef.current.id === data.ticketId) {
        setOtherPartyTyping(null);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [guestName]);

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setMessages(ticket.messages || []);
    setOtherPartyTyping(null);
    setMobileShowChat(true);

    if (socketRef.current) {
      socketRef.current.emit('join_ticket', { ticketId: ticket.id, user: guestName });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;

    const messageText = newMessage.trim();
    const tempId = `temp_${Date.now()}`;
    const outgoingMsg = {
      clientTempId: tempId,
      sender: guestName,
      text: messageText,
      createdAt: new Date().toISOString()
    };

    // Optimistic state update
    setMessages((prev) => [...prev, outgoingMsg]);
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? { ...t, messages: [...(t.messages || []), outgoingMsg] }
          : t
      )
    );
    setNewMessage('');

    if (socketRef.current) {
      socketRef.current.emit('typing_stop', {
        ticketId: selectedTicket.id,
        user: guestName
      });
    }

    try {
      const res = await apiRequest(`/support/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          sender: guestName,
          text: messageText,
          clientTempId: tempId
        })
      });

      if (res && res.success && res.message) {
        setMessages((prev) =>
          prev.map((m) =>
            m.clientTempId === tempId ? { ...m, id: res.message.id } : m
          )
        );
        setTickets((prev) =>
          prev.map((t) =>
            t.id === selectedTicket.id
              ? {
                  ...t,
                  messages: (t.messages || []).map((m) =>
                    m.clientTempId === tempId ? { ...m, id: res.message.id } : m
                  )
                }
              : t
          )
        );
      }
    } catch (err) {
      console.error('Failed to persist message:', err);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const q = searchQuery.toLowerCase();
    const subject = (t.subject || '').toLowerCase();
    const guestOrHost = (t.guest_name || t.host_name || '').toLowerCase();
    return subject.includes(q) || guestOrHost.includes(q);
  });

  return (
    <div className={styles.messagePage}>


      {/* Main Chat Layout Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        height: '100%',
        backgroundColor: '#ffffff'
      }}>
        {/* Sidebar: Conversation List */}
        <div style={{
          width: window.innerWidth <= 768 && mobileShowChat ? '0%' : '380px',
          display: window.innerWidth <= 768 && mobileShowChat ? 'none' : 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #e5e7eb',
          backgroundColor: '#fafafa',
          height: '100%'
        }}>
          {/* Header & Search */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 12px 0' }}>
              Messages
            </h2>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <FaSearch style={{ position: 'absolute', left: '12px', color: '#9ca3af', fontSize: '13px' }} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 34px',
                  borderRadius: '20px',
                  border: '1px solid #d1d5db',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
          </div>

          {/* Ticket/Conversation items */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredTickets.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9ca3af' }}>
                <FaComments size={32} style={{ marginBottom: '10px', opacity: 0.4 }} />
                <p style={{ fontSize: '14px', margin: 0 }}>No conversations found</p>
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isSelected = selectedTicket && selectedTicket.id === t.id;
                const lastMsg = t.messages && t.messages.length > 0 ? t.messages[t.messages.length - 1] : null;

                return (
                  <div
                    key={t.id}
                    onClick={() => handleSelectTicket(t)}
                    style={{
                      padding: '14px 18px',
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#ffffff' : 'transparent',
                      borderLeft: isSelected ? '4px solid #ff385c' : '4px solid transparent',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: isSelected ? '700' : '600', color: '#1f2937' }}>
                        {t.host_name || t.guest_name || t.subject || `Ticket #${t.id}`}
                      </span>
                      {lastMsg && (
                        <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                          {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '12.5px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {lastMsg ? `${lastMsg.sender}: ${lastMsg.text}` : 'No messages yet...'}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: t.status === 'open' ? '#dcfce7' : '#f3f4f6',
                        color: t.status === 'open' ? '#166534' : '#4b5563',
                        fontWeight: '500'
                      }}>
                        {t.status || 'Active'}
                      </span>
                      {t.priority && (
                        <span style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          fontWeight: '500'
                        }}>
                          {t.priority}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Pane */}
        <div style={{
          flex: 1,
          display: window.innerWidth <= 768 && !mobileShowChat ? 'none' : 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: '#ffffff'
        }}>
          {selectedTicket ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Chat Top Bar */}
              <div style={{
                padding: '14px 20px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {window.innerWidth <= 768 && (
                    <button
                      onClick={() => setMobileShowChat(false)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px', color: '#4b5563' }}
                    >
                      <FaArrowLeft size={16} />
                    </button>
                  )}
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#111827' }}>
                      {selectedTicket.host_name || selectedTicket.guest_name || selectedTicket.subject || `Conversation #${selectedTicket.id}`}
                    </h3>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {selectedTicket.subject || 'Online Support & Reservation Chat'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{
                    fontSize: '12px',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    {selectedTicket.status || 'Active'}
                  </span>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div
                ref={chatContainerRef}
                style={{
                  flex: 1,
                  padding: '20px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  backgroundColor: '#ffffff'
                }}
              >
                {messages.length === 0 ? (
                  <div style={{ margin: 'auto', textAlign: 'center', color: '#9ca3af' }}>
                    <FaComments size={40} style={{ opacity: 0.3, marginBottom: '8px' }} />
                    <p style={{ fontSize: '14px', margin: 0 }}>Start a conversation by sending a message below.</p>
                  </div>
                ) : (
                  messages.map((m, idx) => {
                    const isMe = m.sender === guestName;
                    return (
                      <div
                        key={m.id || m.clientTempId || idx}
                        style={{
                          alignSelf: isMe ? 'flex-end' : 'flex-start',
                          maxWidth: '70%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isMe ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <span style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '3px', padding: '0 4px' }}>
                          {m.sender}
                        </span>
                        <div
                          style={{
                            padding: '10px 16px',
                            borderRadius: '16px',
                            borderBottomRightRadius: isMe ? '4px' : '16px',
                            borderBottomLeftRadius: !isMe ? '4px' : '16px',
                            backgroundColor: isMe ? '#ff385c' : '#f3f4f6',
                            color: isMe ? '#ffffff' : '#1f2937',
                            fontSize: '13.5px',
                            lineHeight: '1.4',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                          }}
                        >
                          {m.text}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Real-time Typing Wave Loader */}
                {otherPartyTyping && (
                  <div style={{
                    alignSelf: 'flex-start',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#f3f4f6',
                    padding: '8px 14px',
                    borderRadius: '16px',
                    borderBottomLeftRadius: '4px',
                    fontSize: '12.5px',
                    color: '#4b5563',
                    fontStyle: 'italic',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}>
                    <span>{otherPartyTyping} is typing</span>
                    <span style={{ display: 'inline-flex', gap: '3px', alignItems: 'center' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ff385c', animation: 'hostTypingDot 1.4s infinite ease-in-out', animationDelay: '0s' }}></span>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ff385c', animation: 'hostTypingDot 1.4s infinite ease-in-out', animationDelay: '0.2s' }}></span>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ff385c', animation: 'hostTypingDot 1.4s infinite ease-in-out', animationDelay: '0.4s' }}></span>
                    </span>
                  </div>
                )}
              </div>

              {/* Input Footer */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: '16px 24px',
                  borderTop: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  flexShrink: 0
                }}
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewMessage(val);

                    if (socketRef.current && selectedTicket) {
                      socketRef.current.emit('typing_start', {
                        ticketId: selectedTicket.id,
                        user: guestName
                      });

                      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                      typingTimeoutRef.current = setTimeout(() => {
                        if (socketRef.current && selectedTicket) {
                          socketRef.current.emit('typing_stop', {
                            ticketId: selectedTicket.id,
                            user: guestName
                          });
                        }
                      }, 1200);
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 18px',
                    borderRadius: '24px',
                    border: '1px solid #d1d5db',
                    fontSize: '13.5px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  style={{
                    backgroundColor: newMessage.trim() ? '#ff385c' : '#e5e7eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: newMessage.trim() ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                >
                  <FaPaperPlane size={15} />
                </button>
              </form>
            </div>
          ) : (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af'
            }}>
              <FaComments size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <p style={{ fontSize: '15px', fontWeight: '500' }}>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GuestMessage;

