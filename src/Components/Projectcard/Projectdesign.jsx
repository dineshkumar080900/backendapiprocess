import React, { useState, useEffect } from 'react';

// --- API Endpoint ---
const API_URL = 'http://mitrahomebackendapi.pemixcels.com/api/MaincardApi/all';

const ProjectCardsGrid = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Data Fetching Logic ---
    useEffect(() => {
        const fetchAllProjects = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                
                if (result.data && Array.isArray(result.data)) {
                    setProjects(result.data); 
                } else {
                    setError("Invalid data format received from the API.");
                }
            } catch (e) {
                console.error("Fetching error: ", e);
                setError("Failed to fetch project details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllProjects();
    }, []);

    // --- Loading and Error States ---
    if (isLoading) {
        return <div style={{ padding: '40px', textAlign: 'center', fontSize: '1.2em' }}>Loading project details...</div>;
    }

    if (error) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;
    }

    if (projects.length === 0) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>No projects available to display.</div>;
    }

    // --- Style Variable Definitions ---
    const COLORS = {
        primaryOrange: '#f47d48',
        primaryGreen: '#5cb85c',
        primaryDarkBlue: '#0275d8',
        textOrange: '#e46d3e',
        cardBg: '#ffffff',
        borderColor: '#e0e0e0',
        lightGray: '#f0f0f0',
        mediumGray: '#888',
        darkGray: '#333',
        mediumDarkGray: '#555',
        shareIconColor: '#444'
    };

    // --- Grid Container Style (Main Layout) ---
    const mainContainerStyle = {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: COLORS.lightGray,
        padding: '20px',
        margin: 0,
        minHeight: '100vh',
    };

    const gridStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px', // Space between cards
        justifyContent: 'flex-start',
        maxWidth: '1200px', // Example max width for the grid
        margin: '0 auto',
    };

    // --- Card-Specific Styles (Define outside the map for performance) ---

    // The width calculation: (100% / 3) - (Gap space for both sides)
    const cardStyle = {
        width: 'calc((100% / 3) - 14px)', // 20px gap / 3 columns = 6.66px per side, adjusting for 2 gaps total. Let's use ~14px total padding reduction for 20px gaps.
        minWidth: '350px', // Ensure readability on smaller screens if the width calculation is off
        flexGrow: 0,
        flexShrink: 0,
        backgroundColor: COLORS.cardBg,
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
    };

    // Rest of the static card styles are defined here:
    const headerStyle = { textAlign: 'center', padding: '15px 0 10px' };
    const titleStyle = { color: COLORS.textOrange, fontSize: '1.5em', margin: 0, fontWeight: 'bold' };
    const subtitleStyle = { color: COLORS.mediumGray, fontSize: '0.9em', margin: '5px 0 0' };
    const imageContainerStyle = { position: 'relative', width: '100%', height: '300px', backgroundColor: '#eee' };
    const promoImageStyle = { width: '100%', height: '100%', objectFit: 'cover' };
    
    // Status Label - Function to ensure dynamic background/text
    const getStatusLabelStyle = (status) => ({
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: status < 100 ? COLORS.primaryGreen : COLORS.primaryOrange,
        color: 'white',
        fontWeight: 'bold',
        padding: '15px 15px 15px 40px',
        fontSize: '0.9em',
        transform: 'rotate(45deg) translate(25%, 30%)',
        transformOrigin: 'bottom right',
        width: '150px',
        textAlign: 'center',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
    });

    const shareIconContainerStyle = { position: 'absolute', top: '10px', left: '10px', width: '30px', height: '30px', backgroundColor: 'rgba(255, 255, 255, 0.6)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' };
    const shareIconStyle = { fontSize: '1.2em', color: COLORS.shareIconColor };
    const detailsSectionStyle = { padding: '15px', borderBottom: `1px solid ${COLORS.borderColor}` };
    const detailsTitleStyle = { fontSize: '1.2em', margin: '0 0 15px', fontWeight: 'bold', color: COLORS.darkGray };
    const detailItemStyle = { display: 'flex', alignItems: 'flex-start', marginBottom: '10px', gap: '10px' };
    const detailPStyle = { margin: 0, fontSize: '0.95em', lineHeight: 1.3, color: COLORS.mediumDarkGray };
    
    const detailIconStyle = (iconUrl) => ({
        display: 'inline-block', width: '20px', height: '20px', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', flexShrink: 0, marginTop: '2px', backgroundImage: `url('${iconUrl}')`
    });

    const actionsSectionStyle = { display: 'flex', justifyContent: 'space-between', padding: '15px', gap: '10px' };
    
    const btnBaseStyle = { flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 5px', textDecoration: 'none', color: 'white', fontWeight: 'bold', borderRadius: '5px', fontSize: '0.9em', whiteSpace: 'nowrap', transition: 'background-color 0.2s' };
    const viewMoreBtnStyle = { ...btnBaseStyle, backgroundColor: COLORS.primaryOrange };
    const brochureBtnStyle = { ...btnBaseStyle, backgroundColor: COLORS.primaryGreen };
    const getDirectionBtnStyle = { ...btnBaseStyle, backgroundColor: COLORS.primaryDarkBlue };

    const btnIconStyle = (iconUrl) => ({
        display: 'inline-block', width: '16px', height: '16px', marginRight: '5px', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundImage: `url('${iconUrl}')`
    });
    
    // Icon Data (Unchanged for brevity, assumed to be defined outside)
    const ICON_DATA = { /* ... your icon data ... */ };
    // Since the full icon data is too long, it's defined in the previous response.
    // Ensure you include all icon definitions from the previous response here.
    const getIconData = (name) => {
        const data = {
            location: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23e46d3e" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
            bed: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23e46d3e" d="M19 7h-2c0-2.76-2.24-5-5-5S7 4.24 7 7H5c-1.1 0-2 .9-2 2v6h1.5v-2H5v-4h2v2h10v-2h2v4h1.5v2H21V9c0-1.1-.9-2-2-2zm-8 0c0-1.66 1.34-3 3-3s3 1.34 3 3H11zM6 17v-3h12v3c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2z"/></svg>',
            project: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23e46d3e" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
            viewMore: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M12 17.41L18.41 11 17 9.59l-5 5-5-5L4.59 11 12 17.41z"/></svg>',
            pdf: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 2v16H6V4h12zM9.5 14.5v-3h1v3h-1zm3 0v-3h1v3h-1zM7 8h10v2H7z"/></svg>',
            arrow: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>',
        };
        return data[name];
    };


    // --- 3. JSX Render using dynamic data and map ---
    return (
        <div style={mainContainerStyle}>
            <div style={gridStyle}>
                {projects.map((project) => (
                    <div key={project.pid} style={cardStyle}>
                        
                        {/* 1. Header Section */}
                        <div style={headerStyle}>
                            <h1 style={titleStyle}>{project.project_name || "Project Name Missing"}</h1>
                            <p style={subtitleStyle}>{project.project_location || "Location Missing"}</p>
                        </div>

                        {/* 2. Image and Labels Section */}
                        <div style={imageContainerStyle}>
                            <img 
                                src={project.project_cover_img || project.project_small_img || 'placeholder.jpg'} 
                                alt={project.project_name} 
                                style={promoImageStyle} 
                            />
                            
                            {/* Status Label (Dynamic: Green for Ongoing, Orange for Completed/100%) */}
                         
                            
                            {/* Share Icon */}
                            <div style={shareIconContainerStyle}>
                                <span style={shareIconStyle}>⤿</span>
                            </div>
                        </div>

                        {/* 3. Details Section */}
                        <div style={detailsSectionStyle}>
                            <h2 style={detailsTitleStyle}>{project.project_name || "Project Details"}</h2>
                            
                            {/* Location Detail */}
                            <div style={detailItemStyle}>
                                <span style={detailIconStyle(getIconData('location'))}></span>
                                <p style={detailPStyle}><strong>{project.project_location || "Location data unavailable"}</strong></p>
                            </div>
                            
                            {/* Project Type Detail */}
                            <div style={detailItemStyle}>
                                <span style={detailIconStyle(getIconData('bed'))}></span>
                                <p style={detailPStyle}><strong>{project.project_type || "Type data unavailable"}</strong></p>
                            </div>
                            
                            {/* Project Status Detail */}
                            <div style={detailItemStyle}>
                                <span style={detailIconStyle(getIconData('project'))}></span>
                                <p style={detailPStyle}>
                                    {project.project_status === 100 ? 
                                        "Completed Project" : 
                                        `Ongoing Project (${project.project_status || '...'}%)`}
                                </p>
                            </div>
                        </div>

                        {/* 4. Actions Section */}
                        <div style={actionsSectionStyle}>
                            <a href={`/project/${project.pid}`} style={viewMoreBtnStyle}>
                                <span style={btnIconStyle(getIconData('viewMore'))}></span> View More
                            </a>
                            
                            <a href={project.attached_brochare || '#'} style={brochureBtnStyle} target="_blank" rel="noopener noreferrer">
                                <span style={btnIconStyle(getIconData('pdf'))}></span> Brochure
                            </a>
                            
                            <a href={project.get_direction || '#'} style={getDirectionBtnStyle} target="_blank" rel="noopener noreferrer">
                                <span style={btnIconStyle(getIconData('arrow'))}></span> Get Direction
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectCardsGrid;