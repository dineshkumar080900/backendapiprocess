import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./Page/Homepage";
import AdminLogin from "./Components/AdminPage/LoginPage/AdminLogin";
import DashboardConnectionpage from "./Components/AdminPage/Antherpage/AdminPageconnection/Dashboard";
import Testimonals from "./Components/AdminPage/Antherpage/AdminPageconnection/Testimonals";
import PostProjectprocess from "./Components/AdminPage/Antherpage/AdminPageconnection/postsProjectprocess";
import BlogsPageProcess from "./Components/AdminPage/Antherpage/AdminPageconnection/Blogspage";
import LeadsProcess from "./Components/AdminPage/Antherpage/AdminPageconnection/Leadspage";
import AboutPage from "./Page/AboutPage";
import VisionPage from "./Page/VisionPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/vision-mission" element={<VisionPage />} />
        <Route path="/admin/admindashbooard" element={<DashboardConnectionpage />} />
        <Route path="/admin/Testmiminials" element={<Testimonals />} />
        <Route path="/admin/posts" element={<PostProjectprocess />} />
        <Route path="/admin/messages" element={<LeadsProcess />} />
        <Route path="/admin/blog" element={<BlogsPageProcess />} />
        <Route path="/admin/pricing" element={<DashboardConnectionpage />} />
        <Route path="/admin/settings" element={<DashboardConnectionpage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
};

export default App;
