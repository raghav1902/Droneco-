/**
 * @file statsController.js
 * @description Controller for admin dashboard analytics and statistics.
 */

const Lead = require('../models/lead.model');
const Course = require('../models/course.model');

// @desc    Get lead analytics for admin dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const enrolledLeads = await Lead.countDocuments({ status: 'Enrolled' });
    const pendingFollowUps = await Lead.countDocuments({ status: { $in: ['New', 'Contacted'] } });

    const conversionRate = totalLeads > 0 ? ((enrolledLeads / totalLeads) * 100).toFixed(1) : 0;

    // Aggregate leads by status
    const leadsByStatusAgg = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Ensure all statuses are present
    const defaultStatuses = ['New', 'Contacted', 'Interested', 'Not Interested', 'Enrolled'];
    const statusMap = {};
    defaultStatuses.forEach(s => statusMap[s] = 0);
    leadsByStatusAgg.forEach(item => {
      statusMap[item._id] = item.count;
    });
    const leadsByStatus = Object.keys(statusMap).map(key => ({ name: key, value: statusMap[key] }));

    // Aggregate leads by course
    const leadsByCourseAgg = await Lead.aggregate([
      { $group: { _id: '$interested_course_id', count: { $sum: 1 } } }
    ]);

    const courses = await Course.find();
    const courseMap = {};
    courses.forEach(c => courseMap[c._id.toString()] = c.course_name);

    const courseDataMap = {};
    courses.forEach(c => courseDataMap[c.course_name] = 0);

    leadsByCourseAgg.forEach(item => {
      const courseId = item._id?.toString();
      const courseName = courseMap[courseId] || 'Unknown / Deleted';
      if (courseDataMap[courseName] === undefined) courseDataMap[courseName] = 0;
      courseDataMap[courseName] += item.count;
    });

    const leadsByCourse = Object.keys(courseDataMap).map(key => ({ name: key, value: courseDataMap[key] }));

    // Get recent leads
    const recentLeadsRaw = await Lead.find()
      .sort({ submitted_at: -1 })
      .limit(5)
      .populate('interested_course_id', 'course_name');

    const recentLeads = recentLeadsRaw.map(lead => ({
      id: lead._id,
      full_name: lead.full_name,
      email: lead.email,
      mobile_number: lead.mobile_number,
      status: lead.status,
      course_name: lead.interested_course_id ? lead.interested_course_id.course_name : 'N/A',
      submitted_at: lead.submitted_at
    }));

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalLeads,
          enrolledLeads,
          conversionRate: Number(conversionRate),
          pendingFollowUps
        },
        leadsByStatus,
        leadsByCourse,
        recentLeads
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, message: 'Server error fetching statistics' });
  }
};

module.exports = {
  getStats
};
