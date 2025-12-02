import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import mithaConstruction from '../../Assert/LogoDesign/Logo.webp';

class ResponsiveMenu extends Component {    
   render() {
        return(
            <div className="offcanvas offcanvas-start offcanvas-1" tabIndex="-1" id="slideMenu1" aria-labelledby="slideMenu1ExampleLabel">
                <div className="offcanvas-header">
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    <div className="user-profile">
                        <div className="profile-img">
                            <Link data-bs-dismiss="offcanvas" to="/"> 
                                <img src={mithaConstruction} alt="" /> 
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="offcanvas-body">
                    <div className="canvas-holder-1">
                        <ul className="style-1">
                            <li> <Link data-bs-dismiss="offcanvas" to="/"> Home </Link> </li>
                            <li> <Link data-bs-dismiss="offcanvas" to="/about"> About </Link> </li>
                            <li> <Link data-bs-dismiss="offcanvas" to="/residential-plots"> Residential Plots </Link> </li>
                            <li> <Link data-bs-dismiss="offcanvas" to="/commercial-plots"> Commercial Plots </Link> </li>
                            <li> <Link data-bs-dismiss="offcanvas" to="/testimonial"> Testimonials </Link> </li>
                            <li> <Link data-bs-dismiss="offcanvas" to="/news-media"> News & Media </Link> </li>
                            <li> <Link data-bs-dismiss="offcanvas" to="/contact"> Contact Us </Link> </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
   }
}

export default ResponsiveMenu;