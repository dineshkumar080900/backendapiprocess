import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

// Ensure all required CSS is imported
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const Bannerdesign = () => {
  const [banners, setBanners] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      // Simulate network delay if needed, remove in production
      // await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      const res = await fetch("http://mitrahomebackendapi.pemixcels.com/api/BannerAPI/get-banners/get");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setBanners(data.data);
      } else {
        setBanners([]); 
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      setBanners([]); 
    } finally {
      setIsLoading(false);
    }
  };

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  useEffect(() => {
    fetchBanners();
  }, []);

  // Show loading spinner or placeholder if loading or no banners
  if (isLoading || banners.length === 0) {
    return (
      <div className="banner-wrapper loading-state"> 
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>
            {isLoading 
              ? "Loading Banners..." 
              : "No banners available at the moment."
            }
          </p>
        </div>
      </div>
    ); 
  }

  return (
    <div className="banner-wrapper">
      {/* Enhanced Custom Navigation Arrows */}
      <div className="custom-prev nav-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </div>
      <div className="custom-next nav-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
       
        autoplay={{ 
          delay: 2000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true 
        }}
        effect={isMobile ? "slide" : "fade"}
        fadeEffect={{ crossFade: true }}
        speed={800}
        loop={true}
        slidesPerView={1}
        spaceBetween={0}
        className="banner-swiper"
        grabCursor={true}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            <div className="banner-slide-content">
              <img
                src={`http://mitrahomebackendapi.pemixcels.com${banner.banner_image}`}
                alt={`Banner ${index + 1}`}
                className="banner-image"
                loading={index === 0 ? "eager" : "lazy"}
              />
              {/* Optional: Add Overlay Content here if needed */}
              {/* <div className="banner-overlay">
                <div className="banner-content">
                  <h2 className="banner-title">{banner.title}</h2>
                  <p className="banner-subtitle">{banner.subtitle}</p>
                  <button className="banner-cta">Shop Now</button>
                </div>
              </div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Progress Bar */}
      <div className="swiper-progress-bar">
        <div className="progress"></div>
      </div>

      <style jsx>{`
        /* 1. Main Wrapper - Enhanced with shadow and rounded corners */
        .banner-wrapper {
          position: relative;
          width: 100%;
          max-height: 600px;
          overflow: hidden;
          margin: 0 auto;
          /* Add a slight bottom margin or shadow if desired */
          /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */ 
          /* border-radius: 8px; */
        }

        /* Loading State Styling for consistent height while loading */
        .banner-wrapper.loading-state {
          min-height: 250px; 
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f8f8f8; 
          border: 1px dashed #ddd;
        }

        /* Responsive max-height for the wrapper */
        @media (max-width: 1200px) {
          .banner-wrapper { max-height: 500px; }
        }
        @media (max-width: 992px) {
          .banner-wrapper { max-height: 400px }
        }
        @media (max-width: 768px) {
          .banner-wrapper { max-height: 350px }
        }
        @media (max-width: 480px) {
          .banner-wrapper { max-height: 250px }
        }
        .banner-swiper {
          width: 100%;
          height: 100%; /* Important: Takes the height of banner-wrapper */
        }
        .banner-slide-content {
          width: 100%;
          height: 100%; /* Important: Takes the height of SwiperSlide/Swiper */
          position: relative;
        }
        .banner-image {
          width: 100%;
          height: 100%; /* Important: Takes the full height of the slide content */
          object-fit: cover; /* ESSENTIAL: Scales the image to cover the area without distorting the aspect ratio */
          display: block;
          transition: transform 0.8s ease;
        }
        @media (min-width: 769px) {
          .banner-swiper:hover .banner-image {
            transform: scale(1.05);
          }
        }
        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          background: rgba(255, 255, 255, 0.9);
          color: #333;
          width: 60px;
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          cursor: pointer;
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .banner-wrapper:hover .nav-arrow {
          opacity: 1;
        }

        .nav-arrow:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .nav-arrow svg {
          width: 28px;
          height: 28px;
          fill: currentColor;
          transition: transform 0.3s ease;
        }

        .nav-arrow:hover svg {
          transform: scale(1.1);
        }

        .custom-prev {
          left: 25px;
        }

        .custom-next {
          right: 25px;
        }
        .arrow-tooltip {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .nav-arrow:hover .arrow-tooltip {
          opacity: 1;
        }
        @media (max-width: 768px) {
          .nav-arrow {
            width: 44px;
            height: 44px;
            opacity: 0.7;
            background: rgba(255, 255, 255, 0.8);
          }

          .nav-arrow svg {
            width: 20px;
            height: 20px;
          }

          .custom-prev {
            left: 10px;
          }

          .custom-next {
            right: 10px;
          }

          .arrow-tooltip {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .nav-arrow {
            width: 36px;
            height: 36px;
          }

          .nav-arrow svg {
            width: 16px;
            height: 16px;
          }
        }

        /* 6. Enhanced Pagination */
        .swiper-pagination {
          bottom: 20px !important;
        }

        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.7);
          opacity: 0.7;
          margin: 0 6px !important;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .swiper-pagination-bullet i {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #3498db, #9b59b6);
          transition: left 4s linear;
        }

        /* Note: Swiper v10+ automatically handles pagination bullet classes, 
           so the logic for the progress fill might need to be implemented 
           via a custom Swiper plugin or in the onSlideChange handler 
           if the CSS trick above doesn't work out-of-the-box with all Swiper configs. */

        .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.2);
          background: transparent;
        }

        .swiper-pagination-bullet-active i {
          left: 0;
        }

        /* 7. Progress Bar */
        .swiper-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: rgba(255, 255, 255, 0.3);
          z-index: 10;
        }

        .progress {
          height: 100%;
          background: linear-gradient(90deg, #3498db, #9b59b6);
          width: 0%;
          /* Transition is removed here to let the animation handle the movement */
        }

        /* Autoplay progress animation */
        /* Note: For this to work correctly, you typically need to reset the animation 
           on every slide change via JavaScript, as pure CSS animation on a loop 
           may not synchronize perfectly with Swiper's internal slide timing. */
        .banner-swiper .progress {
          animation: progress 2000ms linear; /* Match the autoplay delay */
        }
        
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        /* 9. Loading Spinner */
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: #555;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #ddd;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Bannerdesign;