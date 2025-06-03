import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import locationRoutes from './routes/locationRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/users', userRoutes);
app.use('/api/location', locationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


