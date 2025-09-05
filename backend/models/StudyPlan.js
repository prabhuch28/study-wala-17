const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'missed', 'cancelled'],
    default: 'scheduled'
  },
  type: {
    type: String,
    enum: ['study', 'review', 'practice', 'exam', 'assignment', 'break'],
    default: 'study'
  },
  tags: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true
  },
  resources: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['book', 'video', 'article', 'website', 'document', 'other']
    }
  }],
  notes: {
    type: String,
    trim: true
  },
  actualStartTime: Date,
  actualEndTime: Date,
  actualDuration: Number, // in minutes
  completionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  pomodoroSessions: {
    planned: { type: Number, default: 0 },
    completed: { type: Number, default: 0 }
  }
});

const studyGoalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  targetDate: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    enum: ['exam', 'assignment', 'skill', 'certification', 'other'],
    default: 'other'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  milestones: [{
    title: String,
    description: String,
    targetDate: Date,
    completed: { type: Boolean, default: false },
    completedAt: Date
  }],
  subjects: [String],
  estimatedHours: Number,
  actualHours: { type: Number, default: 0 }
});

const studyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  subjects: [{
    name: { type: String, required: true },
    color: { type: String, default: '#3B82F6' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    allocatedHours: { type: Number, default: 0 },
    completedHours: { type: Number, default: 0 }
  }],
  sessions: [studySessionSchema],
  goals: [studyGoalSchema],
  preferences: {
    studyHoursPerDay: { type: Number, default: 4 },
    preferredStudyTimes: [{
      start: String, // "09:00"
      end: String    // "12:00"
    }],
    breakDuration: { type: Number, default: 15 }, // minutes
    pomodoroLength: { type: Number, default: 25 }, // minutes
    weeklySchedule: {
      monday: { active: { type: Boolean, default: true }, hours: { type: Number, default: 4 } },
      tuesday: { active: { type: Boolean, default: true }, hours: { type: Number, default: 4 } },
      wednesday: { active: { type: Boolean, default: true }, hours: { type: Number, default: 4 } },
      thursday: { active: { type: Boolean, default: true }, hours: { type: Number, default: 4 } },
      friday: { active: { type: Boolean, default: true }, hours: { type: Number, default: 4 } },
      saturday: { active: { type: Boolean, default: true }, hours: { type: Number, default: 3 } },
      sunday: { active: { type: Boolean, default: false }, hours: { type: Number, default: 2 } }
    },
    notifications: {
      sessionReminders: { type: Boolean, default: true },
      dailyGoals: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: true }
    }
  },
  statistics: {
    totalPlannedHours: { type: Number, default: 0 },
    totalCompletedHours: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    completedSessions: { type: Number, default: 0 },
    averageSessionDuration: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastStudyDate: Date,
    subjectStats: [{
      subject: String,
      hoursStudied: { type: Number, default: 0 },
      sessionsCompleted: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 }
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  templateCategory: {
    type: String,
    enum: ['exam-prep', 'skill-building', 'certification', 'academic', 'custom']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
studyPlanSchema.index({ userId: 1, isActive: 1 });
studyPlanSchema.index({ 'sessions.startTime': 1 });
studyPlanSchema.index({ 'sessions.status': 1 });
studyPlanSchema.index({ 'goals.targetDate': 1 });

// Virtual for completion percentage
studyPlanSchema.virtual('completionPercentage').get(function() {
  if (this.statistics.totalPlannedHours === 0) return 0;
  return Math.round((this.statistics.totalCompletedHours / this.statistics.totalPlannedHours) * 100);
});

// Method to update statistics
studyPlanSchema.methods.updateStatistics = function() {
  const sessions = this.sessions;
  const completedSessions = sessions.filter(s => s.status === 'completed');
  
  this.statistics.totalSessions = sessions.length;
  this.statistics.completedSessions = completedSessions.length;
  this.statistics.totalCompletedHours = completedSessions.reduce((sum, s) => sum + (s.actualDuration || s.duration) / 60, 0);
  this.statistics.totalPlannedHours = sessions.reduce((sum, s) => sum + s.duration / 60, 0);
  
  if (completedSessions.length > 0) {
    this.statistics.averageSessionDuration = completedSessions.reduce((sum, s) => sum + (s.actualDuration || s.duration), 0) / completedSessions.length;
    this.statistics.lastStudyDate = Math.max(...completedSessions.map(s => s.actualEndTime || s.endTime));
  }
  
  // Update subject statistics
  this.statistics.subjectStats = [];
  const subjectMap = {};
  
  completedSessions.forEach(session => {
    if (!subjectMap[session.subject]) {
      subjectMap[session.subject] = {
        subject: session.subject,
        hoursStudied: 0,
        sessionsCompleted: 0,
        averageScore: 0
      };
    }
    subjectMap[session.subject].hoursStudied += (session.actualDuration || session.duration) / 60;
    subjectMap[session.subject].sessionsCompleted += 1;
  });
  
  this.statistics.subjectStats = Object.values(subjectMap);
};

// Method to calculate streak
studyPlanSchema.methods.calculateStreak = function() {
  const sessions = this.sessions
    .filter(s => s.status === 'completed')
    .sort((a, b) => new Date(b.actualEndTime || b.endTime) - new Date(a.actualEndTime || a.endTime));
  
  if (sessions.length === 0) {
    this.statistics.streakDays = 0;
    return;
  }
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (let session of sessions) {
    const sessionDate = new Date(session.actualEndTime || session.endTime);
    sessionDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (daysDiff > streak) {
      break;
    }
  }
  
  this.statistics.streakDays = streak;
  if (streak > this.statistics.longestStreak) {
    this.statistics.longestStreak = streak;
  }
};

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
