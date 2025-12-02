import React, { useEffect, useState } from "react";
import imagelogo from "../../../Assert/LogoDesign/Logo.webp";
import userIcon from "../../../Assert/LogoDesign/Logo.webp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBars,
  FaCog,
  FaUserCog,
  FaTimes
} from "react-icons/fa";
import { MdPostAdd } from "react-icons/md";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { LuMessagesSquare } from "react-icons/lu";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiLogoutBoxFill } from "react-icons/ri";
import { IoMdPricetags } from "react-icons/io";
import { LiaBlogSolid } from "react-icons/lia";

export default function Navbardesign() {
  const userName = "Admin";
  const location = useLocation();
  const currentPath = location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen((prev) => !prev);
  };
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-menu')) {
        setUserDropdownOpen(false);
      }
      
      // Close sidebar when clicking on overlay or outside on mobile
      if (sidebarOpen && isMobile && !event.target.closest('.sidebar') && 
          !event.target.closest('.navbar-toggler')) {
        setSidebarOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        if (sidebarOpen) setSidebarOpen(false);
        if (userDropdownOpen) setUserDropdownOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [userDropdownOpen, sidebarOpen, isMobile]);

  const handleLogout = (e) => {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminData");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("adminData");
    
    // Clear cookies if any
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    setSidebarOpen(false);
    setUserDropdownOpen(false);
    
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    setTimeout(() => {
      navigate("/admin/login");
      window.location.reload();
    }, 1000);
  };

  // New Color Scheme
  const colors = {
    primary: "#5DC350",           // Primary Green
    primaryLight: "rgba(93, 195, 80, 0.1)", // Light Green
    primaryDark: "#4CAF50",       // Darker Green
    secondary: "#E36324",         // Secondary Orange
    secondaryLight: "rgba(227, 99, 36, 0.1)", // Light Orange
    accent: "#FF9800",           // Accent Orange
    dark: "#2C3E50",             // Dark Blue Gray
    light: "#F8F9FA",            // Light Gray
    lightBg: "#F5F7F9",          // Light Background
    lightAccent: "#FFF3E0",      // Very Light Orange
    danger: "#E74C3C",           // Red
    success: "#27AE60",          // Green
    info: "#3498DB",             // Blue
    warning: "#F39C12",          // Orange
    gray: "#7F8C8D",             // Gray
    lightGray: "#ECF0F1"         // Light Gray
  };

  const menuItems = [
    { path: "/admin/admindashbooard", icon: <FaTachometerAlt className="sidebar-icon" />, label: "Dashboard" },
    { path: "/admin/Testmiminials", icon: <BsFillPersonVcardFill className="sidebar-icon" />, label: "Testimonials" },
    { path: "/admin/posts", icon: <MdPostAdd className="sidebar-icon" />, label: "Projects" },
    { path: "/admin/messages", icon: <LuMessagesSquare className="sidebar-icon" />, label: "Leads" },
    { path: "/admin/blog", icon: <LiaBlogSolid className="sidebar-icon" />, label: "Blog" },
    { path: "/admin/pricing", icon: <IoMdPricetags className="sidebar-icon" />, label: "Pricing" },
    { path: "/admin/settings", icon: <FaCog className="sidebar-icon" />, label: "Settings" },
  ];

  return (
    <>
      <ToastContainer />
      <style>{`
        :root {
          --primary: ${colors.primary};
          --primary-light: ${colors.primaryLight};
          --primary-dark: ${colors.primaryDark};
          --secondary: ${colors.secondary};
          --secondary-light: ${colors.secondaryLight};
          --accent: ${colors.accent};
          --dark: ${colors.dark};
          --light: ${colors.light};
          --light-bg: ${colors.lightBg};
          --light-accent: ${colors.lightAccent};
          --danger: ${colors.danger};
          --success: ${colors.success};
          --info: ${colors.info};
          --warning: ${colors.warning};
          --gray: ${colors.gray};
          --light-gray: ${colors.lightGray};
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          background-color: ${colors.lightBg};
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          margin: 0;
          padding: 0;
          color: ${colors.dark};
          overflow-x: hidden;
          line-height: 1.6;
        }
        
        /* Main content area */
        @media (min-width: 992px) {
          main {
            padding-left: 280px;
            padding-top: 80px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            min-height: 100vh;
          }
        }
        
        /* Mobile first approach */
        @media (max-width: 991px) {
          main {
            padding-top: 80px;
            min-height: 100vh;
          }
        }
        
        /* Sidebar styles - Mobile First */
        .sidebar {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          padding: 80px 0 0;
          box-shadow: 2px 0 20px rgba(0, 0, 0, 0.08);
          width: 100%;
          max-width: 320px;
          background: linear-gradient(135deg, white 0%, #fafafa 100%);
          z-index: 1000;
          overflow-y: auto;
          overflow-x: hidden;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-right: 1px solid ${colors.lightGray};
          transform: ${sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'};
        }
        
        /* Desktop sidebar */
        @media (min-width: 992px) {
          .sidebar {
            transform: translateX(0);
            width: 280px;
            max-width: none;
          }
        }
        
        .sidebar::-webkit-scrollbar {
          width: 4px;
        }
        
        .sidebar::-webkit-scrollbar-track {
          background: ${colors.lightGray};
        }
        
        .sidebar::-webkit-scrollbar-thumb {
          background: ${colors.primary};
          border-radius: 10px;
        }
        
        .sidebar-header {
          padding: 0 1.5rem 1.5rem;
          border-bottom: 1px solid ${colors.lightGray};
          margin-bottom: 1rem;
          background: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .sidebar-close {
          display: block;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: ${colors.gray};
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .sidebar-close:hover {
          background: ${colors.lightGray};
          color: ${colors.dark};
        }
        
        @media (min-width: 992px) {
          .sidebar-close {
            display: none;
          }
        }
        
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 700;
          color: ${colors.dark};
          text-decoration: none;
          font-size: 1.25rem;
          transition: color 0.3s ease;
          flex: 1;
        }
        
        .sidebar-brand:hover {
          color: ${colors.primary};
        }
        
        .sidebar-brand img {
          height: 32px;
          transition: transform 0.3s ease;
        }
        
        .sidebar-brand:hover img {
          transform: scale(1.05);
        }
        
        .sidebar-menu {
          padding: 0 1rem;
        }
        
        .sidebar-menu-title {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: ${colors.gray};
          padding: 0 1rem;
          margin: 1.5rem 0 0.5rem;
        }
        
        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          margin-bottom: 0.375rem;
          border-radius: 0.75rem;
          color: ${colors.dark};
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          cursor: pointer;
          border: 1px solid transparent;
          position: relative;
          overflow: hidden;
        }
        
        .sidebar-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 3px;
          background: ${colors.primary};
          transform: scaleY(0);
          transition: transform 0.3s ease;
        }
        
        .sidebar-item:hover {
          background: ${colors.primaryLight};
          color: ${colors.primary};
          border-color: ${colors.primaryLight};
          transform: translateX(4px);
        }
        
        .sidebar-item:hover::before {
          transform: scaleY(1);
        }
        
        .sidebar-item:hover .sidebar-icon {
          color: ${colors.primary};
          transform: scale(1.1);
        }
        
        .sidebar-item.active {
          background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
          color: white;
          font-weight: 600;
          border-color: ${colors.primary};
          box-shadow: 0 4px 12px rgba(93, 195, 80, 0.3);
        }
        
        .sidebar-item.active::before {
          transform: scaleY(1);
          background: white;
        }
        
        .sidebar-item.active .sidebar-icon {
          color: white;
        }
        
        .sidebar-icon {
          font-size: 1.25rem;
          color: ${colors.gray};
          transition: all 0.3s ease;
          min-width: 24px;
        }
        
        .sidebar-divider {
          border-top: 1px solid ${colors.lightGray};
          margin: 1.5rem 0;
          opacity: 0.6;
        }
        
        /* Navbar styles */
        .navbar {
          height: 80px;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
          background: linear-gradient(135deg, white 0%, #fefefe 100%);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        @media (min-width: 768px) {
          .navbar {
            padding: 0 2rem;
          }
        }
        
        .navbar-brand {
          display: flex;
          align-items: center;
        }
        
        .navbar-brand img {
          height: 32px;
          transition: transform 0.3s ease;
        }
        
        @media (max-width: 576px) {
          .navbar-brand img {
            height: 28px;
          }
        }
        
        .navbar-toggler {
          border: none;
          font-size: 1.25rem;
          color: ${colors.primary};
          background: ${colors.primaryLight};
          padding: 0.75rem;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .navbar-toggler:hover {
          background: ${colors.primary};
          color: white;
          transform: rotate(90deg);
        }
        
        .user-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
        }
        
        .user-avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid ${colors.primaryLight};
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .user-avatar:hover {
          border-color: ${colors.primary};
          transform: scale(1.05);
        }
        
        @media (max-width: 576px) {
          .user-avatar {
            width: 38px;
            height: 38px;
          }
        }
        
        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          min-width: 220px;
          z-index: 2000;
          opacity: ${userDropdownOpen ? 1 : 0};
          visibility: ${userDropdownOpen ? 'visible' : 'hidden'};
          transform: ${userDropdownOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)'};
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid ${colors.lightGray};
          overflow: hidden;
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          color: ${colors.dark};
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-weight: 500;
        }
        
        .dropdown-item:hover {
          background: ${colors.primaryLight};
          color: ${colors.primary};
          padding-left: 1.5rem;
        }
        
        .dropdown-divider {
          border-top: 1px solid ${colors.lightGray};
          margin: 0.5rem 0;
        }
        
        /* Overlay for mobile sidebar */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.5);
          z-index: 900;
          opacity: ${sidebarOpen && isMobile ? '1' : '0'};
          visibility: ${sidebarOpen && isMobile ? 'visible' : 'hidden'};
          transition: all 0.3s ease;
          backdrop-filter: blur(4px);
        }
        
        /* Mobile specific improvements */
        @media (max-width: 576px) {
          .sidebar {
            max-width: 280px;
          }
          
          .sidebar-menu {
            padding: 0 0.75rem;
          }
          
          .sidebar-item {
            padding: 0.75rem;
            font-size: 0.9rem;
          }
          
          .user-menu {
            gap: 0.75rem;
          }
          
          .user-dropdown {
            min-width: 200px;
            right: -0.5rem;
          }
        }
        
        /* Tablet improvements */
        @media (min-width: 577px) and (max-width: 991px) {
          .sidebar {
            max-width: 300px;
          }
        }
        
        /* Large mobile devices */
        @media (max-width: 767px) and (min-width: 576px) {
          .navbar {
            padding: 0 1.5rem;
          }
        }
        
        /* Animation for sidebar items */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .sidebar-item {
          animation: slideIn 0.3s ease forwards;
        }
        
        .sidebar-item:nth-child(1) { animation-delay: 0.1s; }
        .sidebar-item:nth-child(2) { animation-delay: 0.15s; }
        .sidebar-item:nth-child(3) { animation-delay: 0.2s; }
        .sidebar-item:nth-child(4) { animation-delay: 0.25s; }
        .sidebar-item:nth-child(5) { animation-delay: 0.3s; }
        .sidebar-item:nth-child(6) { animation-delay: 0.35s; }
        .sidebar-item:nth-child(7) { animation-delay: 0.4s; }
        
        /* Prevent body scroll when sidebar is open on mobile */
        body.sidebar-open {
          overflow: hidden;
        }
      `}</style>

      <header>
        <nav 
          id="sidebarMenu"
          className="sidebar"
          aria-label="Sidebar navigation"
        >
          <div className="position-sticky">
            <div className="sidebar-header">
              <Link
                className="sidebar-brand"
                to="/admin/admindashbooard"
                onClick={() => setSidebarOpen(false)}
              >
                <img src={imagelogo} alt="Admin Logo" />
                <span>Admin Panel</span>
              </Link>
              <button 
                className="sidebar-close"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <FaTimes />
              </button>
            </div>

            <div className="sidebar-menu">
              <div className="sidebar-menu-title">Main Navigation</div>
              
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`sidebar-item ${currentPath === item.path ? "active" : ""}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              <div className="sidebar-divider"></div>
              
              {/* Logout in sidebar for mobile */}
              {isMobile && (
                <button 
                  className="sidebar-item" 
                  onClick={handleLogout}
                >
                  <RiLogoutBoxFill className="sidebar-icon" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Navbar */}
        <nav className="navbar">
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Toggle sidebar"
            onClick={toggleSidebar}
          >
            <FaBars />
          </button>

          <Link className="navbar-brand" to="/admin/admindashbooard">
            <img src={imagelogo} alt="Logo" loading="lazy" />
          </Link>

          <div className="user-menu">
            <div className="user-info">
              <img
                src={userIcon}
                alt="User Icon"
                className="user-avatar"
                onClick={toggleUserDropdown}
              />
              <div className="user-dropdown">
                <div className="dropdown-item">
                  <FaUserCog />
                  <span>Profile Settings</span>
                </div>
                <div className="dropdown-item">
                  <FaCog />
                  <span>Preferences</span>
                </div>
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item" 
                  onClick={handleLogout}
                >
                  <RiLogoutBoxFill />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {sidebarOpen && isMobile && (
          <div 
            className="sidebar-overlay" 
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </header>
    </>
  );
}