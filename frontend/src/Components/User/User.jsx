"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./User.css"

const User = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedVideoId, setExpandedVideoId] = useState(null)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchVideos()
  }, [])

  const toEmbedUrl = (url) => {
    if (!url) return null
    try {
      const u = new URL(url)
      // YouTube watch -> embed
      if (u.hostname.includes("youtube.com")) {
        const v = u.searchParams.get("v")
        if (v) return `https://www.youtube.com/embed/${v}`
      }
      // youtu.be short -> embed
      if (u.hostname === "youtu.be") {
        const id = u.pathname.replace("/", "")
        if (id) return `https://www.youtube.com/embed/${id}`
      }
      // Vimeo -> player
      if (u.hostname.includes("vimeo.com")) {
        const id = u.pathname.split("/").filter(Boolean)[0]
        if (id) return `https://player.vimeo.com/video/${id}`
      }
      // Otherwise return original (may or may not be embeddable)
      return url
    } catch {
      return url
    }
  }

  const fetchVideos = async () => {
    try {
      setLoading(true)
      setError(null)

      // Try to fetch from API first
      const response = await fetch("/api/videos")
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      const data = await response.json()

      // Map backend fields to UI-friendly structure
      const mapped = (Array.isArray(data) ? data : []).map((v) => ({
        id: v._id,
        title: v.title,
        description: v.description,
        duration: v.duration || "00:00",
        uploadDate: v.createdAt,
        views: v.views || 0,
        videoUrl: v.videoUrl,
        authorName: v.author?.fullname || v.author?.email || "Unknown",
      }))

      setVideos(mapped)
      setLoading(false)
      return
    } catch (apiError) {
      console.warn("API not available, using mock data:", apiError.message)
      // Fallback to mock data with simulated loading delay
      setTimeout(() => {
        setVideos(mockVideos)
        setLoading(false)
      }, 700)
    }
  }

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleVideoPlay = (video) => {
    // Toggle inline embed instead of redirecting
    setExpandedVideoId((prev) => (prev === video.id ? null : video.id))
  }

  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem("authToken")
    // Redirect to login page
    navigate("/admin/login")
  }

  const formatViews = (views) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + "M"
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K"
    }
    return views.toString()
  }

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="loading">Loading videos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="user-dashboard">
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={fetchVideos} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="user-dashboard">
      <nav className="dashboard-header" role="navigation" aria-label="Primary">
        <div className="header-content">
          <div className="header-text">
            <h2>Video Library</h2>
            <p>Discover and watch videos from our collection</p>
          </div>
          <button
            className="nav-toggle"
            aria-label="Toggle navigation"
            aria-expanded={isNavOpen}
            onClick={() => setIsNavOpen((prev) => !prev)}
          >
            ☰
          </button>
          <div className={`nav-right ${isNavOpen ? "open" : ""}`}>
            <input
              type="search"
              className="nav-search"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search videos"
            />
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="video-stats">
        <p>
          {filteredVideos.length} video{filteredVideos.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="videos-grid">
        {filteredVideos.length === 0 ? (
          <div className="no-videos">
            <p>{searchTerm ? "No videos match your search." : "No videos available."}</p>
          </div>
        ) : (
          filteredVideos.map((video) => (
            <div key={video.id} className="video-card">
              <div className="video-info">
                <h3 className="video-title" title={video.title}>
                  {video.title}
                </h3>
                <p className="video-description" title={video.description}>
                  {video.description}
                </p>
                <div className="video-duration">{video.duration}</div>
                <div className="video-meta">
                  <span className="upload-date">
                    {video.uploadDate ? new Date(video.uploadDate).toLocaleDateString() : "Unknown date"}
                  </span>
                  <span className="video-views">{formatViews(video.views || 0)} views</span>
                </div>
                <div className="video-author">{video.authorName}</div>
                <button className="play-button" onClick={() => handleVideoPlay(video)} title={`Play ${video.title}`}>
                  {expandedVideoId === video.id ? "⏹ Hide Video" : "▶ Play Video"}
                </button>
              </div>

              {expandedVideoId === video.id && video.videoUrl && (
                <div className="video-embed">
                  <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
                    <iframe
                      src={toEmbedUrl(video.videoUrl)}
                      title={video.title}
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default User
