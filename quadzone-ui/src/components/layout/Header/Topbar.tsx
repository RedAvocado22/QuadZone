import { Link } from "react-router-dom";
import { useUser } from "../../../hooks/useUser";
import CurrencyToggle from "./CurrencyToggle";

const Topbar = () => {
    const { user, logout } = useUser();

    const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        logout();
    };

    return (
        <div className="u-header-topbar py-2 d-none d-xl-block">
            <div className="container">
                <div className="d-flex align-items-center">
                    <div className="topbar-left">
                        <a
                            href="#"
                            className="text-gray-110 font-size-13 u-header-topbar__nav-link"
                            onClick={(e) => e.preventDefault()}>
                            Welcome to Worldwide Electronics Store
                        </a>
                    </div>
                    <div className="topbar-right ml-auto">
                        <ul className="list-inline mb-0">
                            <li className="list-inline-item mr-0 u-header-topbar__nav-item u-header-topbar__nav-item-border">
                                <Link to="/track-order" className="u-header-topbar__nav-link">
                                    <i className="ec ec-transport mr-1"></i> Track Your Order
                                </Link>
                            </li>
                            <li className="list-inline-item mr-0 u-header-topbar__nav-item u-header-topbar__nav-item-border u-header-topbar__nav-item-no-border u-header-topbar__nav-item-border-single">
                                <div className="d-flex align-items-center">
                                    <CurrencyToggle />
                                </div>
                            </li>

                            {/* --- CONDITIONAL LINKS --- */}
                            {user ? (
                                <>
                                    <li className="list-inline-item mr-0 u-header-topbar__nav-item u-header-topbar__nav-item-border">
                                        {/* Assuming your user object has a firstName property */}
                                        <Link to="/profile" className="u-header-topbar__nav-link">
                                            <i className="ec ec-user mr-1"></i>
                                            Hi, {user ? `${user.firstName} ${user.lastName}`.trim() : "My Account"}
                                        </Link>
                                    </li>
                                    {
                                        user?.role === "ADMIN" ? (
                                            <>
                                                <li className="list-inline-item mr-0 u-header-topbar__nav-item u-header-topbar__nav-item-border">
                                                    <Link to={"/admin"} className="u-header-topbar__nav-link">
                                                        <i className="ec ec-user mr-1"></i>
                                                        Admin Dashboard
                                                    </Link>
                                                </li>
                                            </>
                                        ) : (
                                            <></>
                                        )
                                    }
                                    <li className="list-inline-item mr-0 u-header-topbar__nav-item u-header-topbar__nav-item-border">
                                        <a href="#" className="u-header-topbar__nav-link" onClick={handleLogout}>
                                            {/* You might need to find the correct icon class for logout */}
                                            <i className="ec ec-exit mr-1"></i>
                                            Logout
                                        </a>
                                    </li>
                                </>
                            ) : (
                                // User is LOGGED OUT
                                <>
                                    <li className="list-inline-item mr-0 u-header-topbar__nav-item u-header-topbar__nav-item-border">
                                        <Link to="/login" className="u-header-topbar__nav-link">
                                            <i className="ec ec-user mr-1"></i> Sign in
                                        </Link>
                                    </li>
                                    <li className="list-inline-item mr-0 u-header-topbar__nav-item u-header-topbar__nav-item-border">
                                        <Link to="/register" className="u-header-topbar__nav-link">
                                            Register
                                        </Link>
                                    </li>
                                </>
                            )}

                            {/* --- END CONDITIONAL LINKS --- */}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
