import React, { useState, useEffect } from "react";
import { 
  FiChevronDown, FiMenu, FiX, FiPhone, FiHome, 
  FiUsers, FiCheck
} from "react-icons/fi";
import { 
  MdConstruction, MdDesignServices, MdApartment 
} from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Note: You must ensure this path and image file exists in your project
// If not, React will throw an error related to the missing asset.
import logo from "../Assert/LogoDesign/Logo.webp";

const ConstructionNavbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  // Initialize windowWidth defensively for SSR environments
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Use React Router's location to track active route
  const location = useLocation();
  const navigate = useNavigate();
  
  // Breakpoints
  const isDesktop = windowWidth >= 1025;
  const SIDEBAR_WIDTH = 300;

  useEffect(() => {
    // Scroll handling for background change
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    // Resize handling for responsiveness
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close sidebar if window resized to desktop view
      if (window.innerWidth >= 1025) {
        setSidebarOpen(false);
      }
    };

    if (typeof window !== 'undefined') {
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  const toggleMobileDropdown = (dropdown) => {
    setMobileDropdown(mobileDropdown === dropdown ? null : dropdown);
  };

  const handleMobileLinkClick = () => {
    setSidebarOpen(false);
    setMobileDropdown(null);
  };

  const handleDropdownEnter = (dropdown) => {
    setActiveDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  // Check if a route is active
  const isActiveRoute = (routePath) => {
    return location.pathname === routePath || location.pathname.startsWith(routePath + '/');
  };

  // Navigation data with routes
  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'about', label: 'About Us', path: '', dropdown: true },
    { id: 'projects', label: 'Projects', path: '/projects', dropdown: true },
    { id: 'testimonials', label: 'Testimonials', path: '/testimonials' },
    { id: 'blog', label: 'Blog', path: '/blog' },
    { id: 'contact', label: 'Contact Us', path: '/contact' },
  ];

  // About dropdown with routes
  const aboutDropdownItems = [
    { text: "History", icon: <FiUsers size={16} />, path: "/about" },
    { text: "Vision Mission", icon: <FiCheck size={16} />, path: "vision-mission" },
  ];

  // Projects dropdown with routes
  const projectsDropdownItems = [
    { text: "Ongoing Projects", icon: <MdConstruction size={16} />, path: "/projects/ongoing" },
    { text: "Completed Projects", icon: <FiCheck size={16} />, path: "/projects/completed" },
    { text: "Upcoming Projects", icon: <MdApartment size={16} />, path: "/projects/upcoming" }
  ];

  const styles = {
    appWrapper: {
      fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },

    // DESKTOP HEADER STYLES
    header: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "80px",
      display: isDesktop ? "flex" : "none",
      alignItems: "center",
      background: isScrolled ? "rgba(255,255,255,0.98)" : "#ffffff",
      boxShadow: isScrolled ? "0 8px 32px rgba(15,23,42,0.1)" : "none",
      padding: "0 24px",
      zIndex: 1000,
      backdropFilter: isScrolled ? "blur(20px)" : "none",
      transition: "all 0.3s ease",
      borderBottom: isScrolled ? "1px solid rgba(226, 232, 240, 0.8)" : "none",
    },
    
    container: {
      maxWidth: "1280px",
      margin: "0 auto",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      cursor: "pointer",
      textDecoration: "none",
      color: "inherit",
    },
    
    logoImage: {
      height: isScrolled ? "45px" : "55px",
      width: "auto",
      objectFit: "contain",
      transition: "all 0.3s ease",
    },
    
    logoTextContainer: {
      display: "flex",
      flexDirection: "column",
    },
    
    logoText: {
      fontSize: "22px",
      fontWeight: 800,
      background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    
    logoSubtext: {
      fontSize: "9px",
      fontWeight: 600,
      color: "#64748b",
      letterSpacing: "1.5px",
    },

    // DESKTOP NAVIGATION
    nav: {
      display: isDesktop ? "flex" : "none",
      gap: "28px",
      alignItems: "center",
    },
    
    navLink: {
      fontSize: "15px",
      color: "#334155",
      fontWeight: 600,
      cursor: "pointer",
      position: "relative",
      padding: "8px 0",
      display: "flex",
      alignItems: "center",
      transition: "all 0.2s ease",
      textDecoration: "none",
    },
    
    activeNavLink: {
      color: "#059669",
    },
    
    linkHover: {
      color: "#059669",
    },
    
    dropdownWrapper: {
      position: "relative",
    },
    
    dropdown: {
      position: "absolute",
      top: "100%",
      left: 0,
      background: "#ffffff",
      padding: "12px 0",
      boxShadow: "0 20px 45px rgba(15,23,42,0.15)",
      borderRadius: "12px",
      width: "240px",
      opacity: 0,
      visibility: "hidden",
      transform: "translateY(12px)",
      transition: "all 0.25s ease",
      zIndex: 1001,
      border: "1px solid rgba(226, 232, 240, 0.8)",
    },
    
    dropdownActive: {
      opacity: 1,
      visibility: "visible",
      transform: "translateY(0)",
    },
    
    dropdownItem: {
      padding: "12px 20px",
      fontSize: "14px",
      cursor: "pointer",
      color: "#475569",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      borderLeft: "3px solid transparent",
      transition: "all 0.2s ease",
      textDecoration: "none",
      background: "none",
      border: "none",
      width: "100%",
      textAlign: "left",
    },
    
    dropdownItemHover: {
      background: "#f0fdf4",
      color: "#059669",
      borderLeft: "3px solid #059669",
    },

    // CALL BUTTON
    callButton: {
      background: "#059669",
      color: "#ffffff",
      padding: "10px",
      border: "none",
      cursor: "pointer",
      fontSize: "15px",
      fontWeight: 500,
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.3s ease",
      textDecoration: "none",
    },

    callButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 12px 30px rgba(5, 150, 105, 0.4)",
      background: "#047857",
    },

    // MOBILE HEADER
    mobileHeader: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "70px",
      display: isDesktop ? "none" : "flex",
      alignItems: "center",
      background: "#ffffff",
      boxShadow: "0 2px 10px rgba(15,23,42,0.1)",
      padding: "0 20px",
      zIndex: 1000,
      borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
      justifyContent: "space-between",
    },

    mobileHeaderContent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },

    mobileLogo: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      textDecoration: "none",
      color: "inherit",
    },

    mobileLogoImage: {
      height: "40px",
      width: "auto",
      objectFit: "contain",
    },

    // MOBILE MENU BUTTON
    mobileMenuButton: {
      display: isDesktop ? "none" : "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      padding: "10px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },

    // SIDEBAR STYLES
    sidebar: {
      position: "fixed",
      top: 0,
      left: sidebarOpen ? 0 : -SIDEBAR_WIDTH,
      width: SIDEBAR_WIDTH,
      height: "100vh",
      background: "linear-gradient(160deg, #ffffff 0%, #f8fafc 30%, #ecfdf5 100%)",
      
      padding: "24px 0px",
      display: isDesktop ? "none" : "flex",
      flexDirection: "column",
      gap: "16px",
      zIndex: 1001,
      transition: "left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      borderRight: "1px solid rgba(226, 232, 240, 0.8)",
      overflowY: "auto",
    },
    
    sidebarHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      margin: '0 4px',
      marginBottom: "24px",
      paddingBottom: "20px",
      borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
    },
    
    sidebarLogo: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      textDecoration: "none",
      color: "inherit",
    },
    
    sidebarLogoImage: {
      height: "42px",
      width: "auto",
      objectFit: "contain",
    },
    
    sidebarCloseBtn: {
      border: "none",
      background: "rgba(15,23,42,0.05)",
      borderRadius: "10px",
      padding: "8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
    },
    
    sidebarLinks: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      flex: 1,
    },
    
    sidebarLink: {
      fontSize: "16px",
      color: "#334155",
      fontWeight: 600,
      padding: "14px 16px",
      borderRadius: "12px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "transparent",
      border: "none",
      transition: "all 0.3s ease",
      textAlign: "left",
      width: "100%",
      textDecoration: "none",
    },
    
    sidebarLinkActive: {
      background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
      color: "#059669",
    },
    
    sidebarLinkHover: {
      background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
      color: "#059669",
      transform: "translateX(4px)",
    },
    
    sidebarSubWrapper: (open) => ({
      maxHeight: open ? "400px" : "0",
      overflow: "hidden",
      transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      marginLeft: "16px",
      borderLeft: "2px solid #e2e8f0",
      padding: "5px 0",
    }),
    
    sidebarSubLink: {
      fontSize: "14px",
      color: "#475569",
      padding: "12px 18px",
      borderRadius: "10px",
      cursor: "pointer",
      background: "transparent",
      border: "none",
      textAlign: "left",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      width: "100%",
      textDecoration: "none",
    },
    
    sidebarSubLinkActive: {
      background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
      color: "#059669",
    },
    
    sidebarSubHover: {
      background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
      color: "#059669",
      transform: "translateX(4px)",
    },

    // OVERLAY
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(15,23,42,0.6)",
      opacity: sidebarOpen ? 1 : 0,
      visibility: sidebarOpen ? "visible" : "hidden",
      transition: "all 0.4s ease",
      zIndex: 1000,
      backdropFilter: "blur(4px)",
    },
  };

  // Render Desktop Dropdown
  const renderDesktopDropdown = (items) => {
    return items.map((subItem) => (
      <Link
        key={subItem.text}
        to={subItem.path}
        style={styles.dropdownItem}
        onMouseEnter={(e) => Object.assign(e.target.style, styles.dropdownItemHover)}
        onMouseLeave={(e) =>
          Object.assign(e.target.style, {
            background: "transparent",
            color: "#475569",
            borderLeft: "3px solid transparent",
          })
        }
        onClick={() => setActiveDropdown(null)}
      >
        {subItem.icon}
        {subItem.text}
      </Link>
    ));
  };

  // Render Mobile Dropdown
  const renderMobileDropdown = (items) => {
    return items.map((item) => (
      <Link
        key={item.text}
        to={item.path}
        style={{
          ...styles.sidebarSubLink,
          ...(isActiveRoute(item.path) && styles.sidebarSubLinkActive),
        }}
        onClick={handleMobileLinkClick}
        onMouseEnter={(e) => Object.assign(e.target.style, styles.sidebarSubHover)}
        onMouseLeave={(e) =>
          Object.assign(e.target.style, {
            background: isActiveRoute(item.path) ? "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)" : "transparent",
            color: isActiveRoute(item.path) ? "#059669" : "#475569",
            transform: "translateX(0)",
          })
        }
      >
        {item.icon}
        {item.text}
      </Link>
    ));
  };

  return (
    <div style={styles.appWrapper}>
      {/* DESKTOP HEADER */}
      <header style={styles.header}>
        <div style={styles.container}>
          <Link to="/" style={styles.logo}>
            <img
              src={logo}
              alt="Mitha Constructions"
              style={styles.logoImage}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </Link>

          <nav style={styles.nav}>
            {navItems.map((item) => (
              item.dropdown ? (
                <div
                  key={item.id}
                  style={styles.dropdownWrapper}
                  onMouseEnter={() => handleDropdownEnter(item.id)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    to={item.path}
                    style={{
                      ...styles.navLink,
                      ...(isActiveRoute(item.path) && styles.activeNavLink),
                    }}
                    onMouseEnter={(e) => Object.assign(e.target.style, styles.linkHover)}
                    onMouseLeave={(e) =>
                      Object.assign(e.target.style, { 
                        color: isActiveRoute(item.path) ? "#059669" : "#334155" 
                      })
                    }
                  >
                    {item.label}
                    <FiChevronDown
                      style={{
                        marginLeft: "6px",
                        transition: "transform 0.25s ease",
                        transform: activeDropdown === item.id ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </Link>
                  <div
                    style={{
                      ...styles.dropdown,
                      ...(activeDropdown === item.id && styles.dropdownActive),
                    }}
                  >
                    {item.id === 'about' && renderDesktopDropdown(aboutDropdownItems)}
                    {item.id === 'projects' && renderDesktopDropdown(projectsDropdownItems)}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.id}
                  to={item.path}
                  style={{
                    ...styles.navLink,
                    ...(isActiveRoute(item.path) && styles.activeNavLink),
                  }}
                  onMouseEnter={(e) => Object.assign(e.target.style, styles.linkHover)}
                  onMouseLeave={(e) =>
                    Object.assign(e.target.style, { 
                      color: isActiveRoute(item.path) ? "#059669" : "#334155" 
                    })
                  }
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>
        </div>
      </header>

      {/* MOBILE HEADER */}
      <header style={styles.mobileHeader}>
        <div style={styles.mobileHeaderContent}>
          <Link to="/" style={styles.mobileLogo}>
            <img
              src={logo}
              alt="Mitha Constructions"
              style={styles.mobileLogoImage}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </Link>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <a
              href="tel:+1234567890"
              style={styles.callButton}
              onMouseEnter={(e) =>
                Object.assign(e.target.style, styles.callButtonHover)
              }
              onMouseLeave={(e) =>
                Object.assign(e.target.style, {
                  transform: "translateY(0)",
                  background: "#059669",
                  boxShadow: "none",
                })
              }
            >
              <FiPhone size={18} />
              Call
            </a>

            <button
              style={styles.mobileMenuButton}
              onClick={() => setSidebarOpen(true)}
              onMouseEnter={(e) =>
                Object.assign(e.target.style, { transform: "scale(1.05)" })
              }
              onMouseLeave={(e) =>
                Object.assign(e.target.style, { transform: "scale(1)" })
              }
            >
              <FiMenu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <Link to="/" style={styles.sidebarLogo} onClick={handleMobileLinkClick}>
            <img
              src={logo}
              alt="Mitha Constructions"
              style={styles.sidebarLogoImage}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </Link>
          <button
            style={styles.sidebarCloseBtn}
            onClick={() => setSidebarOpen(false)}
            onMouseEnter={(e) => Object.assign(e.target.style, { background: "rgba(15,23,42,0.1)" })}
            onMouseLeave={(e) => Object.assign(e.target.style, { background: "rgba(15,23,42,0.05)" })}
          >
            <FiX size={20} />
          </button>
        </div>

        <div style={styles.sidebarLinks}>
          {/* Home Link */}
          <Link
            to="/"
            style={{
              ...styles.sidebarLink,
              ...(isActiveRoute('/') && styles.sidebarLinkActive),
            }}
            onClick={handleMobileLinkClick}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.sidebarLinkHover)}
            onMouseLeave={(e) =>
              Object.assign(e.target.style, {
                background: isActiveRoute('/') ? "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)" : "transparent",
                color: isActiveRoute('/') ? "#059669" : "#334155",
                transform: "translateX(0)",
              })
            }
          >
            <span>Home</span>
          </Link>

          {/* About Mobile Dropdown */}
          <button
            style={{
              ...styles.sidebarLink,
              ...((mobileDropdown === 'about' || isActiveRoute('/about')) && styles.sidebarLinkActive),
            }}
            onClick={() => toggleMobileDropdown('about')}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.sidebarLinkHover)}
            onMouseLeave={(e) =>
              Object.assign(e.target.style, {
                background: (mobileDropdown === 'about' || isActiveRoute('/about')) 
                  ? "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)" 
                  : "transparent",
                color: (mobileDropdown === 'about' || isActiveRoute('/about')) 
                  ? "#059669" 
                  : "#334155",
                transform: (mobileDropdown === 'about' || isActiveRoute('/about')) 
                  ? "translateX(4px)" 
                  : "translateX(0)",
              })
            }
          >
            <span>About Us</span>
            <FiChevronDown
              style={{
                transform: mobileDropdown === 'about' ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.25s ease",
              }}
            />
          </button>
          <div style={styles.sidebarSubWrapper(mobileDropdown === 'about')}>
            {renderMobileDropdown(aboutDropdownItems)}
          </div>

          {/* Projects Mobile Dropdown */}
          <button
            style={{
              ...styles.sidebarLink,
              ...((mobileDropdown === 'projects' || isActiveRoute('/projects')) && styles.sidebarLinkActive),
            }}
            onClick={() => toggleMobileDropdown('projects')}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.sidebarLinkHover)}
            onMouseLeave={(e) =>
              Object.assign(e.target.style, {
                background: (mobileDropdown === 'projects' || isActiveRoute('/projects')) 
                  ? "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)" 
                  : "transparent",
                color: (mobileDropdown === 'projects' || isActiveRoute('/projects')) 
                  ? "#059669" 
                  : "#334155",
                transform: (mobileDropdown === 'projects' || isActiveRoute('/projects')) 
                  ? "translateX(4px)" 
                  : "translateX(0)",
              })
            }
          >
            <span>Projects</span>
            <FiChevronDown
              style={{
                transform: mobileDropdown === 'projects' ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.25s ease",
              }}
            />
          </button>
          <div style={styles.sidebarSubWrapper(mobileDropdown === 'projects')}>
            {renderMobileDropdown(projectsDropdownItems)}
          </div>

          {/* Other Links */}
          {['testimonials', 'blog', 'contact'].map((item) => {
            const path = `/${item}`;
            return (
              <Link
                key={item}
                to={path}
                style={{
                  ...styles.sidebarLink,
                  ...(isActiveRoute(path) && styles.sidebarLinkActive),
                }}
                onClick={handleMobileLinkClick}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.sidebarLinkHover)}
                onMouseLeave={(e) =>
                  Object.assign(e.target.style, {
                    background: isActiveRoute(path) ? "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)" : "transparent",
                    color: isActiveRoute(path) ? "#059669" : "#334155",
                    transform: "translateX(0)",
                  })
                }
              >
                <span>
                  {item.charAt(0).toUpperCase() + item.slice(1).replace(/([A-Z])/g, ' $1')}
                </span>
              </Link>
            );
          })}

          {/* Mobile Call Button */}
          <a
            href="tel:+1234567890"
            style={{
              ...styles.callButton,
              marginTop: "20px",
              justifyContent: "center",
              fontSize: "16px",
              padding: "14px 64px",
            }}
            onClick={handleMobileLinkClick}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.callButtonHover)}
            onMouseLeave={(e) =>
              Object.assign(e.target.style, {
                transform: "translateY(0)",
                background: "#059669",
              })
            }
          >
            <FiPhone size={18} />
            Call Us Today
          </a>
        </div>
      </aside>

      {/* OVERLAY */}
      <div
        style={styles.overlay}
        onClick={() => setSidebarOpen(false)}
      />
    </div>
  );
};

export default ConstructionNavbar;