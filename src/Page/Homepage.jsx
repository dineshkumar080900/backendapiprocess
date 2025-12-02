import React from "react";
import Navbardesign from "../Components/Navbar";
import BannerSwiper from "../Components/Bannerdesign/Bannerdesign";
import ProjectSection from "../Components/Projectcard/Projectdesign";
import Testimonials from "../Components/Testimonalprocess/Testimonalsprocess";
import AboutMithaHomes from "../Components/Aboutpage/Aboutpageconcepts";
import ProjectListingPage from "../Components/Aboutpage/ProjectDetailshome";
import Footer from "../Components/FooterDomain/Footerdata";
import ContactBar from "../Components/Fixedpossion/Fixedposion";
import { color } from "framer-motion";

const MyComponent = () => {
  return (
    <>

      <Navbardesign />
<br></br>


      {/* Page Container */}
      <div style={styles.pageWrapper}>

      

        {/* Banner - ALWAYS VISIBLE */}
        <div className="banner-wrapper">
          <BannerSwiper />
        </div>
      </div>
      <center>
        <h2 style={styles.sampleText}>OUR PROJECTS</h2>
      </center>
      <ProjectSection/>
      <Testimonials/>
      <AboutMithaHomes/>
      <ProjectListingPage/>
      <Footer/>
      <ContactBar/> 

      {/* Responsive CSS (Improves layout, does NOT hide banner) */}
      <style>
        {`
          /* Add spacing below navbar for all screens */
          .banner-wrapper {
            margin-top: 20px;
            width: 100%;
          }

          /* Responsive text */
          @media (max-width: 600px) {
            h2 {
              font-size: 20px;
            }
          }

          @media (max-width: 400px) {
            h2 {
              font-size: 18px;
            }
          }
        `}
      </style>
    </>
  );
};

/* ===============================
   INLINE PAGE STYLES
   =============================== */
const styles = {
  pageWrapper: {
   
    textAlign: "center",
  },
  sampleText: {
    color:'red',
    fontSize: "24px",
    fontWeight: "600",
    marginTop: "20px",
  }
};

export default MyComponent;
