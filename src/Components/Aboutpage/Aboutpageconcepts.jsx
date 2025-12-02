import React from 'react';
// Assuming you have a CSS file for styles (AboutMithaHomes.css)
// You can replace the className attributes with style={...} for inline styles.
import { FaHome, FaUsers, FaClock } from 'react-icons/fa'; // Import icons from a library like react-icons

// Feature data for easy mapping
const features = [
  { 
    icon: FaHome, 
    title: "DESIGNING AND INNOVATING", 
    subtitle: "GREAT HOMES" 
  },
  { 
    icon: FaUsers, 
    title: "BUILDING ASPIRATIONS", 
    subtitle: "WITH OUR HOMES" 
  },
  { 
    icon: FaClock, 
    title: "DELIVERING ON TIME,", 
    subtitle: "EVERY TIME" 
  },
];

// Helper Component for the Feature Box
const FeatureBox = ({ Icon, title, subtitle }) => {
  // Inline CSS equivalent for .feature-box, .icon-wrapper, .feature-title, .feature-subtitle
  const featureBoxStyle = {
    flex: '1',
    padding: '20px',
    textAlign: 'center',
    borderRight: '1px solid #ccc', // Separator line, only applicable to middle one
    // Remove borderRight for the last element in the actual implementation
  };
  const iconWrapperStyle = {
    fontSize: '2em', // Size of the icon
    color: '#000', // Icon color
    marginBottom: '10px',
  };
  const titleStyle = {
    fontWeight: 'bold',
    fontSize: '0.9em',
    margin: '5px 0 2px 0',
  };
  const subtitleStyle = {
    fontSize: '0.8em',
    color: '#333',
  };

  return (
    <div className="feature-box" style={featureBoxStyle}>
      <div className="icon-wrapper" style={iconWrapperStyle}>
        <Icon />
      </div>
      <p className="feature-title" style={titleStyle}>{title}</p>
      <p className="feature-subtitle" style={subtitleStyle}>{subtitle}</p>
    </div>
  );
};


const AboutMithaHomes = () => {
  // Inline CSS equivalent for .about-container, .features-grid, .main-text-block
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
  };
  const titleStyle = {
    textAlign: 'center',
    fontSize: '1.5em',
    fontWeight: 'bold',
    marginBottom: '40px',
  };
  const featuresGridStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: '40px',
    padding: '0 50px', // Spacing around the feature blocks
  };
  const mainTextStyle = {
    textAlign: 'justify',
    lineHeight: '1.6',
    fontSize: '1em',
    maxWidth: '900px',
    margin: '0 auto 30px auto',
    padding: '0 20px',
    color: '#555',
  };
  const reputationTextStyle = {
    textAlign: 'center',
    lineHeight: '1.6',
    fontSize: '1em',
    maxWidth: '900px',
    margin: '30px auto 0 auto',
    padding: '0 20px',
    color: '#555',
  };
  
  return (
    <div className="about-container" style={containerStyle}>
      <h2 style={titleStyle}>ABOUT MITHA HOMES</h2>
      
      {/* Feature Grid with Icons */}
      <div className="features-grid" style={featuresGridStyle}>
        {features.map((feature, index) => (
          <FeatureBox 
            key={index} 
            Icon={feature.icon} 
            title={feature.title} 
            subtitle={feature.subtitle}
          />
        ))}
      </div>
      
      <div className="main-text-block" style={mainTextStyle}>
        <p>
          Mitha Construction and Development is a registered construction firm in Tiruchirappalli, headed by **S. Mohan**, a qualified civil engineer from Seshsayee Institute of Technology (**SIT**). He finished his course in **1985** and practiced under very experienced and leading engineers during the construction of big hotels and residential bungalows. He then ventured into his family business of printing and packaging industry and turned out to be a successful businessman. But his passion for construction brought him back, and he has started his journey as a flat promoter. The principal objective of the company is to provide **quality construction** at an affordable cost. The company has a strong team of **dedicated engineers and architects** and executes projects as per the specifications and requirements of the clients.
        </p>
      </div>
      
      <div className="reputation-text" style={reputationTextStyle}>
        <p>
          We also feel elated to say that we have a **strong reputation** among our clients and we assure a **best value for your investment**.
        </p>
      </div>
    </div>
  );
};

export default AboutMithaHomes;