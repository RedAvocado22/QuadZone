import Logo from "../../shared/Logo";
import { useCart } from "../../../contexts/CartContext";
import { useCurrency } from "../../../contexts/CurrencyContext";
import { fCurrency } from "../../../utils/formatters";

const MiddleHeader = () => {
    const { totalItems, totalPrice } = useCart();
    const { currency, convertPrice } = useCurrency();
    return (
        <div className="py-2 py-xl-4 bg-primary-down-lg">
            <div className="container my-0dot5 my-xl-0">
                <div className="row align-items-center">
                    {/* Logo */}
                    <div className="col-auto">
                        <nav className="navbar navbar-expand u-header__navbar py-0 justify-content-xl-between max-width-270 min-width-270">
                            <Logo className="order-1 order-xl-0 navbar-brand u-header__navbar-brand u-header__navbar-brand-center" />

                            {/* Hamburger for mobile */}
                            <button
                                id="sidebarHeaderInvokerMenu"
                                type="button"
                                className="navbar-toggler d-block btn u-hamburger mr-3 mr-xl-0"
                                data-unfold-event="click"
                                data-unfold-hide-on-scroll="false"
                                data-unfold-target="#sidebarHeader1"
                                data-unfold-type="css-animation"
                                data-unfold-animation-in="fadeInLeft"
                                data-unfold-animation-out="fadeOutLeft"
                                data-unfold-duration="500"
                                aria-controls="sidebarHeader1"
                                aria-haspopup="true"
                                aria-expanded="false">
                                <span id="hamburgerTriggerMenu" className="u-hamburger__box">
                                    <span className="u-hamburger__inner"></span>
                                </span>
                            </button>
                        </nav>
                    </div>

                    {/* Primary Menu (Desktop) */}
                    <div className="col d-none d-xl-block">
                        <nav className="js-mega-menu navbar navbar-expand-md u-header__navbar u-header__navbar--no-space">
                            <div id="navBar" className="collapse navbar-collapse u-header__navbar-collapse">
                                <ul className="navbar-nav u-header__navbar-nav">
                                    <li className="nav-item u-header__nav-item">
                                        <a className="nav-link u-header__nav-link" href="/">
                                            Home
                                        </a>
                                    </li>
                                    <li className="nav-item u-header__nav-item">
                                        <a className="nav-link u-header__nav-link" href="/about">
                                            About us
                                        </a>
                                    </li>
                                    <li className="nav-item u-header__nav-item">
                                        <a className="nav-link u-header__nav-link" href="/faq">
                                            FAQs
                                        </a>
                                    </li>
                                    <li className="nav-item u-header__nav-item">
                                        <a className="nav-link u-header__nav-link" href="/contact">
                                            Contact Us
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>

                    {/* Customer Care */}
                    <div className="d-none d-xl-block col-md-auto">
                        <div className="d-flex">
                            <i className="ec ec-support font-size-50 text-primary"></i>
                            <div className="ml-2">
                                <div className="phone">
                                    <strong>Support</strong>{" "}
                                    <a href="tel:800856800604" className="text-gray-90">
                                        (+800) 856 800 604
                                    </a>
                                </div>
                                <div className="email">
                                    E-mail:{" "}
                                    <a href="mailto:info@electro.com?subject=Help Need" className="text-gray-90">
                                        quadzone@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Header Icons */}
                    <div className="d-xl-none col col-xl-auto text-right text-xl-left pl-0 pl-xl-3 position-static">
                        <div className="d-inline-flex">
                            <ul className="d-flex list-unstyled mb-0 align-items-center">
                                <li className="col d-xl-none px-2 px-sm-3 position-static">
                                    <a className="font-size-22 text-gray-90 text-lh-1 btn-text-secondary" href="#">
                                        <span className="ec ec-search"></span>
                                    </a>
                                </li>
                                <li className="col d-xl-none px-2 px-sm-3">
                                    <a href="/account" className="text-gray-90">
                                        <i className="font-size-22 ec ec-user"></i>
                                    </a>
                                </li>
                                <li className="col pr-xl-0 px-2 px-sm-3">
                                    <a href="/cart" className="text-gray-90 position-relative d-flex">
                                        <i className="font-size-22 ec ec-shopping-bag"></i>
                                        <span className="width-22 height-22 bg-dark position-absolute d-flex align-items-center justify-content-center rounded-circle left-12 top-8 font-weight-bold font-size-12 text-white">
                                            {totalItems}
                                        </span>
                                        <span className="d-none d-xl-block font-weight-bold font-size-16 text-gray-90 ml-3">
                                            {fCurrency(convertPrice(totalPrice), { currency })}
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiddleHeader;
