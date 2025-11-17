import { useState } from "react";
import SearchBar from "../../shared/SearchBar";
import CartIcon from "../../shared/CartIcon";

const VerticalMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="d-none d-xl-block bg-primary">
            <div className="container">
                <div className="row align-items-stretch min-height-50">
                    {/* Vertical Menu */}
                    <div className="col-md-auto d-none d-xl-flex align-items-end">
                        <div className="max-width-270 min-width-270">
                            <div id="basicsAccordion">
                                <div className="card border-0 rounded-0">
                                    <div
                                        className="card-header bg-primary rounded-0 card-collapse border-0"
                                        id="basicsHeadingOne">
                                        <button
                                            type="button"
                                            className="btn-link btn-remove-focus btn-block d-flex card-btn py-3 text-lh-1 px-4 shadow-none btn-primary rounded-top-lg border-0 font-weight-bold text-gray-90"
                                            onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                            <span className="pl-1 text-gray-90">Shop By Department</span>
                                            <span className="text-gray-90 ml-3">
                                                <span className="ec ec-arrow-down-search"></span>
                                            </span>
                                        </button>
                                    </div>

                                    {isMenuOpen && (
                                        <div className="collapse show vertical-menu v1">
                                            <div className="card-body p-0">
                                                <nav className="js-mega-menu navbar navbar-expand-xl u-header__navbar u-header__navbar--no-space">
                                                    <div className="collapse navbar-collapse u-header__navbar-collapse">
                                                        <ul className="navbar-nav u-header__navbar-nav border-primary border-top-0">
                                                            <li className="nav-item u-header__nav-item">
                                                                <a
                                                                    href="#"
                                                                    className="nav-link u-header__nav-link font-weight-bold">
                                                                    New Arrivals
                                                                </a>
                                                            </li>
                                                            <li className="nav-item u-header__nav-item">
                                                                <a
                                                                    href="#"
                                                                    className="nav-link u-header__nav-link font-weight-bold">
                                                                    Computers & Accessories
                                                                </a>
                                                            </li>
                                                            <li className="nav-item u-header__nav-item">
                                                                <a
                                                                    href="#"
                                                                    className="nav-link u-header__nav-link font-weight-bold">
                                                                    Cameras, Audio & Video
                                                                </a>
                                                            </li>
                                                            <li className="nav-item u-header__nav-item">
                                                                <a
                                                                    href="#"
                                                                    className="nav-link u-header__nav-link font-weight-bold">
                                                                    Mobiles & Tablets
                                                                </a>
                                                            </li>
                                                            <li className="nav-item u-header__nav-item">
                                                                <a
                                                                    href="#"
                                                                    className="nav-link u-header__nav-link font-weight-bold">
                                                                    TV & Audio
                                                                </a>
                                                            </li>
                                                            <li className="nav-item u-header__nav-item">
                                                                <a
                                                                    href="#"
                                                                    className="nav-link u-header__nav-link font-weight-bold">
                                                                    Watches & Eyewear
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </nav>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="col align-self-center">
                        <SearchBar />
                    </div>

                    {/* Header Icons */}
                    <div className="col-md-auto align-self-center">
                        <div className="d-flex">
                            <ul className="d-flex list-unstyled mb-0">
                                <li className="col">
                                    <a
                                        href="/compare"
                                        className="text-gray-90"
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="Compare">
                                        <i className="font-size-22 ec ec-compare"></i>
                                    </a>
                                </li>
                                <li className="col">
                                    <a
                                        href="/wishlist"
                                        className="text-gray-90"
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="Favorites">
                                        <i className="font-size-22 ec ec-favorites"></i>
                                    </a>
                                </li>
                                <CartIcon />
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerticalMenu;
