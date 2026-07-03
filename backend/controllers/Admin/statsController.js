/**
 * @file statsController.js
 * @description Controller for admin dashboard analytics and statistics.
 */

const { leads, courses } = require('../../database/store');

// @desc    Get lead analytics for admin dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getStats = (req, res) => {
  const totalLeads = leads.length;
  
  // Calculate status counts
  const statusCounts = {
    'New': 0,
    'Contacted': 0,
    'Interested': 0,
    'Not Interested': 0,
    'Enrolled': 0
  };
  
  leads.forEach(lead => {
    if (statusCounts[lead.status] !== undefined) {
      statusCounts[lead.status]++;
    }
  });

  const enrolledCount = statusCounts['Enrolled'] || 0;
  const conversionRate = totalLeads > 0 ? ((enrolledCount / totalLeads) * 100).toFixed(1) : 0;
  const pendingFollowUps = (statusCounts['New'] || 0) + (statusCounts['Contacted'] || 0);

  // Calculate leads by course
  const courseCounts = {};
  // Initialize all courses with 0
  courses.forEach(course => {
    courseCounts[course.course_name] = 0;
  });

  leads.forEach(lead => {
    const course = courses.find(c => c.id === lead.interested_course_id);
    const courseName = course ? course.course_name : 'Unknown / Deleted';
    
    if (courseCounts[courseName] === undefined) {
      courseCounts[courseName] = 0;
    }
    courseCounts[courseName]++;
  });

  // Convert course counts to an array of { name, value } for frontend charts
  const leadsByCourse = Object.keys(courseCounts).map(name => ({
    name,
    value: courseCounts[name]
  }));

  // Convert status counts to an array of { name, value }
  const leadsByStatus = Object.keys(statusCounts).map(name => ({
    name,
    value: statusCounts[name]
  }));

  // Get recent 5 leads
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
    .slice(0, 5)
    .map(lead => {
      const course = courses.find(c => c.id === lead.interested_course_id);
      return {
        id: lead.id,
        full_name: lead.full_name,
        email: lead.email,
        mobile_number: lead.mobile_number,
        status: lead.status,
        course_name: course ? course.course_name : 'N/A',
        submitted_at: lead.submitted_at
      };
    });

  res.status(200).json({
    success: true,
    data: {
      summary: {
        totalLeads,
        enrolledLeads: enrolledCount,
        conversionRate: Number(conversionRate),
        pendingFollowUps
      },
      leadsByStatus,
      leadsByCourse,
      recentLeads
    }
  });
};

module.exports = {
  getStats
};
