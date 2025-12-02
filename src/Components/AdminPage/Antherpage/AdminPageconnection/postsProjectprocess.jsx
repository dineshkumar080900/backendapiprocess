import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbardesign from "../Sidebar";
import DataBaseDashboard from "./Fileformateconnection/Dashboardfileformated";
import ProjectDashboard from "./Fileformateconnection/ProjectDetailsDataTable";
export default function PostProjectprocess() {
  const navigate = useNavigate();

  // Screen size detection
  const [isLargeScreen, setIsLargeScreen] = useState(
    () => window.innerWidth >= 1000
  );

  // Logged-in username
  const [username, setUsername] = useState("");

  // Redirect if no token

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1000);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load username from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("adminUname");
      setUsername(storedUsername || "");
    }
  }, []);

  // Styles
  const styles = {
    largeContainer: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#fff",
    },
    largeSidebar: {
      width: "15rem",
      backgroundColor: "#f8f9fa",
      borderRight: "1px solid #ddd",
      padding: "1rem",
      boxSizing: "border-box",
    },
    largeMain: {
      flexGrow: 1,
      padding: "5rem",
      backgroundColor: "#fff",
      boxSizing: "border-box",
    },
    smallContainer: {
      display: "block",
      minHeight: "100vh",
      backgroundColor: "#fff",
    },
    smallSidebar: {
      width: "100%",
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #ddd",
      padding: "1rem",
      boxSizing: "border-box",
    },
    smallMain: {
      padding: "2rem",
      backgroundColor: "#fff",
      boxSizing: "border-box",
    },
  };

  return (
    <div style={isLargeScreen ? styles.largeContainer : styles.smallContainer}>
      {/* Sidebar */}
      <aside style={isLargeScreen ? styles.largeSidebar : styles.smallSidebar}>
       <Navbardesign/>
      </aside>

      {/* Main content */}
      <br/>
      <main style={isLargeScreen ? styles.largeMain : styles.smallMain}>
<ProjectDashboard/>
      </main>
    </div>
  );
}
