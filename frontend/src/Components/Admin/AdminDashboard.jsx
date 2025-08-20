import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('videos');
  const [showAddForm, setShowAddForm] = useState(false);
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videosError, setVideosError] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    videoUrl: '', // changed from url to videoUrl
    category: ''
  });
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/admin/login');
  };

  // Handle add video button
  const handleAddVideoClick = () => {
    setShowAddForm(!showAddForm);
  };

  // Fetch videos
  const fetchVideos = async () => {
    try {
      setVideosLoading(true);
      setVideosError(null);
      const resp = await axios.get('http://localhost:5000/api/videos');
      setVideos(resp.data || []);
    } catch (err) {
      setVideosError(err.response?.data?.message || err.message);
    } finally {
      setVideosLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/videos/${videoId}`);
      // Refresh list after delete
      fetchVideos();
    } catch (err) {
      alert('Failed to delete video: ' + (err.response?.data?.message || err.message));
    }
  };

  // Fetch users list
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      const resp = await axios.get('http://localhost:5000/api/users');
      setUsers(Array.isArray(resp.data) ? resp.data : []);
    } catch (err) {
      setUsersError(err.response?.data?.message || err.message);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'videos') fetchVideos();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewVideo({ ...newVideo, [e.target.name]: e.target.value });
  };

  // Handle form submit (mock)
  const handleAddVideoSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token || typeof token !== 'string') {
        alert('Your session has expired. Please log in again.');
        navigate('/admin/login');
        return;
      }

      let decoded;
      try {
        decoded = jwtDecode(token);
      } catch (decodeErr) {
        alert('Invalid session token. Please log in again.');
        navigate('/admin/login');
        return;
      }

      const authorId = decoded.userId || decoded.id; // support both payload shapes
      if (!authorId) {
        alert('Invalid user identity. Please log in again.');
        navigate('/admin/login');
        return;
      }

      const videoData = {
        ...newVideo,
        author: authorId
      };

      await axios.post('http://localhost:5000/api/videos', videoData, token ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      } : undefined);
      alert(`Video "${newVideo.title}" added!`);
      setShowAddForm(false);
      setNewVideo({ title: '', description: '', videoUrl: '', category: '' });
    } catch (err) {
      alert('Failed to add video: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-navbar">
        <div className="nav-left">
          <div className="brand">Streamify Admin</div>
          <div className="nav-links">
            <button
              type="button"
              className={`nav-link ${activeTab === 'videos' ? 'active' : ''}`}
              onClick={() => setActiveTab('videos')}
            >
              Videos
            </button>
            <button
              type="button"
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
          </div>
        </div>
        <div className="nav-right">
          <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="content-section">
        {activeTab === 'videos' && (
          <>
            <div className="section-header">
              <h2>Video Management</h2>
              <button className="add-btn" onClick={handleAddVideoClick}>
                {showAddForm ? 'Cancel' : 'Add New Video'}
              </button>
            </div>

            {showAddForm && (
              <form className="add-video-form" onSubmit={handleAddVideoSubmit}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    name="title"
                    value={newVideo.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    name="description"
                    value={newVideo.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Video URL</label>
                  <input
                    name="videoUrl" // changed from url to videoUrl
                    value={newVideo.videoUrl}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input
                    name="category"
                    value={newVideo.category}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button className="submit-btn" type="submit">Add Video</button>
              </form>
            )}

            <div className="videos-table-container">
              <table className="videos-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Author</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videosLoading && (
                    <tr><td colSpan={4} className="loading-cell">Loading videos...</td></tr>
                  )}
                  {!videosLoading && videosError && (
                    <tr><td colSpan={4} className="empty-cell">{videosError}</td></tr>
                  )}
                  {!videosLoading && !videosError && videos.length === 0 && (
                    <tr><td colSpan={4} className="empty-cell">No videos found</td></tr>
                  )}
                  {!videosLoading && !videosError && videos.map((v) => (
                    <tr key={v._id}>
                      <td>{v.title}</td>
                      <td>{v.description}</td>
                      <td>{v.author?.fullname || v.author?.email || '—'}</td>
                      <td>{new Date(v.createdAt).toLocaleString()}</td>
                      <td>
                        <button className="action-btn delete" onClick={() => handleDeleteVideo(v._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <>
            <div className="section-header">
              <h2>Users</h2>
            </div>
            <div className="videos-table-container">
              <table className="videos-table">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {usersLoading && (
                    <tr><td colSpan={3} className="loading-cell">Loading users...</td></tr>
                  )}
                  {!usersLoading && usersError && (
                    <tr><td colSpan={3} className="empty-cell">{usersError}</td></tr>
                  )}
                  {!usersLoading && !usersError && users.length === 0 && (
                    <tr><td colSpan={3} className="empty-cell">No users found</td></tr>
                  )}
                  {!usersLoading && !usersError && users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.fullname || '—'}</td>
                      <td>{u.email || '—'}</td>
                      <td>{u.role || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;