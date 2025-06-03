import express from 'express';
const router = express.Router();

const countries = ['India', 'USA'];
const states = {
  India: ['UP', 'Delhi'],
  USA: ['California', 'Texas']
};
const cities = {
  UP: ['Noida', 'Lucknow'],
  Delhi: ['New Delhi'],
  California: ['LA', 'San Francisco'],
  Texas: ['Houston', 'Dallas']
};

router.get('/countries', (req, res) => res.json(countries));
router.get('/states', (req, res) => res.json(states[req.query.country] || []));
router.get('/cities', (req, res) => res.json(cities[req.query.state] || []));

export default router;
