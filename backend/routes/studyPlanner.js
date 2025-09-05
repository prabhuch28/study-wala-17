const express = require('express');
const router = express.Router();
const StudyPlan = require('../models/StudyPlan');
const mongoose = require('mongoose');

// Get all study plans for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
        data: null
      });
    }

    // Check if userId is a valid ObjectId or use it as email
    let query = { isActive: true };
    if (mongoose.Types.ObjectId.isValid(userId)) {
      query.userId = new mongoose.Types.ObjectId(userId);
    } else {
      // Assume it's an email and use it directly
      query.userEmail = userId;
    }

    const studyPlans = await StudyPlan.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Study plans retrieved successfully',
      data: studyPlans
    });
  } catch (error) {
    console.error('Get study plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve study plans',
      data: null
    });
  }
});

// Get a specific study plan
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const studyPlan = await StudyPlan.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'Study plan retrieved successfully',
      data: studyPlan
    });
  } catch (error) {
    console.error('Get study plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve study plan',
      data: null
    });
  }
});

// Create a new study plan
router.post('/', async (req, res) => {
  try {
    const studyPlanData = req.body;
    
    // Validate required fields
    if (!studyPlanData.userId || !studyPlanData.title || !studyPlanData.startDate || !studyPlanData.endDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, title, startDate, endDate',
        data: null
      });
    }

    const studyPlan = new StudyPlan(studyPlanData);
    await studyPlan.save();

    res.status(201).json({
      success: true,
      message: 'Study plan created successfully',
      data: studyPlan
    });
  } catch (error) {
    console.error('Create study plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create study plan',
      data: null
    });
  }
});

// Update a study plan
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    const updateData = req.body;

    const studyPlan = await StudyPlan.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(userId)
      },
      updateData,
      { new: true, runValidators: true }
    );

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'Study plan updated successfully',
      data: studyPlan
    });
  } catch (error) {
    console.error('Update study plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update study plan',
      data: null
    });
  }
});

// Delete a study plan
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const studyPlan = await StudyPlan.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(userId)
      },
      { isActive: false },
      { new: true }
    );

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'Study plan deleted successfully',
      data: null
    });
  } catch (error) {
    console.error('Delete study plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete study plan',
      data: null
    });
  }
});

// Add a study session to a plan
router.post('/:id/sessions', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    const sessionData = req.body;

    const studyPlan = await StudyPlan.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found',
        data: null
      });
    }

    studyPlan.sessions.push(sessionData);
    studyPlan.updateStatistics();
    await studyPlan.save();

    res.status(201).json({
      success: true,
      message: 'Study session added successfully',
      data: studyPlan.sessions[studyPlan.sessions.length - 1]
    });
  } catch (error) {
    console.error('Add session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add study session',
      data: null
    });
  }
});

// Update a study session
router.put('/:id/sessions/:sessionId', async (req, res) => {
  try {
    const { id, sessionId } = req.params;
    const { userId } = req.query;
    const updateData = req.body;

    const studyPlan = await StudyPlan.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found',
        data: null
      });
    }

    const session = studyPlan.sessions.id(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Study session not found',
        data: null
      });
    }

    Object.assign(session, updateData);
    studyPlan.updateStatistics();
    studyPlan.calculateStreak();
    await studyPlan.save();

    res.json({
      success: true,
      message: 'Study session updated successfully',
      data: session
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update study session',
      data: null
    });
  }
});

// Delete a study session
router.delete('/:id/sessions/:sessionId', async (req, res) => {
  try {
    const { id, sessionId } = req.params;
    const { userId } = req.query;

    const studyPlan = await StudyPlan.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found',
        data: null
      });
    }

    studyPlan.sessions.id(sessionId).remove();
    studyPlan.updateStatistics();
    await studyPlan.save();

    res.json({
      success: true,
      message: 'Study session deleted successfully',
      data: null
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete study session',
      data: null
    });
  }
});

// Get sessions for a specific date range
router.get('/:id/sessions', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, startDate, endDate, status } = req.query;

    const studyPlan = await StudyPlan.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found',
        data: null
      });
    }

    let sessions = studyPlan.sessions;

    // Filter by date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      sessions = sessions.filter(session => {
        const sessionDate = new Date(session.startTime);
        return sessionDate >= start && sessionDate <= end;
      });
    }

    // Filter by status
    if (status) {
      sessions = sessions.filter(session => session.status === status);
    }

    res.json({
      success: true,
      message: 'Study sessions retrieved successfully',
      data: sessions
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve study sessions',
      data: null
    });
  }
});

