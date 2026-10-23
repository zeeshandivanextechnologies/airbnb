import express from 'express';
import cors from 'cors';
import adminAuthRouter from './routes/adminAuth.js';
import listingsRouter from './routes/listings.js';
import userAuthRouter from './routes/userAuth.js';
import paymentsRouter from './routes/payments.js';
import couponsRouter from './routes/coupons.js';
import financeRouter from './routes/finance.js';
import securityRouter from './routes/security.js';
import supportRouter from './routes/support.js';

const app = express();

app.use(cors());

// Safe JSON body parser with malformed JSON handler
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Handle JSON parse errors gracefully
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON payload received. Please check request format.'
    });
  }
  next(err);
});

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Airbnb backend is running' });
});

// Routes
app.use('/api/admin/auth', adminAuthRouter);
app.use('/api/admin', adminAuthRouter);
app.use('/api/listings', listingsRouter);
app.use('/api/auth', userAuthRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/coupons', couponsRouter);
app.use('/api/finance', financeRouter);
app.use('/api/security', securityRouter);
app.use('/api/support', supportRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

export default app;
