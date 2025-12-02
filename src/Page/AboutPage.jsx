import React from "react";
import Navbardesign from "../Components/Navbar";
import AboutMithaHomes from "../Components/Aboutpage/Aboutpageconcepts";
import ProjectListingPage from "../Components/Aboutpage/ProjectDetailshome";
import Footer from "../Components/FooterDomain/Footerdata";
import ContactBar from "../Components/Fixedpossion/Fixedposion";

const AboutPage = () => {
  return (
    <>
      <Navbardesign />
      
      <br />
      <br />
      <br />
      <br />
      
      {/* Breadcrumb Section - Centered */}
      <div>
        <nav className="breadcrumb-nav">
          <ul>
            <li><a href="/">Home</a></li>
            <li>About</li>
          </ul>
        </nav>
        
        <h1 className="page-title">About Us</h1>
      </div>

      <AboutMithaHomes />
      <ProjectListingPage />
      <Footer />
      <ContactBar />

      {/* CSS Styles */}
      <style>
        {`
          /* Breadcrumb Styles - Centered */
          .breadcrumb-nav {
            background-color: #c97f74; 
            padding: 15px 20px; 
            overflow: hidden; 
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .breadcrumb-nav ul {
            list-style: none; 
            padding: 0;
            margin: 0;
            display: flex; 
            align-items: center;
            justify-content: center;
          }

          .breadcrumb-nav ul li {
            font-family: Arial, sans-serif;
            font-size: 1.5rem; 
            font-weight: 700; 
            color: #ffffff; 
            margin-right: 15px;
            display: flex;
            align-items: center;
          }

          .breadcrumb-nav ul li a {
            color: #f7e6a7; 
            text-decoration: none; 
          }

          .breadcrumb-nav ul li:first-child:after {
            content: "❯"; 
            color: #f7e6a7; 
            margin-left: 15px; 
            font-weight: 400; 
          }

          .page-title {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20px 0;
            text-align: center;
            width: 100%;
          }

          /* Responsive Styles */
          @media (max-width: 768px) {
            .breadcrumb-nav ul li {
              font-size: 1.8rem;
            }
            
            .page-title {
              font-size: 1.8rem;
            }
          }

          @media (max-width: 480px) {
            .breadcrumb-nav ul li {
              font-size: 1.5rem;
            }
            
            .page-title {
              font-size: 1.5rem;
            }
            
            .breadcrumb-nav {
              padding: 10px 15px;
            }
            
            .breadcrumb-nav ul li {
              margin-right: 10px;
            }
            
            .breadcrumb-nav ul li:first-child:after {
              margin-left: 10px;
            }
          }

          @media (max-width: 360px) {
            .breadcrumb-nav ul {
              flex-direction: column;
              gap: 5px;
            }
            
            .breadcrumb-nav ul li:first-child:after {
              display: none;
            }
          }
        `}
      </style>
    </>
  );
};

export default AboutPage;