// Add a goal to a study plan
router.post('/:id/goals', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    const goalData = req.body;

    const studyPlan = await StudyPlan.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found',
        data: null
      });
    }

    studyPlan.goals.push(goalData);
    await studyPlan.save();

    res.status(201).json({
      success: true,
      message: 'Study goal added successfully',
      data: studyPlan.goals[studyPlan.goals.length - 1]
    });
  } catch (error) {
    console.error('Add goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add study goal',
      data: null
    });
  }
});

// Update a goal
router.put('/:id/goals/:goalId', async (req, res) => {
  try {
    const { id, goalId } = req.params;
    const { userId } = req.query;
    const updateData = req.body;

    const studyPlan = await StudyPlan.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found',
        data: null
      });
    }

    const goal = studyPlan.goals.id(goalId);
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Study goal not found',
        data: null
      });
    }

    Object.assign(goal, updateData);
    await studyPlan.save();

    res.json({
      success: true,
      message: 'Study goal updated successfully',
      data: goal
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update study goal',
      data: null
    });
  }
});

// Get analytics and statistics
router.get('/:id/analytics', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const studyPlan = await StudyPlan.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found',
        data: null
      });
    }

    // Update statistics before returning
    studyPlan.updateStatistics();
    studyPlan.calculateStreak();
    await studyPlan.save();

    const analytics = {
      overview: {
        totalPlannedHours: studyPlan.statistics.totalPlannedHours,
        totalCompletedHours: studyPlan.statistics.totalCompletedHours,
        completionPercentage: studyPlan.completionPercentage,
        totalSessions: studyPlan.statistics.totalSessions,
        completedSessions: studyPlan.statistics.completedSessions,
        streakDays: studyPlan.statistics.streakDays,
        longestStreak: studyPlan.statistics.longestStreak
      },
      subjectBreakdown: studyPlan.statistics.subjectStats,
      recentActivity: studyPlan.sessions
        .filter(s => s.status === 'completed')
        .sort((a, b) => new Date(b.actualEndTime || b.endTime) - new Date(a.actualEndTime || a.endTime))
        .slice(0, 10),
      upcomingSessions: studyPlan.sessions
        .filter(s => s.status === 'scheduled' && new Date(s.startTime) > new Date())
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
        .slice(0, 5),
      goals: studyPlan.goals.filter(g => g.status === 'active')
    };

    res.json({
      success: true,
      message: 'Analytics retrieved successfully',
      data: analytics
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics',
      data: null
    });
  }
});

// Generate AI recommendations
router.get('/:id/recommendations', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const studyPlan = await StudyPlan.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found',
        data: null
      });
    }

    // Simple AI recommendations based on study patterns
    const recommendations = [];
    
    // Check completion rate
    const completionRate = studyPlan.statistics.completedSessions / studyPlan.statistics.totalSessions;
    if (completionRate < 0.7) {
      recommendations.push({
        type: 'schedule',
        priority: 'high',
        title: 'Optimize Your Schedule',
        description: 'Your completion rate is below 70%. Consider reducing session duration or frequency.',
        action: 'Adjust session length to 25-30 minutes for better focus.'
      });
    }

    // Check study streak
    if (studyPlan.statistics.streakDays === 0) {
      recommendations.push({
        type: 'motivation',
        priority: 'medium',
        title: 'Build a Study Streak',
        description: 'Start building a daily study habit to improve consistency.',
        action: 'Schedule a short 15-minute session for tomorrow.'
      });
    }

    // Check subject balance
    const subjectStats = studyPlan.statistics.subjectStats;
    if (subjectStats.length > 1) {
      const totalHours = subjectStats.reduce((sum, s) => sum + s.hoursStudied, 0);
      const imbalanced = subjectStats.find(s => s.hoursStudied / totalHours < 0.2);
      if (imbalanced) {
        recommendations.push({
          type: 'balance',
          priority: 'medium',
          title: 'Balance Your Subjects',
          description: `You're spending less time on ${imbalanced.subject}. Consider allocating more time to it.`,
          action: `Schedule additional sessions for ${imbalanced.subject}.`
        });
      }
    }

    // Check upcoming deadlines
    const urgentGoals = studyPlan.goals.filter(g => {
      const daysUntilDeadline = Math.ceil((new Date(g.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntilDeadline <= 7 && g.status === 'active' && g.progress < 80;
    });

    urgentGoals.forEach(goal => {
      recommendations.push({
        type: 'deadline',
        priority: 'urgent',
        title: 'Urgent Deadline Approaching',
        description: `${goal.title} is due soon and only ${goal.progress}% complete.`,
        action: 'Increase study intensity and focus on this goal.'
      });
    });

    res.json({
      success: true,
      message: 'Recommendations generated successfully',
      data: recommendations
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      data: null
    });
  }
});

module.exports = router;
