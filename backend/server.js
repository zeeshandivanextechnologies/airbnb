import http from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';
import dotenv from 'dotenv';
import { pool } from './src/config/db.js';
import { initFullDatabase } from './src/config/schema.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP server wrapping Express app
const server = http.createServer(app);

// Initialize Socket.io with permissive CORS for frontend and admin
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Real-time Socket events
io.on('connection', (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`);

  // Join ticket room
  socket.on('join_ticket', (ticketId) => {
    socket.join(`ticket_${ticketId}`);
    console.log(`User ${socket.id} joined room ticket_${ticketId}`);
  });

  // Leave ticket room
  socket.on('leave_ticket', (ticketId) => {
    socket.leave(`ticket_${ticketId}`);
  });

  // Broadcast new message in real-time
  socket.on('send_message', async (data) => {
    // data: { ticketId, sender, text }
    try {
      const { ticketId, sender, text } = data;
      if (!ticketId || !text) return;

      const result = await pool.query(
        `INSERT INTO support_messages (ticket_id, sender, text) VALUES ($1, $2, $3) RETURNING *`,
        [ticketId, sender || 'Support', text]
      );

      const savedMsg = result.rows[0];

      // Broadcast to room (both Admin and Guest/Host)
      io.to(`ticket_${ticketId}`).emit('new_message', {
        id: savedMsg.id,
        ticketId: savedMsg.ticket_id,
        sender: savedMsg.sender,
        text: savedMsg.text,
        createdAt: savedMsg.created_at
      });

      // Also broadcast notification to all admins
      io.emit('support_ticket_updated', {
        ticketId,
        lastMessage: text,
        sender
      });
    } catch (err) {
      console.error('Error handling socket message:', err.message);
    }
  });

  // Typing indicator events
  socket.on('typing_start', ({ ticketId, user }) => {
    socket.to(`ticket_${ticketId}`).emit('user_typing', { ticketId, user, isTyping: true });
  });

  socket.on('typing_stop', ({ ticketId, user }) => {
    socket.to(`ticket_${ticketId}`).emit('user_typing', { ticketId, user, isTyping: false });
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

server.listen(PORT, async () => {
  console.log('Server is running on port ' + PORT);
  try {
    await pool.query('SELECT NOW()');
    console.log('PostgreSQL database connected successfully');
    await initFullDatabase();
  } catch (error) {
    console.warn('PostgreSQL database check:', error.message);
  }
});

