// Blogs.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiEyeOff,
  FiImage,
  FiFileText,
  FiFilter,
  FiArrowUp,
  FiArrowDown,
  FiCalendar,
  FiUser,
  FiUpload,
  FiX,
  FiFolder,
  FiTag
} from 'react-icons/fi';
import { 
  FaRegNewspaper,
  FaBlog,
  FaImage,
  FaRegClock
} from 'react-icons/fa';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [viewingBlog, setViewingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    image: null,
    status: 'active'
  });

  const API_BASE = 'http://mitrahomebackendapi.pemixcels.com/api/blogs';

  // Statistics
  const stats = {
    total: blogs.length,
    active: blogs.filter(b => b.status === 'active').length,
    inactive: blogs.filter(b => b.status === 'inactive').length,
    categories: [...new Set(blogs.map(b => b.category))].length,
  };

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/all`);
      if (response.data.blogs) {
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('❌ Error loading blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter blogs
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || blog.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || blog.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort blogs
  const sortedBlogs = React.useMemo(() => {
    if (!sortConfig.key) return filteredBlogs;
    
    return [...filteredBlogs].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredBlogs, sortConfig]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('❌ Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('❌ Image size should be less than 5MB');
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      title: '',
      image: null,
      status: 'active'
    });
    setEditingBlog(null);
    setImagePreview(null);
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  // Validate form
  const validateForm = () => {
    if (!formData.category.trim()) {
      toast.error('❌ Please enter a category');
      return false;
    }
    if (!formData.title.trim()) {
      toast.error('❌ Please enter a title');
      return false;
    }
    if (!editingBlog && !formData.image) {
      toast.error('❌ Please upload an image');
      return false;
    }
    return true;
  };

  // ✅ Add new blog or update existing
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setUploading(true);
      const submitData = new FormData();
      
      submitData.append('category', formData.category);
      submitData.append('title', formData.title);
      submitData.append('status', formData.status);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      let response;
      if (editingBlog) {
        response = await axios.put(`${API_BASE}/${editingBlog.id}`, submitData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
          }
        });
      } else {
        response = await axios.post(`${API_BASE}/add`, submitData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
          }
        });
      }

      if (response.data.message) {
        toast.success(`✅ ${editingBlog ? 'Blog updated' : 'Blog created'} successfully!`);
        setShowModal(false);
        resetForm();
        fetchBlogs();
      } else {
        throw new Error(response.data.error || 'Operation failed');
      }

    } catch (error) {
      console.error('Error saving blog:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Error saving blog';
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Edit blog
  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      category: blog.category || '',
      title: blog.title || '',
      image: null,
      status: blog.status || 'active'
    });
    
    if (blog.image) {
      setImagePreview(`http://mitrahomebackendapi.pemixcels.com${blog.image}`);
    }
    
    setShowModal(true);
  };

  // View blog details
  const handleView = (blog) => {
    setViewingBlog(blog);
    setShowViewModal(true);
  };

  // ✅ Toggle status
  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await axios.put(`${API_BASE}/${id}`, {
        status: newStatus
      });
      
      if (response.data.message) {
        toast.success(`Blog ${newStatus === 'active' ? 'activated' : 'deactivated'}!`);
        fetchBlogs();
      } else {
        throw new Error(response.data.error || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Error updating status';
      toast.error(`❌ ${errorMessage}`);
    }
  };

  // ✅ Delete blog
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      try {
        const response = await axios.delete(`${API_BASE}/${id}`);
        
        if (response.data.message) {
          toast.success('🗑️ Blog deleted successfully!');
          fetchBlogs();
        } else {
          throw new Error(response.data.error || 'Delete failed');
        }
      } catch (error) {
        console.error('Error deleting blog:', error);
        const errorMessage = error.response?.data?.error || error.message || 'Error deleting blog';
        toast.error(`❌ ${errorMessage}`);
      }
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    return status === 'active' ? 
      { background: '#d1fae5', color: '#065f46', border: '#a7f3d0' } : 
      { background: '#fef3c7', color: '#92400e', border: '#fde68a' };
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      technology: { background: '#e0e7ff', color: '#3730a3', border: '#c7d2fe' },
      business: { background: '#d1fae5', color: '#059669', border: '#a7f3d0' },
      lifestyle: { background: '#fce7f3', color: '#be185d', border: '#fbcfe8' },
      health: { background: '#dcfce7', color: '#166534', border: '#bbf7d0' },
      travel: { background: '#fef3c7', color: '#92400e', border: '#fde68a' },
      food: { background: '#fed7aa', color: '#c2410c', border: '#fdba74' },
      default: { background: '#f3f4f6', color: '#374151', border: '#e5e7eb' }
    };
    
    const categoryKey = category?.toLowerCase() || 'default';
    return colors[categoryKey] || colors.default;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get unique categories
  const categories = [...new Set(blogs.map(blog => blog.category))].filter(Boolean);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: '#f8fafc',
      minHeight: '100vh'
    }}>
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 8px 0'
          }}>
            Blog Management
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#64748b',
            margin: '0'
          }}>
            Manage your blog posts and content
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
          }}
        >
          <FiPlus style={{ fontSize: '1.1rem' }} />
          Add New Blog
        </button>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Total Blogs */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-4px)';
          e.target.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }}
        >
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: 'white'
          }}>
            <FaBlog />
          </div>
          <div>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 4px 0'
            }}>
              {stats.total}
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: '#64748b',
              margin: '0'
            }}>
              Total Blogs
            </p>
          </div>
        </div>

        {/* Active Blogs */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-4px)';
          e.target.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }}
        >
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: 'white'
          }}>
            <FiEye />
          </div>
          <div>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 4px 0'
            }}>
              {stats.active}
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: '#64748b',
              margin: '0'
            }}>
              Active Blogs
            </p>
          </div>
        </div>

        {/* Categories */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-4px)';
          e.target.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }}
        >
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: 'white'
          }}>
            <FiFolder />
          </div>
          <div>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 4px 0'
            }}>
              {stats.categories}
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: '#64748b',
              margin: '0'
            }}>
              Categories
            </p>
          </div>
        </div>

        {/* Inactive Blogs */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-4px)';
          e.target.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }}
        >
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: 'white'
          }}>
            <FiEyeOff />
          </div>
          <div>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 4px 0'
            }}>
              {stats.inactive}
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: '#64748b',
              margin: '0'
            }}>
              Inactive Blogs
            </p>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '25px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          position: 'relative',
          flex: '1',
          minWidth: '300px'
        }}>
          <FiSearch style={{
            position: 'absolute',
            left: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94a3b8',
            fontSize: '1.1rem'
          }} />
          <input
            type="text"
            placeholder="Search blogs by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 20px 12px 45px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '1rem',
              background: 'white',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '1rem',
              background: 'white',
              cursor: 'pointer',
              minWidth: '140px'
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '1rem',
              background: 'white',
              cursor: 'pointer',
              minWidth: '140px'
            }}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 40px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f1f5f9',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p style={{
              color: '#64748b',
              fontSize: '1rem',
              margin: '0'
            }}>Loading blogs...</p>
          </div>
        ) : sortedBlogs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 40px',
            color: '#64748b'
          }}>
            <FiFilter style={{
              fontSize: '4rem',
              color: '#cbd5e1',
              marginBottom: '20px'
            }} />
            <h3 style={{
              fontSize: '1.5rem',
              color: '#475569',
              margin: '0 0 12px 0'
            }}>No blogs found</h3>
            <p style={{
              fontSize: '1rem',
              margin: '0 0 25px 0'
            }}>Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
                setFilterStatus('all');
              }}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr>
                <th style={{
                  background: '#f8fafc',
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#475569',
                  borderBottom: '2px solid #e2e8f0',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  cursor: 'pointer'
                }}
                onClick={() => handleSort('title')}
                >
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    Blog
                    {sortConfig.key === 'title' && (
                      sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />
                    )}
                  </span>
                </th>
                <th style={{
                  background: '#f8fafc',
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#475569',
                  borderBottom: '2px solid #e2e8f0',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  cursor: 'pointer'
                }}
                onClick={() => handleSort('category')}
                >
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    Category
                    {sortConfig.key === 'category' && (
                      sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />
                    )}
                  </span>
                </th>
                <th style={{
                  background: '#f8fafc',
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#475569',
                  borderBottom: '2px solid #e2e8f0',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  cursor: 'pointer'
                }}
                onClick={() => handleSort('status')}
                >
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    Status
                    {sortConfig.key === 'status' && (
                      sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />
                    )}
                  </span>
                </th>
                <th style={{
                  background: '#f8fafc',
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#475569',
                  borderBottom: '2px solid #e2e8f0',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  cursor: 'pointer'
                }}
                onClick={() => handleSort('created_at')}
                >
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    Created
                    {sortConfig.key === 'created_at' && (
                      sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />
                    )}
                  </span>
                </th>
                <th style={{
                  background: '#f8fafc',
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#475569',
                  borderBottom: '2px solid #e2e8f0',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedBlogs.map(blog => (
                <tr key={blog.id} style={{
                  transition: 'background 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                }}
                >
                  <td style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '15px'
                    }}>
                      {blog.image ? (
                        <div style={{
                          position: 'relative',
                          width: '80px',
                          height: '60px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: '0',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleView(blog)}
                        >
                          <img 
                            src={`http://mitrahomebackendapi.pemixcels.com${blog.image}`} 
                            alt={blog.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div style={{
                          width: '80px',
                          height: '60px',
                          borderRadius: '8px',
                          background: '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#94a3b8',
                          flexShrink: '0'
                        }}>
                          <FiImage style={{ fontSize: '1.2rem' }} />
                        </div>
                      )}
                      <div style={{ flex: '1' }}>
                        <h4 style={{
                          fontWeight: '600',
                          color: '#1e293b',
                          margin: '0 0 6px 0',
                          fontSize: '1rem',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleView(blog)}
                        >
                          {blog.title}
                        </h4>
                        <p style={{
                          color: '#64748b',
                          fontSize: '0.875rem',
                          margin: '0',
                          lineHeight: '1.4'
                        }}>
                          Code: {blog.blogscontetcount}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      background: getCategoryColor(blog.category).background,
                      color: getCategoryColor(blog.category).color,
                      border: `1px solid ${getCategoryColor(blog.category).border}`
                    }}>
                      <FiTag style={{ fontSize: '0.7rem' }} />
                      {blog.category}
                    </div>
                  </td>
                  
                  <td style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      background: getStatusColor(blog.status).background,
                      color: getStatusColor(blog.status).color
                    }}>
                      {blog.status === 'active' ? (
                        <>
                          <FiEye style={{ fontSize: '0.8rem' }} />
                          Active
                        </>
                      ) : (
                        <>
                          <FiEyeOff style={{ fontSize: '0.8rem' }} />
                          Inactive
                        </>
                      )}
                    </div>
                  </td>
                  
                  <td style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#64748b',
                      fontSize: '0.875rem'
                    }}>
                      <FiCalendar style={{ fontSize: '0.9rem' }} />
                      {blog.created_at ? formatDate(blog.created_at) : 'N/A'}
                    </div>
                  </td>
                  
                  <td style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                    <div style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button
                        onClick={() => handleView(blog)}
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                        title="View Details"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => toggleStatus(blog.id, blog.status)}
                        style={{
                          background: blog.status === 'active' ? '#f59e0b' : '#10b981',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                        title={blog.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {blog.status === 'active' ? <FiEyeOff /> : <FiEye />}
                      </button>
                      <button
                        onClick={() => handleEdit(blog)}
                        style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          border: '1px solid #e2e8f0',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                        title="Edit"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '1000',
          padding: '20px',
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            animation: 'modalSlideIn 0.3s ease'
          }}>
            <div style={{
              padding: '25px 30px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <h2 style={{
                margin: '0',
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>
                {editingBlog ? 'Edit Blog' : 'Add New Blog'}
              </h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: 'white',
                  cursor: 'pointer',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                &times;
              </button>
            </div>
<form 
  onSubmit={handleSubmit} 
  style={{ 
    padding: '30px', 
    maxHeight: 'calc(90vh - 100px)', 
    overflowY: 'auto' 
  }}
>
  {/* 🔥 2 COLUMN GRID CONTAINER */}
  <div 
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '25px',
    }}
  >

    {/* CATEGORY */}
    <div style={{ gridColumn: 'span 1' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px', 
        fontWeight: '600', 
        color: '#374151' 
      }}>
        Category *
      </label>
      <input
        type="text"
        name="category"
        value={formData.category}
        onChange={handleInputChange}
        placeholder="Enter blog category"
        required
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
        }}
      />
    </div>

    {/* TITLE */}
    <div style={{ gridColumn: 'span 1' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px', 
        fontWeight: '600', 
        color: '#374151' 
      }}>
        Title *
      </label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        placeholder="Enter blog title"
        required
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
        }}
      />
    </div>

    {/* FULL-WIDTH IMAGE UPLOAD */}
    <div style={{ gridColumn: 'span 2' }}>
      <label style={{
        display: 'block', 
        marginBottom: '8px',
        fontWeight: '600',
        color: '#374151'
      }}>
        {editingBlog ? 'Update Image' : 'Upload Image *'}
      </label>

      <div style={{
        border: '2px dashed #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
        background: imagePreview ? 'transparent' : '#f9f9f9'
      }}>

        {imagePreview ? (
          <div>
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                borderRadius: '10px',
                marginBottom: '15px',
              }}
            />
            <button
              type="button"
              onClick={removeImage}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Remove Image
            </button>
          </div>
        ) : (
          <div>
            <FiUpload style={{ fontSize: '2.5rem', color: '#cbd5e1' }} />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                width: '100%',
                marginTop: '15px',
              }}
            />
          </div>
        )}
      </div>
    </div>

    {/* STATUS */}
    <div style={{ gridColumn: 'span 1' }}>
      <label style={{
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: '#374151'
      }}>
        Status
      </label>
      <select 
        name="status" 
        value={formData.status}
        onChange={handleInputChange}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
        }}
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

  </div> {/* END GRID */}

  {/* FOOTER BUTTONS */}
  <div style={{
    paddingTop: '25px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    marginTop: '20px'
  }}>
    <button 
      type="button"
      onClick={() => { setShowModal(false); resetForm(); }}
      style={{
        background: 'transparent',
        border: '2px solid #e2e8f0',
        padding: '12px 25px',
        borderRadius: '10px',
        cursor: 'pointer',
      }}
    >
      Cancel
    </button>
    <button 
      type="submit"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        border: 'none',
        padding: '12px 30px',
        borderRadius: '10px',
        cursor: 'pointer',
      }}
    >
      {editingBlog ? 'Update Blog' : 'Create Blog'}
    </button>
  </div>
