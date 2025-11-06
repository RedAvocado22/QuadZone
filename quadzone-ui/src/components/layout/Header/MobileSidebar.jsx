import React from 'react';
import Logo from '../../shared/Logo';

const MobileSidebar = () => {
  return (
    <aside id="sidebarHeader1" className="u-sidebar u-sidebar--left u-unfold--hidden u-unfold--css-animation animated">
      <div className="u-sidebar__scroller">
        <div className="u-sidebar__container">
          <div className="u-header-sidebar__footer-offset pb-0">
            {/* Toggle Button */}
            <div className="position-absolute top-0 right-0 z-index-2 pt-4 pr-7">
              <button 
                type="button" 
                className="close ml-auto"
                data-unfold-target="#sidebarHeader1"
              >
                <span aria-hidden="true">
                  <i className="ec ec-close-remove text-gray-90 font-size-20"></i>
                </span>
              </button>
            </div>

            {/* Content */}
            <div className="js-scrollbar u-sidebar__body">
              <div className="u-sidebar__content u-header-sidebar__content">
                <Logo className="d-flex ml-0 navbar-brand u-header__navbar-brand u-header__navbar-brand-vertical" />

                {/* List */}
                <ul id="headerSidebarList" className="u-header-collapse__nav">
                  {/* Home Section */}
                  <li className="u-has-submenu u-header-collapse__submenu">
                    <a className="u-header-collapse__nav-link u-header-collapse__nav-pointer" href="#">
                      Home & Static Pages
                    </a>
                  </li>

                  {/* Shop Pages */}
                  <li className="u-has-submenu u-header-collapse__submenu">
                    <a className="u-header-collapse__nav-link u-header-collapse__nav-pointer" href="#">
                      Shop Pages
                    </a>
                  </li>

                  {/* Product Categories */}
                  <li className="u-has-submenu u-header-collapse__submenu">
                    <a className="u-header-collapse__nav-link u-header-collapse__nav-pointer" href="#">
                      Product Categories
                    </a>
                  </li>

                  {/* Single Product Pages */}
                  <li className="u-has-submenu u-header-collapse__submenu">
                    <a className="u-header-collapse__nav-link u-header-collapse__nav-pointer" href="#">
                      Single Product Pages
                    </a>
                  </li>

                  {/* Ecommerce Pages */}
                  <li className="u-has-submenu u-header-collapse__submenu">
                    <a className="u-header-collapse__nav-link u-header-collapse__nav-pointer" href="#">
                      Ecommerce Pages
                    </a>
                  </li>

                  {/* Blog Pages */}
                  <li className="u-has-submenu u-header-collapse__submenu">
                    <a className="u-header-collapse__nav-link u-header-collapse__nav-pointer" href="#">
                      Blog Pages
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default MobileSidebar;

