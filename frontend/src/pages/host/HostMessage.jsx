import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { FaSearch, FaPaperPlane, FaShieldAlt, FaComments, FaClock, FaCheck, FaArrowLeft } from 'react-icons/fa';
import styles from '../../components/styles/HostMessage.module.css';
import VerifyBanner from '../../components/VerifyBanner';
import { apiRequest } from '../../services/api.js';

function HostMessage() {
  const { user } = useSelector((state) => state.auth);
  const hostName = user?.firstName || user?.first_name || 'Host';

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

  // Keep chat scrolled to bottom internally without forcing the window or page to jump
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
      console.log('Host connected to Live Socket:', socket.id);
    });

    socket.on('new_message', (msg) => {
      if (selectedTicketRef.current && selectedTicketRef.current.id === msg.ticketId) {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === msg.id && m.id !== undefined);
          if (exists) return prev;
          return [...prev, {
            id: msg.id,
            sender: msg.sender,
            text: msg.text,
            createdAt: msg.createdAt || new Date().toISOString()
          }];
        });
      }

      // Update message count/preview in sidebar ticket list
      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === msg.ticketId) {
            return {
              ...t,
              messages: [...(t.messages || []), msg]
            };
          }
          return t;
        })
      );
    });

    // Listen for typing indicator
    socket.on('user_typing', ({ ticketId, user, isTyping }) => {
      if (selectedTicketRef.current && selectedTicketRef.current.id === ticketId) {
        if (isTyping) {
          setOtherPartyTyping(user || 'Support Staff');
        } else {
          setOtherPartyTyping(null);
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Join room when selected ticket changes
  useEffect(() => {
    if (socketRef.current && selectedTicket) {
      socketRef.current.emit('join_ticket', selectedTicket.id);
      setMessages(selectedTicket.messages || []);
      setOtherPartyTyping(null);
      return () => {
        socketRef.current.emit('leave_ticket', selectedTicket.id);
      };
    }
  }, [selectedTicket?.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;

    const textToSend = newMessage.trim();
    const optimisticMsg = {
      id: Date.now(),
      sender: 'Host',
      text: textToSend,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setNewMessage('');

    // Stop typing immediately
    if (socketRef.current && selectedTicket) {
      socketRef.current.emit('typing_stop', {
        ticketId: selectedTicket.id,
        user: hostName
      });
    }

    // Emit in real-time
    if (socketRef.current) {
      socketRef.current.emit('send_message', {
        ticketId: selectedTicket.id,
        sender: 'Host',
        text: textToSend
      });
    }

    // Persist to backend
    try {
      await apiRequest(`/support/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ sender: 'Host', text: textToSend })
      });
    } catch (err) {
      console.warn('Fallback error sending message:', err.message);
    }
  };

  const filteredTickets = tickets.filter((t) =>
    (t.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`container-fluid p-0 ${styles.messagePage}`}>
      <VerifyBanner />

      {/* Main Split Layout */}
      <div className={`row ${styles.mainRow}`}>
        {/* Left Sidebar */}
        <div 
          className={`col-lg-4 col-md-5 ${styles.sidebar}`}
          style={{
            display: (mobileShowChat && window.innerWidth <= 768) ? 'none' : 'flex'
          }}
        >
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Messages & Support</h2>
            <div className={styles.iconBtnGroup}>
              <span style={{ fontSize: '12px', background: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '12px', fontWeight: '600' }}>
                ⚡ Live Socket
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', marginBottom: '16px', flexShrink: 0 }}>
            <FaSearch size={13} style={{ position: 'absolute', top: '12px', left: '12px', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          {/* Conversation List (Fixed Scrollable Area) */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: '4px' }}>
            {filteredTickets.length === 0 ? (
              <div className={styles.emptyState} style={{ padding: '40px 10px' }}>
                <div className={styles.emptyIconWrapper}>
                  <div className={styles.chatBubbleBlue}></div>
                  <div className={styles.chatBubbleWhite}>
                    <div className={styles.chatLine}></div>
                    <div className={styles.chatLineShort}></div>
                  </div>
                </div>
                <h3 className={styles.emptyTitle}>No conversations</h3>
                <p className={styles.emptySub}>Messages and support requests will appear here.</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => {
                const isSelected = selectedTicket?.id === ticket.id;
                const lastMsg = ticket.messages && ticket.messages.length > 0 
                  ? ticket.messages[ticket.messages.length - 1].text 
                  : 'No messages yet';

                return (
                  <div
                    key={ticket.id}
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setMessages(ticket.messages || []);
                      setMobileShowChat(true);
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      marginBottom: '8px',
                      backgroundColor: isSelected ? '#f3f4f6' : '#ffffff',
                      border: isSelected ? '1px solid #d1d5db' : '1px solid #f3f4f6',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '600', fontSize: '13.5px', color: '#111827' }}>
                        {ticket.userName || ticket.subject}
                      </span>
                      <span style={{ fontSize: '11px', color: '#6b7280' }}>
                        {ticket.id}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '12.5px',
                      color: '#4b5563',
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {lastMsg}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Content - Real-time Chat View */}
        <div 
          className={`col-lg-8 col-md-7 ${styles.mainContent}`} 
          style={{ 
            display: (!mobileShowChat && window.innerWidth <= 768) ? 'none' : 'flex',
            flexDirection: 'column', 
            height: '100%',
            minHeight: 0
          }}
        >
          {selectedTicket ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
              {/* Chat Header */}
              <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#fafafa',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setMobileShowChat(false)}
                    className="d-md-none"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#374151',
                      cursor: 'pointer',
                      padding: '4px 8px 4px 0'
                    }}
                  >
                    <FaArrowLeft size={16} />
                  </button>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>
                      {selectedTicket.subject}
                    </h4>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
                      {selectedTicket.userType}: {selectedTicket.userName} • Ticket: {selectedTicket.id}
                    </p>
                  </div>
                </div>
                <div>
                  <span style={{
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    backgroundColor: selectedTicket.status === 'Resolved' ? '#dcfce7' : '#fef3c7',
                    color: selectedTicket.status === 'Resolved' ? '#166534' : '#92400e'
                  }}>
                    ● {selectedTicket.status}
                  </span>
                </div>
              </div>

              {/* Messages Body (Fixed Scrollable Area) */}
              <div 
                ref={chatContainerRef}
                style={{
                  flex: 1,
                  minHeight: 0,
                  padding: '20px 24px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  backgroundColor: '#ffffff'
                }}
              >
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', margin: 'auto', color: '#9ca3af', fontSize: '13px' }}>
                    Start the conversation by sending a message below.
                  </div>
                ) : (
                  messages.map((m, idx) => {
                    const isMe = m.sender === 'Host';
                    return (
                      <div
                        key={idx}
                        style={{
                          alignSelf: isMe ? 'flex-end' : 'flex-start',
                          maxWidth: '75%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isMe ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <span style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px', paddingLeft: '4px' }}>
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
                        user: hostName
                      });

                      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                      typingTimeoutRef.current = setTimeout(() => {
                        if (socketRef.current && selectedTicket) {
                          socketRef.current.emit('typing_stop', {
                            ticketId: selectedTicket.id,
                            user: hostName
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

export default HostMessage;