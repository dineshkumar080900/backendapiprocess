import React from 'react';

// Define enhanced styles as JavaScript objects
const styles = {
  // Main container: Mimics the background color from the image and sets global styles
  container: {
    backgroundColor: '#eeeeee', // Light, slightly off-white background
    padding: '40px 20px', // Responsive padding
    minHeight: '100vh',
    fontFamily: 'Roboto, Arial, sans-serif', // Use a modern font
    color: '#333', // Default text color
    boxSizing: 'border-box',
    width: '100%',
    overflowX: 'hidden', // Prevent horizontal scrolling
  },
  section: {
    marginBottom: '40px',
    maxWidth: '1200px', // Max width for content area
    margin: '0 auto', // Center the section content
    width: '100%',
  },
  // --- Project List Styles ---
  headingLarge: {
    fontSize: '28px', // Responsive font size
    fontWeight: '700',
    marginBottom: '30px',
    color: '#1a1a1a', // Darker text for heading
    borderBottom: '2px solid #e0e0e0', // Subtle separator line
    paddingBottom: '15px',
    textAlign: 'center',
  },
  projectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // More responsive grid
    gap: '15px 30px', // Adjusted gaps for better spacing
    color: '#4a4a4a',
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    lineHeight: '1.5',
 // Proper spacing between items
    transition: 'color 0.2s',
    cursor: 'pointer',
    padding: '8px 0',
    '&:hover': {
      color: '#007bff',
    },
  },
  bullet: {
    marginRight: '12px',
    fontSize: '16px', 
    fontWeight: 'bold',
    lineHeight: '1.5',
    color: '#555555',
    flexShrink: 0,
  },
  listText: {
    margin: '0',
    fontSize: '15px',
    lineHeight: '1.6',
    flex: 1,
  },
  // --- About Section Styles ---
  aboutContainer: {
    padding: '25px',
    backgroundColor: '#ededed',
    borderRadius: '8px'
  },
  aboutHeading: {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#000000',
  },
  aboutText: {
    fontSize: '16px',
    color: '#555555',
    lineHeight: '1.7',
    maxWidth: '100%',
    marginBottom: '0',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#333333',
  }
};

// Media queries for responsiveness
const responsiveStyles = {
  container: {
    '@media (max-width: 768px)': {
      padding: '30px 15px',
    },
    '@media (max-width: 480px)': {
      padding: '20px 10px',
    },
  },
  headingLarge: {
    '@media (max-width: 768px)': {
      fontSize: '24px',
      marginBottom: '25px',
      paddingBottom: '12px',
    },
    '@media (max-width: 480px)': {
      fontSize: '20px',
      marginBottom: '20px',
    },
  },
  projectGrid: {
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '12px 20px',
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
      gap: '10px',
    },
  },
  listText: {
    '@media (max-width: 768px)': {
      fontSize: '14px',
    },
    '@media (max-width: 480px)': {
      fontSize: '13px',
    },
  },
  aboutHeading: {
    '@media (max-width: 768px)': {
      fontSize: '20px',
      marginBottom: '15px',
    },
  },
  aboutText: {
    '@media (max-width: 768px)': {
      fontSize: '15px',
    },
    '@media (max-width: 480px)': {
      fontSize: '14px',
    },
  },
};

// Merge styles with responsive styles
const getResponsiveStyle = (baseStyle, responsiveStyle) => {
  return {
    ...baseStyle,
    ...responsiveStyle,
  };
};

// Main component
const ProjectListingPageEnhanced = () => {
  // Data structure for the project list
  const projectList = [
    'Apartment for sale in Thillainagar Trichy', '2 BHK Residential flats for sale in Trichy', 'Flats for sale in Vayalur Road Trichy', '3 BHK Flats/Apartment for sale in Trichy',
    '3 BHK Flats/Apartment in Thillainagar Trichy', '3 BHK flats in Shastri Road Trichy', 'Flats/Apartment for sale in Trichy', '2 BHK Flats/Apartment in Cantonment Trichy',
    'Apartments for sale in Raja Colony Trichy', 'Budget Apartment for sale in Trichy', 'Apartments flats in Trichy for sale', 'Residential Flats for sale in Vasan Nagar Vayalur Road Trichy',
    'Residential Flats for sale in Nachikurichi Trichy', 'Flats for sale in Cantonment Trichy', 'Apartment for sale in nearby Central Bus Stand', 'Independent House / Villa for sale in Trichy',
    'Independent Villa for sale in Trichy', 'Luxury Villa for sale in Trichy', 'Independent House / Villa Vayalur Road Trichy', '2 BHK Residential Flats for sale in Tennur Trichy',
    'Flats for sale in Tennur Trichy', 'Residential Apartment in Tennur Trichy', 'Apartment in Tennur High Road Tennur Trichy', 'Luxury Residential Apartment in Tennur Trichy',
  ];

  return (
    <div style={getResponsiveStyle(styles.container, responsiveStyles.container)}>
      
      {/* --- Our Project List Section --- */}
      <section style={styles.section}>
        <h2 style={getResponsiveStyle(styles.headingLarge, responsiveStyles.headingLarge)}>
          Our Project List
        </h2>
        
        {/* Project List Grid Container */}
        <div style={getResponsiveStyle(styles.projectGrid, responsiveStyles.projectGrid)}>
          {projectList.map((item, itemIndex) => (
            <div key={itemIndex} style={styles.listItem}>
              <span style={styles.bullet}>&gt;</span>
              <p style={getResponsiveStyle(styles.listText, responsiveStyles.listText)}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>


      {/* --- About Mitha Construction and Development Section --- */}
      <section style={styles.section}>
        <div style={styles.aboutContainer}>
          <h2 style={getResponsiveStyle(styles.aboutHeading, responsiveStyles.aboutHeading)}>
            About Mitha Construction and Development
          </h2>
          <p style={getResponsiveStyle(styles.aboutText, responsiveStyles.aboutText)}>
            Mitha Construction and Development is a registered construction firm in <strong style={styles.highlight}>Tiruchirappalli</strong>, 
            headed by <strong style={styles.highlight}>S.Mohan</strong>, a qualified civil engineer from <strong style={styles.highlight}>Seethalayee Institute of Technology (SIT)</strong>. 
            He completed his course in <strong style={styles.highlight}>1985</strong> and has since practised under experienced and leading engineers 
            during the construction of big hotels and residential bungalows, bringing a wealth of experience to every project.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ProjectListingPageEnhanced;