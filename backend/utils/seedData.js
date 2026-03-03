require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/Student');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Student.deleteMany({});
    console.log('🗑️  Cleared existing students');

    // Insert sample data
    const students = await Student.insertMany(sampleStudents);
    console.log(`✅ Added ${students.length} students`);

    // Ranks will be calculated automatically via hooks
    console.log('🔄 Ranks calculated automatically');

    // Fetch and display top 10
    const topStudents = await Student.find().sort({ rank: 1 }).limit(10);
    console.log('\n🏆 Top 10 Students:');
    topStudents.forEach(student => {
      console.log(`   ${student.rank}. ${student.name} - ${student.finalPercentage.toFixed(2)}%`);
    });

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();
