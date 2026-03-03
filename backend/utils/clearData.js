require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/Student');

// Connect to MongoDB with longer timeout
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('💡 Please check:');
  console.error('   1. MongoDB Atlas cluster is running');
  console.error('   2. Your IP address is whitelisted');
  console.error('   3. MONGO_URI in .env is correct');
  process.exit(1);
});

// Clear all student data
const clearAllData = async () => {
  try {
    console.log('🗑️  Starting to clear all student data...');
    
    // Count students before deletion
    const count = await Student.countDocuments();
    console.log(`📊 Found ${count} students in the database`);

    if (count === 0) {
      console.log('ℹ️  Database is already empty!');
      process.exit(0);
    }

    // Delete all students
    const result = await Student.deleteMany({});
    console.log(`✅ Successfully deleted ${result.deletedCount} students`);
    
    // Verify deletion
    const remainingCount = await Student.countDocuments();
    console.log(`📊 Remaining students: ${remainingCount}`);

    if (remainingCount === 0) {
      console.log('🎉 Database cleared successfully! Ready for new data.');
    } else {
      console.warn('⚠️  Warning: Some students may not have been deleted');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
};

// Run clear function
clearAllData();
