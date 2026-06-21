require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
  }, { strict: false });
  
  const User = mongoose.models.User || mongoose.model('User', userSchema);
  
  const email = 'admin@kitbay.com';
  const password = 'adminpassword';
  
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists. You can log in with:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  }
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  await User.create({
    name: 'Admin User',
    email,
    password: hashedPassword,
    role: 'admin'
  });
  
  console.log('Admin account created successfully!');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  process.exit(0);
}

seedAdmin();
