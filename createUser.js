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

const createUser = async () => {
  try {
    await connectDB();

    // User credentials
    const userEmail = 'john@example.com';
    const userPassword = 'password123';
    const userFirstName = 'John';
    const userLastName = 'Doe';

    // Check if user exists
    let user = await User.findOne({ email: userEmail });

    if (user) {
      // Update existing user password
      user.password = userPassword;
      user.isAdmin = false;
      user.firstName = userFirstName;
      user.lastName = userLastName;
      await user.save();
      console.log('✅ User password updated successfully!');
    } else {
      // Create new user
      user = await User.create({
        firstName: userFirstName,
        lastName: userLastName,
        email: userEmail,
        password: userPassword,
        isAdmin: false
      });
      console.log('✅ User account created successfully!');
    }

    console.log('');
    console.log('================================');
    console.log('   USER LOGIN CREDENTIALS');
    console.log('================================');
    console.log(`Email:    ${userEmail}`);
    console.log(`Password: ${userPassword}`);
    console.log('================================');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createUser();

