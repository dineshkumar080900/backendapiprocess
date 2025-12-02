// Testimonials.js
import React, { useState, useEffect, useRef } from 'react';
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
  FiVideo,
  FiImage,
  FiFileText,
  FiFilter,
  FiArrowUp,
  FiArrowDown,
  FiCalendar,
  FiUser,
  FiLink,
  FiPlay,
  FiUpload,
  FiX,
  FiFilm,
  FiCamera
} from 'react-icons/fi';
import { 
  FaRegSmile, 
  FaVideo, 
  FaImage, 
  FaQuoteLeft 
} from 'react-icons/fa';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [viewingTestimonial, setViewingTestimonial] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'cr_date', direction: 'desc' });
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    ttype: '',
    ttitle: '',
    tsub: '',
    tdet: '',
    tvlink: '',
    timg: null,
    is_live: 0
  });

  const API_BASE = 'http://mitrahomebackendapi.pemixcels.com/api/testimonials';

  // Statistics
  const stats = {
    total: testimonials.length,
    live: testimonials.filter(t => t.is_live).length,
    video: testimonials.filter(t => t.ttype === 'video').length,
    draft: testimonials.filter(t => !t.is_live).length,
  };

  // Fetch all testimonials
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/all`);
      if (response.data.success) {
        setTestimonials(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('❌ Error loading testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Filter testimonials
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.ttitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.tsub?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.tdet?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || testimonial.ttype === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'live' && testimonial.is_live) ||
                         (filterStatus === 'draft' && !testimonial.is_live);
    return matchesSearch && matchesType && matchesStatus;
  });

  // Sort testimonials
  const sortedTestimonials = React.useMemo(() => {
    if (!sortConfig.key) return filteredTestimonials;
    
    return [...filteredTestimonials].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredTestimonials, sortConfig]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? (checked ? 1 : 0) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear media previews when type changes
    if (name === 'ttype' && value !== formData.ttype) {
      setImagePreview(null);
      setVideoPreview(null);
      setFormData(prev => ({ ...prev, timg: null, tvlink: '' }));
    }
  };

  // Handle file upload for both images and videos
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type based on testimonial type
    if (formData.ttype === 'image') {
      if (!file.type.startsWith('image/')) {
        toast.error('❌ Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('❌ Image size should be less than 5MB');
        return;
      }
    } else if (formData.ttype === 'video') {
      if (!file.type.startsWith('video/')) {
        toast.error('❌ Please select a valid video file');
        return;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error('❌ Video size should be less than 50MB');
        return;
      }
    }

    setFormData(prev => ({ ...prev, timg: file }));

    // Create preview
    if (formData.ttype === 'image') {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setVideoPreview(null);
    } else if (formData.ttype === 'video') {
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
      setImagePreview(null);
    }
  };

  // Handle video link input
  const handleVideoLinkChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, tvlink: value }));
    
    // Clear uploaded file when video link is provided
    if (value) {
      setFormData(prev => ({ ...prev, timg: null }));
      setVideoPreview(null);
      setImagePreview(null);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      ttype: '',
      ttitle: '',
      tsub: '',
      tdet: '',
      tvlink: '',
      timg: null,
      is_live: 0
    });
    setEditingTestimonial(null);
    setImagePreview(null);
    setVideoPreview(null);
  };

  // Remove uploaded media
  const removeMedia = () => {
    setFormData(prev => ({ ...prev, timg: null, tvlink: '' }));
    setImagePreview(null);
    setVideoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validate form before submission
  const validateForm = () => {
    if (!formData.ttype) {
      toast.error('❌ Please select a testimonial type');
      return false;
    }
    if (!formData.ttitle.trim()) {
      toast.error('❌ Please enter a title');
      return false;
    }

    // Validate media based on type
    if (formData.ttype === 'video') {
      if (!formData.tvlink && !formData.timg) {
        toast.error('❌ Please provide either a video link or upload a video file');
        return false;
      }
    } else if (formData.ttype === 'image') {
      if (!formData.timg) {
        toast.error('❌ Please upload an image file');
        return false;
      }
    }

    return true;
  };

  // ✅ Add new testimonial or update existing
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setUploading(true);
      const submitData = new FormData();
      
      // Append all form data
      submitData.append('ttype', formData.ttype);
      submitData.append('ttitle', formData.ttitle);
      submitData.append('tsub', formData.tsub);
      submitData.append('tdet', formData.tdet);
      submitData.append('tvlink', formData.tvlink);
      submitData.append('is_live', formData.is_live);
      
      // Append file if exists (for both image and video uploads)
      if (formData.timg) {
        submitData.append('timg', formData.timg);
      }

      let response;
      if (editingTestimonial) {
        // Update testimonial
        response = await axios.put(`${API_BASE}/update/${editingTestimonial.tid}`, submitData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload Progress: ${progress}%`);
          }
        });
      } else {
        // Create new testimonial
        response = await axios.post(`${API_BASE}/add`, submitData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload Progress: ${progress}%`);
          }
        });
      }

      if (response.data.success) {
        toast.success(`✅ ${editingTestimonial ? 'Testimonial updated' : 'Testimonial added'} successfully!`);
        setShowModal(false);
        resetForm();
        fetchTestimonials();
      } else {
        throw new Error(response.data.message || 'Operation failed');
      }

    } catch (error) {
      console.error('Error saving testimonial:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error saving testimonial';
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Edit testimonial
  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      ttype: testimonial.ttype || '',
      ttitle: testimonial.ttitle || '',
      tsub: testimonial.tsub || '',
      tdet: testimonial.tdet || '',
      tvlink: testimonial.tvlink || '',
      timg: null,
      is_live: testimonial.is_live || 0
    });
    
    // Set appropriate preview based on type
    if (testimonial.ttype === 'image' && testimonial.timg) {
      setImagePreview(testimonial.timg);
    } else if (testimonial.ttype === 'video' && testimonial.timg) {
      setVideoPreview(testimonial.timg);
    } else if (testimonial.ttype === 'video' && testimonial.tvlink) {
      setVideoPreview(null); // For video links, we'll use the link directly
    }
    
    setShowModal(true);
  };

  // View testimonial details
  const handleView = (testimonial) => {
    setViewingTestimonial(testimonial);
    setShowViewModal(true);
  };

  // ✅ Toggle live status
  const toggleLiveStatus = async (id, currentStatus) => {
    try {
      const response = await axios.put(`${API_BASE}/update/${id}`, {
        is_live: currentStatus ? 0 : 1
      });
      
      if (response.data.success) {
        toast.success(currentStatus ? '📝 Testimonial moved to draft' : '🚀 Testimonial published!');
        fetchTestimonials();
      } else {
        throw new Error(response.data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error updating status';
      toast.error(`❌ ${errorMessage}`);
    }
  };

  // ✅ Delete testimonial
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial? This action cannot be undone.')) {
      try {
        const response = await axios.delete(`${API_BASE}/delete/${id}`);
        
        if (response.data.success) {
          toast.success('🗑️ Testimonial deleted successfully!');
          fetchTestimonials();
        } else {
          throw new Error(response.data.message || 'Delete failed');
        }
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Error deleting testimonial';
        toast.error(`❌ ${errorMessage}`);
      }
    }
  };

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <FaVideo style={{ color: '#ef4444', fontSize: '1.2rem' }} />;
      case 'image': return <FaImage style={{ color: '#10b981', fontSize: '1.2rem' }} />;
      case 'text': return <FaQuoteLeft style={{ color: '#667eea', fontSize: '1.2rem' }} />;
      default: return <FaRegSmile style={{ color: '#6b7280', fontSize: '1.2rem' }} />;
    }
  };

  // Get media preview for table view
  const getMediaPreview = (testimonial) => {
    if (testimonial.ttype === 'video') {
      if (testimonial.tvlink) {
        // YouTube thumbnail
        const youtubeMatch = testimonial.tvlink.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (youtubeMatch) {
          return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`;
        }
      } else if (testimonial.timg) {
        // Uploaded video - show video icon or first frame if available
        return testimonial.timg;
      }
    } else if (testimonial.ttype === 'image' && testimonial.timg) {
      return testimonial.timg;
    }
    return null;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (isLive) => {
    return isLive ? 
      { background: '#d1fae5', color: '#065f46', border: '#a7f3d0' } : 
      { background: '#fef3c7', color: '#92400e', border: '#fde68a' };
  };

  // Get type color
  const getTypeColor = (type) => {
    switch (type) {
      case 'video': return { background: '#fee2e2', color: '#dc2626', border: '#fecaca' };
      case 'image': return { background: '#d1fae5', color: '#059669', border: '#a7f3d0' };
      case 'text': return { background: '#e0e7ff', color: '#3730a3', border: '#c7d2fe' };
      default: return { background: '#f3f4f6', color: '#374151', border: '#e5e7eb' };
    }
  };

  // Render media upload section based on selected type
  const renderMediaUploadSection = () => {
    switch (formData.ttype) {
      case 'image':
        return (
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.95rem'
            }}>
              📸 Image Upload *
            </label>
            <div style={{
              border: '2px dashed #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
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
                      border: '2px solid #e2e8f0'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={removeMedia}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <FiX /> Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <FiCamera style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '15px' }} />
                  <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '1rem' }}>
                    Drag & drop or click to upload image
                  </p>
                  <p style={{ margin: '0 0 15px 0', color: '#94a3b8', fontSize: '0.9rem' }}>
                    Supports: JPG, PNG, GIF • Max: 5MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 'video':
        return (
          <>
            {/* Video Link Input */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.95rem'
              }}>
                🎥 Video Link (YouTube/Vimeo)
              </label>
              <input
                type="url"
                name="tvlink"
                value={formData.tvlink}
                onChange={handleVideoLinkChange}
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
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
              <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                Or upload a video file below
              </p>
            </div>

            {/* Video File Upload */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.95rem'
              }}>
                🎬 Video File Upload
              </label>
              <div style={{
                border: '2px dashed #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                background: videoPreview ? 'transparent' : '#f9f9f9'
              }}>
                {videoPreview ? (
                  <div>
                    <video 
                      src={videoPreview} 
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '10px',
                        marginBottom: '15px',
                        border: '2px solid #e2e8f0'
                      }}
                      controls
                    />
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button
                        type="button"
                        onClick={removeMedia}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <FiX /> Remove Video
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <FiFilm style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '15px' }} />
                    <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '1rem' }}>
                      Drag & drop or click to upload video
                    </p>
                    <p style={{ margin: '0 0 15px 0', color: '#94a3b8', fontSize: '0.9rem' }}>
                      Supports: MP4, MOV, AVI • Max: 50MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        );

      case 'text':
        return (
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.95rem'
            }}>
              📝 Text Testimonial
            </label>
            <div style={{
              background: '#f8fafc',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <FiFileText style={{ fontSize: '2rem', marginBottom: '10px' }} />
              <p style={{ margin: '0', fontSize: '0.9rem' }}>
                Text testimonials don't require media upload. Focus on writing compelling content.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div style={{
            background: '#f8fafc',
            padding: '30px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            color: '#64748b'
          }}>
            <FaRegSmile style={{ fontSize: '2.5rem', marginBottom: '15px' }} />
            <p style={{ margin: '0', fontSize: '1rem', fontWeight: '500' }}>
              Please select a testimonial type to see upload options
            </p>
          </div>
        );
    }
  };

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
            Testimonials Management
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#64748b',
            margin: '0'
          }}>
            Manage customer testimonials and reviews
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
          Add New Testimonial
        </button>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Total Testimonials */}
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
            <FaRegSmile />
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
              Total Testimonials
            </p>
          </div>
        </div>

        {/* Live Testimonials */}
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
              {stats.live}
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: '#64748b',
              margin: '0'
            }}>
              Live Testimonials
            </p>
          </div>
        </div>

        {/* Video Testimonials */}
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
            <FiVideo />
          </div>
          <div>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 4px 0'
            }}>
              {stats.video}
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: '#64748b',
              margin: '0'
            }}>
              Video Testimonials
            </p>
          </div>
        </div>

        {/* Draft Testimonials */}
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
            <FiEyeOff />
          </div>
          <div>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 4px 0'
            }}>
              {stats.draft}
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: '#64748b',
              margin: '0'
            }}>
              Draft Testimonials
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
            placeholder="Search testimonials..."
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
            <option value="live">Live</option>
            <option value="draft">Draft</option>
          </select>
          
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
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
            <option value="all">All Types</option>
            <option value="video">Video</option>
            <option value="text">Text</option>
            <option value="image">Image</option>
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
            }}>Loading testimonials...</p>
          </div>
        ) : sortedTestimonials.length === 0 ? (
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
            }}>No testimonials found</h3>
            <p style={{
              fontSize: '1rem',
              margin: '0 0 25px 0'
            }}>Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
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
                onClick={() => handleSort('ttitle')}
                >
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    Testimonial
                    {sortConfig.key === 'ttitle' && (
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
                onClick={() => handleSort('ttype')}
                >
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    Type
                    {sortConfig.key === 'ttype' && (
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
                onClick={() => handleSort('is_live')}
                >
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    Status
                    {sortConfig.key === 'is_live' && (
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
                onClick={() => handleSort('cr_date')}
                >
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    Date
                    {sortConfig.key === 'cr_date' && (
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
              {sortedTestimonials.map(testimonial => (
                <tr key={testimonial.tid} style={{
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
                      {getMediaPreview(testimonial) ? (
                        <div style={{
                          position: 'relative',
                          width: '80px',
                          height: '60px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: '0',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleView(testimonial)}
                        >
                          <img 
                            src={getMediaPreview(testimonial)} 
                            alt="Media preview"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          {testimonial.ttype === 'video' && (
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              background: 'rgba(0,0,0,0.7)',
                              borderRadius: '50%',
                              width: '30px',
                              height: '30px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white'
                            }}>
                              <FiPlay style={{ fontSize: '0.8rem' }} />
                            </div>
                          )}
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
                          {testimonial.ttype === 'video' ? <FiVideo /> : 
                           testimonial.ttype === 'image' ? <FiImage /> : 
                           <FiFileText />}
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
                        onClick={() => handleView(testimonial)}
                        >
                          {testimonial.ttitle}
                        </h4>
                        <p style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#64748b',
                          fontSize: '0.875rem',
                          margin: '0 0 8px 0'
                        }}>
                          <FiUser style={{ fontSize: '0.8rem' }} />
                          {testimonial.tsub || 'Unknown Author'}
                        </p>
                        <p style={{
                          color: '#94a3b8',
                          fontSize: '0.875rem',
                          margin: '0',
                          lineHeight: '1.4',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleView(testimonial)}
                        >
                          {testimonial.tdet?.substring(0, 60)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {getTypeIcon(testimonial.ttype)}
                      <span style={{
                        textTransform: 'capitalize',
                        fontWeight: '500',
                        color: '#475569'
                      }}>
                        {testimonial.ttype}
                      </span>
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
                      background: testimonial.is_live ? '#d1fae5' : '#fef3c7',
                      color: testimonial.is_live ? '#065f46' : '#92400e'
                    }}>
                      {testimonial.is_live ? (
                        <>
                          <FiEye style={{ fontSize: '0.8rem' }} />
                          Live
                        </>
                      ) : (
                        <>
                          <FiEyeOff style={{ fontSize: '0.8rem' }} />
                          Draft
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
                      {new Date(testimonial.cr_date).toLocaleDateString()}
                    </div>
                  </td>
                  
                  <td style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                    <div style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button
                        onClick={() => handleView(testimonial)}
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
                        onClick={() => toggleLiveStatus(testimonial.tid, testimonial.is_live)}
                        style={{
                          background: testimonial.is_live ? '#f59e0b' : '#10b981',
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
                        title={testimonial.is_live ? 'Make Draft' : 'Make Live'}
                      >
                        {testimonial.is_live ? <FiEyeOff /> : <FiEye />}
                      </button>
                      <button
                        onClick={() => handleEdit(testimonial)}
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
                        onClick={() => handleDelete(testimonial.tid)}
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
            maxWidth: '800px',
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
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
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

            <form onSubmit={handleSubmit} style={{ padding: '30px', maxHeight: 'calc(90vh - 100px)', overflowY: 'auto' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '25px'
              }}>
                <div>
                  <div style={{ marginBottom: '25px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '0.95rem'
                    }}>
                      Type *
                    </label>
                    <select 
                      name="ttype" 
                      value={formData.ttype}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        background: 'white'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Select Type</option>
                      <option value="video">🎥 Video Testimonial</option>
                      <option value="text">📝 Text Testimonial</option>
                      <option value="image">🖼️ Image Testimonial</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '25px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '0.95rem'
                    }}>
                      Title *
                    </label>
                    <input
                      type="text"
                      name="ttitle"
                      value={formData.ttitle}
                      onChange={handleInputChange}
                      placeholder="Enter testimonial title"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem',
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

                  <div style={{ marginBottom: '25px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '0.95rem'
                    }}>
                      Author/Subtitle
                    </label>
                    <input
                      type="text"
                      name="tsub"
                      value={formData.tsub}
                      onChange={handleInputChange}
                      placeholder="Enter author name or subtitle"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem',
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

                  <div style={{ marginBottom: '25px' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      <input
                        type="checkbox"
                        name="is_live"
                        checked={formData.is_live === 1}
                        onChange={handleInputChange}
                        style={{ transform: 'scale(1.2)' }}
                      />
                      Publish this testimonial
                    </label>
                  </div>
                </div>

                <div>
                  {/* Dynamic Media Upload Section */}
                  {renderMediaUploadSection()}

                  <div style={{ marginBottom: '25px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '0.95rem'
                    }}>
                      Details
                    </label>
                    <textarea
                      name="tdet"
                      value={formData.tdet}
                      onChange={handleInputChange}
                      placeholder="Enter testimonial details..."
                      rows="6"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        resize: 'vertical',
                        minHeight: '120px',
                        fontFamily: 'inherit'
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
                </div>
              </div>

              <div style={{
                paddingTop: '25px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                gap: '15px',
                justifyContent: 'flex-end'
              }}>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  style={{
                    background: 'transparent',
                    color: '#64748b',
                    border: '2px solid #e2e8f0',
                    padding: '12px 25px',
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
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={uploading}
                  style={{
                    background: uploading ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 30px',
                    borderRadius: '10px',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: uploading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.3)',
                    opacity: uploading ? 0.7 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!uploading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!uploading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                    }
                  }}
                >
                  {uploading ? 'Uploading...' : (editingTestimonial ? 'Update Testimonial' : 'Add Testimonial')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal (Same as before) */}
      {showViewModal && viewingTestimonial && (
        // ... View Modal Code (same as previous implementation)
        <div>View Modal Content</div>
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

export default Testimonials;