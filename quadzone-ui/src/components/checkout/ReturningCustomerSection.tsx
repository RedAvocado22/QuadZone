import { useState } from "react";

interface ReturningCustomerSectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

const ReturningCustomerSection = ({ isOpen, onToggle }: ReturningCustomerSectionProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    return (
        <div className="accordion rounded mb-4" id="checkoutInfo">
            <div className="card border-0">
                <div className="alert alert-primary mb-0" role="alert">
                    Returning customer?{" "}
                    <button type="button" className="btn btn-link p-0 align-baseline" onClick={onToggle}>
                        Click here to login
                    </button>
                </div>
                {isOpen && (
                    <div className="border p-4">
                        <p className="text-gray-90 mb-2">Welcome back! Sign in to access saved addresses.</p>
                        <div className="row">
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="loginEmail">
                                    Email address
                                </label>
                                <input
                                    id="loginEmail"
                                    type="email"
                                    className="form-control"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="loginPassword">
                                    Password
                                </label>
                                <input
                                    id="loginPassword"
                                    type="password"
                                    className="form-control"
                                    placeholder="********"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mt-3">
                            <div className="custom-control custom-checkbox">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(event) => setRememberMe(event.target.checked)}
                                />
                                <label className="custom-control-label" htmlFor="rememberMe">
                                    Remember me
                                </label>
                            </div>
                            <button className="btn btn-primary-dark-w px-5" type="button">
                                Login
                            </button>
                        </div>
                        <div className="mt-2">
                            <a href="#forgot-password" className="text-blue small">
                                Lost your password?
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReturningCustomerSection;
