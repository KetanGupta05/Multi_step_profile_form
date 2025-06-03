import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  profilePhoto: String,
  password: String,
  profession: String,
  companyName: String,
  address1: String,
  country: String,
  state: String,
  city: String,
  subscription: String,
  newsletter: Boolean,
});

export default mongoose.model('User', userSchema);