</form>

          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && viewingBlog && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '1000',
          padding: '20px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
            animation: 'modalSlideIn 0.3s ease'
          }}>
            <div style={{
              padding: '25px 30px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <div>
                <h2 style={{
                  margin: '0 0 8px 0',
                  fontSize: '1.5rem',
                  fontWeight: '600'
                }}>
                  Blog Details
                </h2>
                <p style={{
                  margin: '0',
                  opacity: '0.9',
                  fontSize: '0.95rem'
                }}>
                  Complete information about this blog
                </p>
              </div>
              <button 
                onClick={() => setShowViewModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: 'white',
                  cursor: 'pointer',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                &times;
              </button>
            </div>

            <div style={{
              padding: '30px',
              maxHeight: 'calc(90vh - 100px)',
              overflowY: 'auto'
            }}>
              {viewingBlog.image && (
                <div style={{
                  marginBottom: '25px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <img 
                    src={`http://mitrahomebackendapi.pemixcels.com${viewingBlog.image}`} 
                    alt={viewingBlog.title}
                    style={{
                      width: '100%',
                      maxHeight: '300px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#64748b',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Title
                </label>
                <p style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: '0',
                  padding: '12px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  {viewingBlog.title}
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#64748b',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Category
                </label>
                <div style={{
                  padding: '12px',
                  background: getCategoryColor(viewingBlog.category).background,
                  color: getCategoryColor(viewingBlog.category).color,
                  border: `1px solid ${getCategoryColor(viewingBlog.category).border}`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '500'
                }}>
                  <FiTag style={{ fontSize: '0.9rem' }} />
                  {viewingBlog.category}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#64748b',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Status
                </label>
                <div style={{
                  padding: '12px',
                  background: getStatusColor(viewingBlog.status).background,
                  color: getStatusColor(viewingBlog.status).color,
                  border: `1px solid ${getStatusColor(viewingBlog.status).border}`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                  letterSpacing: '0.5px'
                }}>
                  {viewingBlog.status === 'active' ? <FiEye /> : <FiEyeOff />}
                  {viewingBlog.status === 'active' ? 'Active & Published' : 'Inactive & Hidden'}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#64748b',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Blog Code
                </label>
                <p style={{
                  fontSize: '1rem',
                  color: '#475569',
                  margin: '0',
                  padding: '12px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontFamily: 'monospace',
                  fontWeight: '600'
                }}>
                  {viewingBlog.blogscontetcount}
                </p>
              </div>

              {viewingBlog.created_at && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#64748b',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Created Date
                  </label>
                  <p style={{
                    fontSize: '1rem',
                    color: '#475569',
                    margin: '0',
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <FiCalendar style={{ fontSize: '0.9rem' }} />
                    {formatDate(viewingBlog.created_at)}
                  </p>
                </div>
              )}

              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'flex-end',
                marginTop: '30px',
                paddingTop: '20px',
                borderTop: '1px solid #e2e8f0'
              }}>
                <button 
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(viewingBlog);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  <FiEdit />
                  Edit Blog
                </button>
                <button 
                  onClick={() => setShowViewModal(false)}
                  style={{
                    background: 'transparent',
                    color: '#64748b',
                    border: '2px solid #e2e8f0',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#f8fafc';
                    e.target.style.color = '#475569';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#64748b';
                  }}
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Blogs;