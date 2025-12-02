import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import mithaConstruction from '../../Assert/LogoDesign/Logo.webp';
import ResponsiveMenu from './ResponsiveMenu';


class Header extends Component {
    render() {
        return (
            <React.Fragment>
                <header className="hidden-sm-xs">
                    <div className="container">
                        <div className="grid-header">
                            <div className="header-logo">
                                <Link to="/">
                                    <img src={mithaConstruction} alt="" />
                                </Link>
                            </div>

                            <div className="header-menu">
                                <Link to="/"> <i className="fa fa-home"></i> </Link>
                                <Link to="/about"> About Us </Link>
                                <Link to="/residential-plots"> Residential Plots </Link>
                                <Link to="/commercial-plots"> Commercial Plots </Link>
                                <Link to="/testimonial"> Testimonials </Link>
                                <Link to="/news-media"> News & Media </Link>
                                <Link to="/contact"> Contact Us </Link>
                                <Link to="#"> <i className="fa fa-search"></i> </Link>
                            </div>
                        </div>
                    </div>
                </header>

                <header className="visible-sm-xs">
                    <div className="grid-header-sm-xs">
                        <div className="left">
                            <Link to="/">
                                <img src="https://mithahomes.com/demo/images/mitha-construction.png" alt="" />
                            </Link>
                        </div>

                        <div className="right">
                            <Link to="tel:+91 908 987 9898"> <i className="fa fa-phone"></i> Call </Link>
                            <button data-bs-toggle="offcanvas" data-bs-target="#slideMenu1"> <i className="fa fa-bars"></i> </button>
                        </div>
                    </div>
                </header>
                <ResponsiveMenu />
            </React.Fragment>
        );
    }
}
export default Header;