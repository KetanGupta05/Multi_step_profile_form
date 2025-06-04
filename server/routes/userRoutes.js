import express from 'express';
import multer from 'multer';
import User from '../models/User.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only JPG and PNG files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter
});

// Root endpoint - API documentation
router.get('/', (req, res) => {
  res.json({
    message: 'User API Endpoints',
    endpoints: {
      getAllUsers: 'GET /all',
      checkUsername: 'GET /check-username?username=YOUR_USERNAME',
      submitUser: 'POST /submit (with profilePhoto in form-data)'
    },
    status: 'API is working correctly'
  });
});

// Get all users
router.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// Check username availability
router.get('/check-username', async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username query parameter is required'
      });
    }
    
    const exists = await User.exists({ username });
    res.json({ 
      success: true,
      available: !exists 
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Submit new user with profile photo
router.post('/submit', upload.single('profilePhoto'), async (req, res) => {
  try {
    const data = req.body;
    
    if (req.file) {
      data.profilePhoto = req.file.path;
    }
    
    const user = new User(data);
    await user.save();
    
    res.status(201).json({ 
      success: true,
      user: {
        id: user._id,
        username: user.username
        // Add other fields you want to return
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

export default router;