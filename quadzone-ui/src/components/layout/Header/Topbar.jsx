import React from 'react';

const Topbar = () => {

  return (
    <div className="u-header-topbar py-2 d-none d-xl-block">
      <div className="container">
        <div className="d-flex align-items-center">
          <div className="topbar-left">
            <a href="#" className="text-gray-110 font-size-13 u-header-topbar__nav-link" onClick={(e) => e.preventDefault()}>
              Welcome to Worldwide Electronics Store
            </a>
          </div>
          <div className="topbar-right ml-auto">
            <ul className="list-inline mb-0">
              <li className="list-inline-item mr-0 u-header-topbar__nav-item u-header-topbar__nav-item-border">
                <a href="/track-order" className="u-header-topbar__nav-link">
                  <i className="ec ec-transport mr-1"></i> Track Your Order
                </a>
              </li>
              <li className="list-inline-item mr-0 u-header-topbar__nav-item u-header-topbar__nav-item-border">
                <a 
                  id="sidebarNavToggler" 
                  href="#" 
                  className="u-header-topbar__nav-link"
                  onClick={(e) => e.preventDefault()}
                  data-unfold-event="click"
                  data-unfold-hide-on-scroll="false"
                  data-unfold-target="#sidebarContent"
                  data-unfold-type="css-animation"
                  data-unfold-animation-in="fadeInRight"
                  data-unfold-animation-out="fadeOutRight"
                  data-unfold-duration="500"
                  aria-controls="sidebarContent"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="ec ec-user mr-1"></i> Register <span className="text-gray-50">or</span> Sign in
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;

