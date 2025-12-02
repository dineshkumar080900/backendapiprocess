import React, { useState, useEffect } from 'react';
import { Pie, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import {
  FaChartPie,
  FaBlog,
  FaProjectDiagram,
  FaCommentAlt,
  FaUsers,
  FaCog,
  FaArrowUp,
  FaArrowDown,
  FaUserCircle,
  FaCalendar,
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaBell,
  FaEnvelope
} from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const DataBaseDashboard = () => {
  const [blogCount, setBlogCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [testimonialCount, setTestimonialCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [chartType, setChartType] = useState('pie');
  const [timeRange, setTimeRange] = useState('weekly');
  const [metrics, setMetrics] = useState({
    totals: {
      totalBlogs: 0,
      totalProjects: 0,
      totalTestimonials: 0,
      totalLeads: 0,
      totalBanners: 0,
    },
    blogStatus: { active: 0, inactive: 0 },
    projectStatus: { ongoing: 0, completed: 0 },              // <— add
    testimonialStatus: { live: 0, inactive: 0 },              // <— optional
    contentDistribution: { blogs: 0, projects: 0, testimonials: 0, leads: 0, banners: 0 }, // <— include blogs
    recentActivity: [],
  });


  // Chart data for blog status (active vs inactive)
  const blogStatusData = {
    labels: ['Active Blogs', 'Inactive Blogs'],
    datasets: [
      {
        // data: [85, 39],
        data: [metrics.blogStatus.active, metrics.blogStatus.inactive],
        backgroundColor: ['#5DC350', '#E36324'],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  // Chart data for content distribution
  const contentDistributionData = {
    labels: ['Blogs', 'Projects', 'Testimonials', 'Leads'],
    datasets: [
      {
        // data: [124, 42, 67, 843],
        data: [
          metrics.contentDistribution.blogs,
          metrics.contentDistribution.projects,
          metrics.contentDistribution.testimonials,
          metrics.contentDistribution.leads,
        ],
        backgroundColor: ['#5DC350', '#E36324', '#4C6FFF', '#FF6B6B'],
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  };

  // Blog performance data
  const blogPerformanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Blog Views',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        backgroundColor: '#5DC350',
        borderColor: '#4CAF50',
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Blog Engagement',
        data: [8000, 12000, 10000, 18000, 15000, 22000],
        backgroundColor: '#E36324',
        borderColor: '#FF5722',
        borderWidth: 2,
        borderRadius: 8,
      }
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Recent activity data
  // const activities = [
  //   {
  //     id: 1,
  //     type: 'blog',
  //     title: 'New blog published: "React Best Practices"',
  //     time: '2 hours ago',
  //     icon: FaBlog,
  //     status: 'published'
  //   },
  //   {
  //     id: 2,
  //     type: 'project',
  //     title: 'Project "Sunrise" completed successfully',
  //     time: '5 hours ago',
  //     icon: FaProjectDiagram,
  //     status: 'completed'
  //   },
  //   {
  //     id: 3,
  //     type: 'testimonial',
  //     title: 'New testimonial from John Smith',
  //     time: 'Yesterday',
  //     icon: FaCommentAlt,
  //     status: 'new'
  //   },
  //   {
  //     id: 4,
  //     type: 'blog',
  //     title: 'Blog "Web Design Trends" updated',
  //     time: '2 days ago',
  //     icon: FaBlog,
  //     status: 'updated'
  //   },
  // ];

  const activities = metrics.recentActivity.map((a, i) => ({
    id: a.id || i,
    type: a.type,         // 'blog' | 'project' | 'testimonial'
    title: a.title,
    time: new Date(a.time).toLocaleString(),
    status: a.status,     // 'published' | 'draft' | 'pending'
  }));


  // Quick stats data
  const quickStats = [
    {
      id: 1,
      title: 'Today\'s Visitors',
      value: '1,234',
      change: '+12%',
      isPositive: true,
      icon: FaEye,
      color: '#5DC350'
    },
    {
      id: 2,
      title: 'Active Sessions',
      value: '567',
      change: '+8%',
      isPositive: true,
      icon: FaUsers,
      color: '#4C6FFF'
    },
    {
      id: 3,
      title: 'Bounce Rate',
      value: '32%',
      change: '-5%',
      isPositive: false,
      icon: FaChartPie,
      color: '#E36324'
    },
    {
      id: 4,
      title: 'Avg. Time',
      value: '4:32',
      change: '+1:12',
      isPositive: true,
      icon: FaCalendar,
      color: '#FF6B6B'
    }
  ];

  // Count up animation function
  const animateCount = (setter, target, duration = 600) => {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setter(target);
        clearInterval(timer);
      } else {
        setter(Math.floor(start));
      }
    }, 16);
  };

  // Initialize counts on component mount
  // useEffect(() => {
  //   animateCount(setBlogCount, 124);
  //   animateCount(setProjectCount, 42);
  //   animateCount(setTestimonialCount, 67);
  //   animateCount(setUserCount, 843);
  // }, []);

  const API_BASE_URL = 'admin.mithahomes.com';
  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/dashboard-metrics`, { credentials: 'include' });
        const json = await res.json();
        if (json?.success) {
          setMetrics(json.data);
          // drive counters (use any you actually render)
          animateCount(setBlogCount, json.data.totals.totalBlogs);
          animateCount(setProjectCount, json.data.totals.totalProjects);
          animateCount(setTestimonialCount, json.data.totals.totalTestimonials);
          // using Leads for the 4th card if you don't have users:
          animateCount(setUserCount, json.data.totals.totalLeads);
        }
      } catch (e) {
        console.error('dashboard-metrics fetch error', e);
      }
    };
    run();
  }, []);

  // Get activity status class
  const getActivityStatusClass = (status) => {
    switch (status) {
      case 'published':
        return 'status-published';
      case 'completed':
        return 'status-completed';
      case 'new':
        return 'status-new';
      case 'updated':
        return 'status-updated';
      case 'draft':
        return 'status-drafted';
      case 'Completed':
        return 'status-Completed';
      case 'Ongoing':
        return 'status-Ongoing';
      case 'Ready to Occupy':
        return 'status-Ready to Occupy';
      default:
        return '';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar */}


      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h2>Dashboard Overview</h2>
          <div className="header-actions">
            <button className="btn btn-primary">
              <FaCalendar className="btn-icon" />
              Last 30 Days
            </button>
            <button className="btn btn-secondary">
              Export Report
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          {quickStats.map((stat) => (
            <div key={stat.id} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                <stat.icon />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-title">{stat.title}</div>
                <div className={`stat-change ${stat.isPositive ? 'positive' : 'negative'}`}>
                  {stat.isPositive ? <FaArrowUp /> : <FaArrowDown />}
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Cards Grid */}
        <div className="cards-grid">
          <div className="card card-blog">
            <div className="card-header">
              <div>
                <div className="card-title">Total Blogs</div>
                <div className="card-value count-animation">{blogCount}</div>
                <div className="card-change positive">
                  <FaArrowUp /> 12% from last month
                </div>
              </div>
              <div className="card-icon">
                <FaBlog />
              </div>
            </div>
            <div className="card-footer">
              <span className="footer-text">  {metrics.blogStatus?.active ?? 0} Active  •  {metrics.blogStatus?.inactive ?? 0} Inactive</span>
            </div>
          </div>

          <div className="card card-project">
            <div className="card-header">
              <div>
                <div className="card-title">Total Projects</div>
                <div className="card-value count-animation">{projectCount}</div>
                <div className="card-change positive">
                  <FaArrowUp /> 8% from last month
                </div>
              </div>
              <div className="card-icon">
                <FaProjectDiagram />
              </div>
            </div>
            <div className="card-footer">
              <span className="footer-text"> {metrics.projectStatus?.ongoing } Ongoing • {metrics.projectStatus?.completed }  Completed</span>
              {/* {metrics.projectStatus.ongoing} {metrics.projectStatus.completed}*/}
            </div>
          </div>

          <div className="card card-testimonial">
            <div className="card-header">
              <div>
                <div className="card-title">Testimonials</div>
                <div className="card-value count-animation">{testimonialCount}</div>
                <div className="card-change positive">
                  <FaArrowUp /> 15% from last month
                </div>
              </div>
              <div className="card-icon">
                <FaCommentAlt />
              </div>
            </div>
            <div className="card-footer">
              <span className="footer-text">{metrics.testimonialStatus?.live } Published • {metrics.testimonialStatus?.inactive }  Pending(Draft)</span>
              {/* {metrics.testimonialStatus ? metrics.testimonialStatus.live : 0} {metrics.testimonialStatus ? 0:metrics.testimonialStatus.live } */}
            </div>
          </div>


        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container">
            <div className="chart-header">
              <div className="chart-title">Blog Performance</div>
              <div className="chart-actions">
                <button
                  className={timeRange === 'weekly' ? 'active' : ''}
                  onClick={() => setTimeRange('weekly')}
                >
                  Weekly
                </button>
                <button
                  className={timeRange === 'monthly' ? 'active' : ''}
                  onClick={() => setTimeRange('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={timeRange === 'yearly' ? 'active' : ''}
                  onClick={() => setTimeRange('yearly')}
                >
                  Yearly
                </button>
              </div>
            </div>
            <div className="chart-wrapper">
              <Bar data={blogPerformanceData} options={barChartOptions} />
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-header">
              <div className="chart-title">Content Distribution</div>
              <div className="chart-actions">
                <button
                  className={chartType === 'pie' ? 'active' : ''}
                  onClick={() => setChartType('pie')}
                >
                  Pie
                </button>
                <button
                  className={chartType === 'doughnut' ? 'active' : ''}
                  onClick={() => setChartType('doughnut')}
                >
                  Doughnut
                </button>
              </div>
            </div>
            <div className="chart-wrapper">
              {chartType === 'pie' ? (
                <Pie data={contentDistributionData} options={chartOptions} />
              ) : (
                <Doughnut data={contentDistributionData} options={chartOptions} />
              )}
            </div>
          </div>
        </div>

        {/* Additional Charts Row */}
        <div className="charts-section">
          <div className="chart-container">
            <div className="chart-header">
              <div className="chart-title">Blog Status</div>
            </div>
            <div className="chart-wrapper">
              <Doughnut data={blogStatusData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-header">
              <div className="chart-title">Recent Activity</div>
              <div className="chart-actions">
                <button>View All</button>
              </div>
            </div>
            <div className="activity-list">
              {activities.length === 0 ? (
                <div className="text-muted">No recent activity.</div>
              ) : (
                activities.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === 'blog' ? <FaBlog />
                        : activity.type === 'project' ? <FaProjectDiagram />
                          : <FaCommentAlt />}
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">{activity.title}</div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                    <div className={`activity-status ${getActivityStatusClass(activity.status)}`} 
                    style={{ background: 'rgba(42, 222, 84, 0.1)', color: '#2f8b4bff' }} >
                      {activity.status}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        :root {
          --primary-color: #5DC350;
          --secondary-color: #E36324;
          --dark-color: #2D3748;
          --light-color: #F7FAFC;
          --gray-color: #A0AEC0;
          --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          --sidebar-width: 250px;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
          background-color: #F0F2F5;
          color: var(--dark-color);
          line-height: 1.6;
        }

        .dashboard-container {
          min-height: 100vh;
          background-color: #f8fafc;
        }

        /* Top Navigation */
        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          height: 70px;
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-left {
          display: flex;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          font-size: 24px;
          color: var(--primary-color);
        }

        .logo h1 {
          font-size: 20px;
          font-weight: 600;
          color: var(--dark-color);
        }

        .nav-center {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .view-switcher {
          display: flex;
          background: #f1f5f9;
          border-radius: 8px;
          padding: 4px;
        }

        .view-switcher button {
          padding: 8px 16px;
          border: none;
          background: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .view-switcher button.active {
          background: white;
          box-shadow: var(--card-shadow);
          color: var(--primary-color);
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-icons {
          display: flex;
          gap: 15px;
        }

        .nav-icon {
          position: relative;
          background: none;
          border: none;
          font-size: 18px;
          color: var(--gray-color);
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .nav-icon:hover {
          background: #f1f5f9;
          color: var(--primary-color);
        }

        .notification-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: var(--secondary-color);
          color: white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .user-avatar {
          font-size: 32px;
          color: var(--gray-color);
        }

        .user-name {
          font-weight: 500;
        }

        /* Main Content */
        .main-content {
          padding: 30px;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .content-header h2 {
          font-size: 28px;
          font-weight: 600;
          color: var(--dark-color);
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: var(--primary-color);
          color: white;
        }

        .btn-secondary {
          background: white;
          color: var(--dark-color);
          border: 1px solid var(--gray-color);
        }

        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Quick Stats */
        .quick-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: var(--card-shadow);
          display: flex;
          align-items: center;
          gap: 15px;
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .stat-title {
          font-size: 14px;
          color: var(--gray-color);
          margin-bottom: 4px;
        }

        .stat-change {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .stat-change.positive {
          color: var(--primary-color);
        }

        .stat-change.negative {
          color: #FF6B6B;
        }

        /* Cards Grid */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: var(--card-shadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 5px;
          height: 100%;
        }

        .card-blog::before {
          background-color: var(--primary-color);
        }

        .card-project::before {
          background-color: var(--secondary-color);
        }

        .card-testimonial::before {
          background-color: #4C6FFF;
        }

        .card-user::before {
          background-color: #FF6B6B;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .card-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: white;
        }

        .card-blog .card-icon {
          background-color: var(--primary-color);
        }

        .card-project .card-icon {
          background-color: var(--secondary-color);
        }

        .card-testimonial .card-icon {
          background-color: #4C6FFF;
        }

        .card-user .card-icon {
          background-color: #FF6B6B;
        }

        .card-title {
          font-size: 14px;
          color: var(--gray-color);
          margin-bottom: 8px;
        }

        .card-value {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .card-change {
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .card-change.positive {
          color: var(--primary-color);
        }

        .card-change.negative {
          color: #FF6B6B;
        }

        .card-footer {
          border-top: 1px solid #eee;
          padding-top: 15px;
          margin-top: 15px;
        }

        .footer-text {
          font-size: 12px;
          color: var(--gray-color);
        }

        /* Charts Section */
        .charts-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }

        .chart-container {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: var(--card-shadow);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .chart-title {
          font-size: 18px;
          font-weight: 600;
        }

        .chart-actions {
          display: flex;
          gap: 8px;
        }

        .chart-actions button {
          background: none;
          border: none;
          color: var(--gray-color);
          cursor: pointer;
          font-size: 14px;
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .chart-actions button:hover {
          background-color: rgba(93, 195, 80, 0.1);
        }

        .chart-actions button.active {
          color: var(--primary-color);
          font-weight: 600;
          background-color: rgba(93, 195, 80, 0.1);
        }

        .chart-wrapper {
          position: relative;
          height: 300px;
        }

        /* Activity List */
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          background: #f1f5f9;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-color);
          color: white;
          font-size: 16px;
        }

        .activity-content {
          flex: 1;
        }

        .activity-title {
          font-weight: 500;
          margin-bottom: 4px;
        }

        .activity-time {
          font-size: 12px;
          color: var(--gray-color);
        }

        .activity-status {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-published {
          background: rgba(93, 195, 80, 0.1);
          color: var(--primary-color);
        }

        .status-completed {
          background: rgba(227, 99, 36, 0.1);
          color: var(--secondary-color);
        }

        .status-new {
          background: rgba(76, 111, 255, 0.1);
          color: #4C6FFF;
        }

        .status-updated {
          background: rgba(255, 107, 107, 0.1);
          color: #FF6B6B;
        }
        .status-drafted {
          background: rgba(84, 77, 77, 0.1);
          color: #726a6aff;
        }
        .status-Ongoing {
          background: rgba(219, 132, 193, 0.1);
          color: #e94fd2ff;
        }
        .status-Completed {
          background: rgba(114, 205, 135, 0.1);
          color: #2e7142ff;
        }
        .status-Ready to Occupy {
          background: rgba(179, 90, 90, 0.1);
          color: #7b2d2dff;
        }

        /* Animation for count up */
        @keyframes countUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .count-animation {
          animation: countUp 1s ease-out;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .charts-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .top-nav {
            flex-direction: column;
            height: auto;
            padding: 15px;
            gap: 15px;
          }

          .nav-center {
            order: 3;
            width: 100%;
          }

          .view-switcher {
            width: 100%;
            justify-content: center;
          }

          .main-content {
            padding: 20px;
          }

          .content-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .quick-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .cards-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 576px) {
          .quick-stats {
            grid-template-columns: 1fr;
          }

          .nav-right {
            width: 100%;
            justify-content: space-between;
          }

          .stat-card {
            padding: 15px;
          }

          .card {
            padding: 20px;
          }

          .chart-container {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default DataBaseDashboard;