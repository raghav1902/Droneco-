require('dotenv').config();
const mongoose = require('mongoose');

async function runDiagnostics() {
  console.log('--- SYSTEM DIAGNOSTICS ---');
  console.log('Node.js Version:', process.version);
  console.log('Platform:', process.platform);
  
  console.log('\n--- ENVIRONMENT VARIABLES ---');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('PORT:', process.env.PORT);
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN);
  console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
  
  console.log('\n--- DATABASE CONNECTION TEST ---');
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI is missing!');
    process.exit(1);
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000 // Timeout quickly for diagnostics
    });
    console.log('MongoDB connection SUCCESSFUL.');
    
    // Check if it's Atlas
    const isAtlas = mongoUri.includes('mongodb.net');
    console.log('Is MongoDB Atlas Cluster?', isAtlas);
    
    await mongoose.connection.close();
    console.log('Connection closed cleanly.');
  } catch (error) {
    console.error('MongoDB connection FAILED:');
    console.error(`Name: ${error.name}`);
    console.error(`Message: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
  }
}

runDiagnostics();
