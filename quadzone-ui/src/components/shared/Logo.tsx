import { Link } from "react-router-dom";

const Logo = ({ className = "" }) => {
    return (
        <Link className={`navbar-brand u-header__navbar-brand ${className}`} to="/" aria-label="Electro">
            <svg
                version="1.1"
                x="0px"
                y="0px"
                width="120px"
                height="42.52px"
                viewBox="0 0 120 42.52"
                enableBackground="new 0 0 120 42.52"
                style={{ marginBottom: 0 }}>
                <text
                    x="50%"
                    y="52%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="#333E48"
                    fontSize="25"
                    fontFamily="Arial, sans-serif"
                    fontWeight="bold">
                    QuadZone
                </text>
            </svg>
        </Link>
    );
};

export default Logo;
