import { Link } from "react-router-dom";
import Logo from "../../shared/Logo";

const FooterNav = () => {
    return (
        <div className="pt-8 pb-4 bg-gray-13">
            <div className="container mt-1">
                <div className="row">
                    <div className="col-lg-5">
                        <div className="mb-6">
                            <Logo />
                        </div>
                        <div className="mb-4">
                            <div className="row no-gutters">
                                <div className="col-auto">
                                    <i className="ec ec-support font-size-56" style={{ color: "#667eea" }}></i>
                                </div>
                                <div className="col pl-3">
                                    <div className="font-size-13 font-weight-light">Got questions? Call us 24/7!</div>
                                    <a href="tel:+84123456789" className="font-size-20 text-gray-90">
                                        (+84) 123 456 789,{" "}
                                    </a>
                                    <a href="tel:+0912874548" className="font-size-20 text-gray-90">
                                        0912 874 548
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <h6 className="mb-1 font-weight-bold">Contact info</h6>
                            <address>FPT University Hoa Lac Ha Noi Viet Nam</address>
                        </div>
                        <div className="my-4 my-md-4">
                            <ul className="list-inline mb-0 opacity-7">
                                <li className="list-inline-item mr-0">
                                    <a
                                        className="btn font-size-20 btn-icon btn-soft-dark btn-bg-transparent rounded-circle"
                                        href="http://facebook.com/ILEVIZ.05">
                                        <span className="fab fa-facebook-f btn-icon__inner"></span>
                                    </a>
                                </li>
                                <li className="list-inline-item mr-0">
                                    <a
                                        className="btn font-size-20 btn-icon btn-soft-dark btn-bg-transparent rounded-circle"
                                        href="#">
                                        <span className="fab fa-google btn-icon__inner"></span>
                                    </a>
                                </li>
                                <li className="list-inline-item mr-0">
                                    <a
                                        className="btn font-size-20 btn-icon btn-soft-dark btn-bg-transparent rounded-circle"
                                        href="#">
                                        <span className="fab fa-twitter btn-icon__inner"></span>
                                    </a>
                                </li>
                                <li className="list-inline-item mr-0">
                                    <a
                                        className="btn font-size-20 btn-icon btn-soft-dark btn-bg-transparent rounded-circle"
                                        href="https://github.com/RedAvocado22">
                                        <span className="fab fa-github btn-icon__inner"></span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-7 ml-auto" >
                        <div className="row justify-content-end">
                            <div className="col-12 col-md-auto mb-4 mb-md-0">
                                <h6 className="mb-3 font-weight-bold">Customer Care</h6>
                                <ul className="list-group list-group-flush list-group-borderless mb-0 list-group-transparent">
                                    <li>
                                        <Link className="list-group-item list-group-item-action" to="/about-us">
                                            About Us
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="list-group-item list-group-item-action" to="/account">
                                            My Account
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="list-group-item list-group-item-action" to="/track-order">
                                            Order Tracking
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="list-group-item list-group-item-action" to="/wishlist">
                                            Wish List
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FooterNav;
