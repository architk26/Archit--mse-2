const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Job = require('./models/Job');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

// Sample data
const users = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@techhire.com',
    password: 'admin123',
    isAdmin: true
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    isAdmin: false
  }
];

const jobs = [
  {
    title: 'Senior React Developer',
    company: 'TechCorp India',
    location: 'Bangalore',
    salary: '₹18L - ₹25L',
    type: 'Full Time',
    remote: true,
    description: 'We are looking for an experienced React developer to join our team. You will be responsible for building and maintaining our web applications.',
    requirements: ['5+ years of React experience', 'Strong JavaScript skills', 'Experience with Redux', 'Knowledge of TypeScript', 'Good communication skills'],
    tags: ['React', 'JavaScript', 'TypeScript', 'Redux', 'Frontend']
  },
  {
    title: 'Full Stack Developer',
    company: 'StartupHub',
    location: 'Mumbai',
    salary: '₹12L - ₹18L',
    type: 'Full Time',
    remote: false,
    description: 'Join our fast-growing startup as a Full Stack Developer. Work on exciting projects using modern technologies.',
    requirements: ['3+ years experience', 'Node.js and React', 'MongoDB experience', 'REST API design', 'Agile methodology'],
    tags: ['Node.js', 'React', 'MongoDB', 'Full Stack', 'JavaScript']
  },
  {
    title: 'Python Backend Developer',
    company: 'DataTech Solutions',
    location: 'Hyderabad',
    salary: '₹15L - ₹22L',
    type: 'Full Time',
    remote: true,
    description: 'Looking for a Python developer to work on our data processing platform. Experience with Django or FastAPI required.',
    requirements: ['4+ years Python experience', 'Django or FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
    tags: ['Python', 'Django', 'FastAPI', 'Backend', 'PostgreSQL']
  },
  {
    title: 'Frontend Developer',
    company: 'DesignStudio',
    location: 'Pune',
    salary: '₹8L - ₹12L',
    type: 'Full Time',
    remote: false,
    description: 'Create beautiful user interfaces for our clients. Work with designers to implement pixel-perfect designs.',
    requirements: ['2+ years experience', 'HTML, CSS, JavaScript', 'React or Vue.js', 'Responsive design', 'CSS frameworks'],
    tags: ['Frontend', 'React', 'CSS', 'JavaScript', 'UI/UX']
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudFirst',
    location: 'Delhi NCR',
    salary: '₹20L - ₹28L',
    type: 'Full Time',
    remote: true,
    description: 'Manage our cloud infrastructure and CI/CD pipelines. Experience with AWS and Kubernetes required.',
    requirements: ['5+ years DevOps experience', 'AWS or Azure', 'Kubernetes', 'Terraform', 'Jenkins/GitLab CI'],
    tags: ['DevOps', 'AWS', 'Kubernetes', 'Docker', 'CI/CD']
  },
  {
    title: 'Mobile App Developer',
    company: 'AppWorks',
    location: 'Chennai',
    salary: '₹10L - ₹16L',
    type: 'Full Time',
    remote: false,
    description: 'Build cross-platform mobile applications using React Native. Work on consumer-facing apps.',
    requirements: ['3+ years mobile development', 'React Native', 'iOS and Android', 'REST APIs', 'App Store deployment'],
    tags: ['React Native', 'Mobile', 'iOS', 'Android', 'JavaScript']
  },
  {
    title: 'Data Scientist',
    company: 'AI Labs India',
    location: 'Bangalore',
    salary: '₹22L - ₹35L',
    type: 'Full Time',
    remote: true,
    description: 'Work on cutting-edge machine learning projects. Build models for various business use cases.',
    requirements: ['Masters in CS/Stats', 'Python, TensorFlow/PyTorch', 'Machine Learning', 'Data Analysis', 'SQL'],
    tags: ['Data Science', 'Machine Learning', 'Python', 'AI', 'TensorFlow']
  },
  {
    title: 'Java Developer',
    company: 'Enterprise Solutions',
    location: 'Noida',
    salary: '₹14L - ₹20L',
    type: 'Full Time',
    remote: false,
    description: 'Develop enterprise applications using Java and Spring Boot. Work on microservices architecture.',
    requirements: ['4+ years Java experience', 'Spring Boot', 'Microservices', 'Oracle/MySQL', 'RESTful services'],
    tags: ['Java', 'Spring Boot', 'Microservices', 'Backend', 'Enterprise']
  },
  {
    title: 'QA Engineer',
    company: 'QualityFirst',
    location: 'Gurgaon',
    salary: '₹8L - ₹14L',
    type: 'Full Time',
    remote: true,
    description: 'Ensure quality of our software products. Write and maintain automated tests.',
    requirements: ['3+ years QA experience', 'Selenium/Cypress', 'API testing', 'Test automation', 'Agile testing'],
    tags: ['QA', 'Testing', 'Automation', 'Selenium', 'Quality']
  },
  {
    title: 'UI/UX Designer',
    company: 'CreativeMinds',
    location: 'Mumbai',
    salary: '₹10L - ₹15L',
    type: 'Contract',
    remote: true,
    description: 'Design user interfaces and experiences for web and mobile applications. Create wireframes and prototypes.',
    requirements: ['3+ years design experience', 'Figma/Sketch', 'User research', 'Prototyping', 'Design systems'],
    tags: ['UI/UX', 'Design', 'Figma', 'User Experience', 'Product']
  }
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Job.deleteMany();

    console.log('Data cleared...');

    // Create users (password hashing handled by User model pre-save hook)
    const createdUsers = [];
    for (const user of users) {
      const createdUser = await User.create(user);
      createdUsers.push(createdUser);
    }

    console.log('Users created...');

    // Create jobs with admin as creator
    const adminUser = createdUsers.find(u => u.isAdmin);
    for (const job of jobs) {
      await Job.create({
        ...job,
        createdBy: adminUser._id
      });
    }

    console.log('Jobs created...');
    console.log('');
    console.log('=== Sample Login Credentials ===');
    console.log('Admin: admin@techhire.com / admin123');
    console.log('User:  john@example.com / password123');
    console.log('================================');
    console.log('');
    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Job.deleteMany();

    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
