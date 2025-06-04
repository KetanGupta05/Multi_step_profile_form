import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
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
  tls: true,                    
  tlsAllowInvalidCertificates: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));


app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API Service',
    documentation: {
      users: {
        basePath: '/api/users',
        endpoints: {
          getAllUsers: 'GET /all',
          checkUsername: 'GET /check-username?username=YOUR_USERNAME',
          submitUser: 'POST /submit'
        }
      },
      location: {
        basePath: '/api/location',
        endpoints: 'Check locationRoutes.js for available endpoints'
      }
    },
    status: 'API is running',
    timestamp: new Date().toISOString()
  });
});


app.use('/api/users', userRoutes);
app.use('/api/location', locationRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    suggestion: 'Check the root endpoint / for available routes'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});


const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`Server running in ${ENV} mode on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}`);
});