const mongoose = require('mongoose');
const StudyPlan = require('../models/StudyPlan');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/study-wala');
    console.log('🔗 MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await StudyPlan.deleteMany({});
    console.log('🧹 Cleared existing study plans');

    // Create sample study plans
    const samplePlans = [
      {
        userId: new mongoose.Types.ObjectId(),
        userEmail: 'mehul@gmail.com',
        title: 'JEE Main 2024 Preparation',
        description: 'Comprehensive preparation plan for JEE Main entrance exam',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-04-30'),
        subjects: [
          {
            name: 'Mathematics',
            color: '#3B82F6',
            priority: 'high',
            topics: ['Calculus', 'Algebra', 'Coordinate Geometry', 'Trigonometry'],
            hoursAllocated: 120,
            hoursCompleted: 45
          },
          {
            name: 'Physics',
            color: '#10B981',
            priority: 'high',
            topics: ['Mechanics', 'Thermodynamics', 'Optics', 'Electricity'],
            hoursAllocated: 100,
            hoursCompleted: 30
          },
          {
            name: 'Chemistry',
            color: '#F59E0B',
            priority: 'medium',
            topics: ['Organic', 'Inorganic', 'Physical Chemistry'],
            hoursAllocated: 80,
            hoursCompleted: 25
          }
        ],
        goals: [
          {
            title: 'Complete Mathematics Syllabus',
            description: 'Finish all mathematics topics with practice',
            targetDate: new Date('2024-03-15'),
            type: 'exam',
            priority: 'high',
            status: 'active',
            progress: 60,
            subjects: ['Mathematics']
          },
          {
            title: 'Physics Mock Tests',
            description: 'Complete 20 physics mock tests',
            targetDate: new Date('2024-04-15'),
            type: 'exam',
            priority: 'medium',
            status: 'active',
            progress: 30,
            subjects: ['Physics']
          }
        ],
        sessions: [
          {
            title: 'Calculus Practice',
            subject: 'Mathematics',
            description: 'Differential and integral calculus problems',
            startTime: new Date('2024-08-22T06:00:00'),
            endTime: new Date('2024-08-22T08:00:00'),
            duration: 120,
            priority: 'high',
            status: 'completed',
            type: 'study',
            actualStartTime: new Date('2024-08-22T06:05:00'),
            actualEndTime: new Date('2024-08-22T07:55:00'),
            actualDuration: 110,
            notes: 'Completed integration by parts exercises'
          },
          {
            title: 'Physics Mechanics',
            subject: 'Physics',
            description: 'Newton\'s laws and motion problems',
            startTime: new Date('2024-08-22T09:00:00'),
            endTime: new Date('2024-08-22T10:30:00'),
            duration: 90,
            priority: 'high',
            status: 'scheduled',
            type: 'study'
          }
        ],
        isActive: true,
        statistics: {
          totalPlannedHours: 300,
          totalCompletedHours: 100,
          totalSessions: 150,
          completedSessions: 45,
          streakDays: 5,
          longestStreak: 12,
          subjectStats: [
            { subject: 'Mathematics', hoursStudied: 45, sessionsCompleted: 20 },
            { subject: 'Physics', hoursStudied: 30, sessionsCompleted: 15 },
            { subject: 'Chemistry', hoursStudied: 25, sessionsCompleted: 10 }
          ]
        }
      },
      {
        userId: new mongoose.Types.ObjectId(),
        userEmail: 'mehul@gmail.com',
        title: 'NEET Biology Focus',
        description: 'Intensive biology preparation for NEET exam',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-05-31'),
        subjects: [
          {
            name: 'Biology',
            color: '#059669',
            priority: 'high',
            topics: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology'],
            hoursAllocated: 150,
            hoursCompleted: 60
          },
          {
            name: 'Chemistry',
            color: '#DC2626',
            priority: 'medium',
            topics: ['Organic Chemistry', 'Biochemistry'],
            hoursAllocated: 80,
            hoursCompleted: 20
          }
        ],
        goals: [
          {
            title: 'Biology Syllabus Completion',
            description: 'Complete entire NEET biology syllabus',
            targetDate: new Date('2024-04-30'),
            type: 'exam',
            priority: 'urgent',
            status: 'active',
            progress: 40,
            subjects: ['Biology']
          }
        ],
        sessions: [],
        isActive: true,
        statistics: {
          totalPlannedHours: 230,
          totalCompletedHours: 80,
          totalSessions: 100,
          completedSessions: 35,
          streakDays: 3,
          longestStreak: 8,
          subjectStats: [
            { subject: 'Biology', hoursStudied: 60, sessionsCompleted: 25 },
            { subject: 'Chemistry', hoursStudied: 20, sessionsCompleted: 10 }
          ]
        }
      }
    ];

    // Insert sample data
    const createdPlans = await StudyPlan.insertMany(samplePlans);
    console.log(`✅ Created ${createdPlans.length} sample study plans`);

    console.log('🎉 Seed data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();
  await seedData();
};

run();
