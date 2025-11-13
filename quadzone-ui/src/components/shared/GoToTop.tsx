import { useState, useEffect } from "react";

const GoToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <a
            className={`js-go-to u-go-to ${isVisible ? "active" : ""}`}
            href="#"
            onClick={(e) => {
                e.preventDefault();
                scrollToTop();
            }}
            style={{
                position: "fixed",
                bottom: "15px",
                right: "15px",
                display: isVisible ? "block" : "none"
            }}>
            <span className="fas fa-arrow-up u-go-to__inner"></span>
        </a>
    );
};

export default GoToTop;
