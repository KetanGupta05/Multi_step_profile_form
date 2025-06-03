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
// Get all users (for testing purpose)
router.get('/all', async (req, res) => {
  try {
    const users = await User.find(); // fetch all users
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/check-username', async (req, res) => {
  const { username } = req.query;
  const exists = await User.exists({ username });
  res.json({ available: !exists });
});

router.post('/submit', upload.single('profilePhoto'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.profilePhoto = req.file.path;
    }
    const user = new User(data);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;