import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../shared/Logo';

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
                  <i className="ec ec-support text-primary font-size-56"></i>
                </div>
                <div className="col pl-3">
                  <div className="font-size-13 font-weight-light">Got questions? Call us 24/7!</div>
                  <a href="tel:+80080018588" className="font-size-20 text-gray-90">(800) 8001-8588, </a>
                  <a href="tel:+0600874548" className="font-size-20 text-gray-90">(0600) 874 548</a>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h6 className="mb-1 font-weight-bold">Contact info</h6>
              <address>
                17 Princess Road, London, Greater London NW1 8JR, UK
              </address>
            </div>
            <div className="my-4 my-md-4">
              <ul className="list-inline mb-0 opacity-7">
                <li className="list-inline-item mr-0">
                  <a className="btn font-size-20 btn-icon btn-soft-dark btn-bg-transparent rounded-circle" href="#">
                    <span className="fab fa-facebook-f btn-icon__inner"></span>
                  </a>
                </li>
                <li className="list-inline-item mr-0">
                  <a className="btn font-size-20 btn-icon btn-soft-dark btn-bg-transparent rounded-circle" href="#">
                    <span className="fab fa-google btn-icon__inner"></span>
                  </a>
                </li>
                <li className="list-inline-item mr-0">
                  <a className="btn font-size-20 btn-icon btn-soft-dark btn-bg-transparent rounded-circle" href="#">
                    <span className="fab fa-twitter btn-icon__inner"></span>
                  </a>
                </li>
                <li className="list-inline-item mr-0">
                  <a className="btn font-size-20 btn-icon btn-soft-dark btn-bg-transparent rounded-circle" href="#">
                    <span className="fab fa-github btn-icon__inner"></span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="row">
              <div className="col-12 col-md mb-4 mb-md-0">
                <h6 className="mb-3 font-weight-bold">Find it Fast</h6>
                <ul className="list-group list-group-flush list-group-borderless mb-0 list-group-transparent">
                  <li><Link className="list-group-item list-group-item-action" to="/products">Laptops & Computers</Link></li>
                  <li><Link className="list-group-item list-group-item-action" to="/products">Cameras & Photography</Link></li>
                  <li><Link className="list-group-item list-group-item-action" to="/products">Smart Phones & Tablets</Link></li>
                  <li><Link className="list-group-item list-group-item-action" to="/products">Video Games & Consoles</Link></li>
                  <li><Link className="list-group-item list-group-item-action" to="/products">TV & Audio</Link></li>
                  <li><Link className="list-group-item list-group-item-action" to="/products">Gadgets</Link></li>
                </ul>
              </div>

              <div className="col-12 col-md mb-4 mb-md-0">
                <ul className="list-group list-group-flush list-group-borderless mb-0 list-group-transparent mt-md-6">
                  <li><Link className="list-group-item list-group-item-action" to="/products">Printers & Ink</Link></li>
                  <li><Link className="list-group-item list-group-item-action" to="/products">Software</Link></li>
                  <li><Link className="list-group-item list-group-item-action" to="/products">Office Supplies</Link></li>
                  <li><Link className="list-group-item list-group-item-action" to="/products">Computer Components</Link></li>
                  <li><Link className="list-group-item list-group-item-action" to="/products">Accesories</Link></li>
                </ul>
              </div>

              <div className="col-12 col-md mb-4 mb-md-0">
                <h6 className="mb-3 font-weight-bold">Customer Care</h6>
                <ul className="list-group list-group-flush list-group-borderless mb-0 list-group-transparent">
                  <li><Link className="list-group-item list-group-item-action" to="/account">My Account</Link></li>
                  <li><Link className="list-group-item list-group-item-action" to="/track-order">Order Tracking</Link></li>
                  <li><Link className="list-group-item list-group-item-action" to="/wishlist">Wish List</Link></li>
                  <li><Link className="list-group-item list-group-item-action" to="/customer-service">Customer Service</Link></li>
                  <li><Link className="list-group-item list-group-item-action" to="/returns">Returns / Exchange</Link></li>
                  <li><Link className="list-group-item list-group-item-action" to="/faq">FAQs</Link></li>
                  <li><Link className="list-group-item list-group-item-action" to="/support">Product Support</Link></li>
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

