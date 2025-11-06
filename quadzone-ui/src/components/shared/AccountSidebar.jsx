import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AccountSidebar = () => {
  const [activeForm, setActiveForm] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (activeForm === 'login') {
        await login(formData.email, formData.password);
      } else if (activeForm === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match!');
          return;
        }
        await signup(formData.email, formData.password);
      }
      // Close sidebar after successful auth
      // You can implement sidebar close logic here
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <aside id="sidebarContent" className="u-sidebar u-sidebar__lg u-unfold--hidden u-unfold--css-animation animated" aria-labelledby="sidebarNavToggler">
      <div className="u-sidebar__scroller">
        <div className="u-sidebar__container">
          <div className="js-scrollbar u-header-sidebar__footer-offset pb-3">
            {/* Toggle Button */}
            <div className="d-flex align-items-center pt-4 px-7">
              <button 
                type="button" 
                className="close ml-auto" 
                data-unfold-target="#sidebarContent"
              >
                <i className="ec ec-close-remove"></i>
              </button>
            </div>

            {/* Content */}
            <div className="js-scrollbar u-sidebar__body">
              <div className="u-sidebar__content u-header-sidebar__content">
                <form className="js-validate" onSubmit={handleSubmit}>
                  {/* Login Form */}
                  {activeForm === 'login' && (
                    <div id="login">
                      <header className="text-center mb-7">
                        <h2 className="h4 mb-0">Welcome Back!</h2>
                        <p>Login to manage your account.</p>
                      </header>

                      <div className="form-group">
                        <div className="js-form-message js-focus-state">
                          <label className="sr-only" htmlFor="signinEmail">Email</label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <span className="fas fa-user"></span>
                              </span>
                            </div>
                            <input 
                              type="email" 
                              className="form-control" 
                              name="email" 
                              id="signinEmail" 
                              placeholder="Email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="js-form-message js-focus-state">
                          <label className="sr-only" htmlFor="signinPassword">Password</label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <span className="fas fa-lock"></span>
                              </span>
                            </div>
                            <input 
                              type="password" 
                              className="form-control" 
                              name="password" 
                              id="signinPassword" 
                              placeholder="Password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-end mb-4">
                        <a 
                          className="js-animation-link small link-muted" 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); setActiveForm('forgot'); }}
                        >
                          Forgot Password?
                        </a>
                      </div>

                      <div className="mb-2">
                        <button type="submit" className="btn btn-block btn-sm btn-primary transition-3d-hover">
                          Login
                        </button>
                      </div>

                      <div className="text-center mb-4">
                        <span className="small text-muted">Do not have an account?</span>
                        <a 
                          className="js-animation-link small text-dark" 
                          href="#"
                          onClick={(e) => { e.preventDefault(); setActiveForm('signup'); }}
                        >
                          Signup
                        </a>
                      </div>

                      <div className="text-center">
                        <span className="u-divider u-divider--xs u-divider--text mb-4">OR</span>
                      </div>

                      <div className="d-flex">
                        <a className="btn btn-block btn-sm btn-soft-facebook transition-3d-hover mr-1" href="#">
                          <span className="fab fa-facebook-square mr-1"></span>
                          Facebook
                        </a>
                        <a className="btn btn-block btn-sm btn-soft-google transition-3d-hover ml-1 mt-0" href="#">
                          <span className="fab fa-google mr-1"></span>
                          Google
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Signup Form */}
                  {activeForm === 'signup' && (
                    <div id="signup">
                      <header className="text-center mb-7">
                        <h2 className="h4 mb-0">Welcome to Electro.</h2>
                        <p>Fill out the form to get started.</p>
                      </header>

                      <div className="form-group">
                        <div className="js-form-message js-focus-state">
                          <label className="sr-only" htmlFor="signupEmail">Email</label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <span className="fas fa-user"></span>
                              </span>
                            </div>
                            <input 
                              type="email" 
                              className="form-control" 
                              name="email" 
                              id="signupEmail" 
                              placeholder="Email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="js-form-message js-focus-state">
                          <label className="sr-only" htmlFor="signupPassword">Password</label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <span className="fas fa-lock"></span>
                              </span>
                            </div>
                            <input 
                              type="password" 
                              className="form-control" 
                              name="password" 
                              id="signupPassword" 
                              placeholder="Password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="js-form-message js-focus-state">
                          <label className="sr-only" htmlFor="signupConfirmPassword">Confirm Password</label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <span className="fas fa-key"></span>
                              </span>
                            </div>
                            <input 
                              type="password" 
                              className="form-control" 
                              name="confirmPassword" 
                              id="signupConfirmPassword" 
                              placeholder="Confirm Password"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-2">
                        <button type="submit" className="btn btn-block btn-sm btn-primary transition-3d-hover">
                          Get Started
                        </button>
                      </div>

                      <div className="text-center mb-4">
                        <span className="small text-muted">Already have an account?</span>
                        <a 
                          className="js-animation-link small text-dark" 
                          href="#"
                          onClick={(e) => { e.preventDefault(); setActiveForm('login'); }}
                        >
                          Login
                        </a>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AccountSidebar;

