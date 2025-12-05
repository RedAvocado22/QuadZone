import { Link } from "react-router-dom";

const Logo = ({ className = "" }) => {
    return (
        <Link
            className={`navbar-brand u-header__navbar-brand ${className}`}
            style={{ width: "10.4rem" }}
            to="/"
            aria-label="QuadZone">
            <svg
                version="1.1"
                x="0px"
                y="0px"
                width="150px"
                height="42.52px"
                viewBox="0 0 150 42.52"
                enableBackground="new 0 0 150 42.52"
                style={{ marginBottom: 0 }}>
                <text x="7" y="32" fill="#333E48" fontSize="28" fontFamily="Arial, sans-serif" fontWeight="bold">
                    QuadZone
                </text>
                <circle cx="145" cy="30" r="5" fill="#667eea" />
            </svg>
        </Link>
    );
};

export default Logo;
