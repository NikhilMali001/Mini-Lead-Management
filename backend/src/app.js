import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import leadRoutes from './routes/lead.routes.js';
import activityRoutes from './routes/activity.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Mini Lead Management System API' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

export default app;
