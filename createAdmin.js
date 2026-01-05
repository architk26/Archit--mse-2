const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    await connectDB();

    // Admin credentials
    const adminEmail = 'admin@techhire.com';
    const adminPassword = 'admin123';
    const adminFirstName = 'Admin';
    const adminLastName = 'User';

    // Check if admin exists
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      // Update existing admin password
      admin.password = adminPassword;
      admin.isAdmin = true;
      admin.firstName = adminFirstName;
      admin.lastName = adminLastName;
      await admin.save();
      console.log('✅ Admin password updated successfully!');
    } else {
      // Create new admin
      admin = await User.create({
        firstName: adminFirstName,
        lastName: adminLastName,
        email: adminEmail,
        password: adminPassword,
        isAdmin: true
      });
      console.log('✅ Admin account created successfully!');
    }

    console.log('');
    console.log('================================');
    console.log('   ADMIN LOGIN CREDENTIALS');
    console.log('================================');
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('================================');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();

