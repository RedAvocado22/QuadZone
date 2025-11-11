import { useState } from "react";
import { Link } from "react-router-dom";
import { heroImages } from "../../constants/images";

const HeroSection = () => {
    type TabId = keyof typeof tabContent;

    const [activeTab, setActiveTab] = useState<TabId>("gaming-monitors");

    const tabs = [
        { id: "gaming-monitors", label: "Gaming Monitors 65" },
        { id: "smartphones", label: "Smartphones Sale" },
        { id: "end-season", label: "End Season Sale" },
        { id: "laptops", label: "Laptops Arrivals" },
        { id: "earphones", label: "Earphones - 25%" },
        { id: "tablets", label: "Tablets 10 inch Sale" }
    ];

    const tabContent = {
        "gaming-monitors": {
            title: "END SEASON",
            subtitle: "GAMING MONITORS",
            discount: "250",
            image: heroImages[1]
        },
        smartphones: {
            title: "END SEASON",
            subtitle: "SMARTPHONES",
            discount: "250",
            image: heroImages[2]
        },
        "end-season": {
            title: "END SEASON",
            subtitle: "SMARTPHONES",
            discount: "250",
            image: heroImages[3]
        },
        laptops: {
            title: "END SEASON",
            subtitle: "SMARTPHONES",
            discount: "250",
            image: heroImages[4]
        },
        earphones: {
            title: "END SEASON",
            subtitle: "SMARTPHONES",
            discount: "250",
            image: heroImages[1]
        },
        tablets: {
            title: "END SEASON",
            subtitle: "SMARTPHONES",
            discount: "250",
            image: heroImages[2]
        }
    };

    const currentContent = tabContent[activeTab];

    return (
        <div className="container mb-6">
            <div className="row">
                <div className="col">
                    <div className="bg-light rounded-lg p-5">
                        <div className="row align-items-end">
                            <div className="col-lg-5">
                                <h1 className="font-size-58 text-lh-57 mb-3 font-weight-light">
                                    {currentContent.title}{" "}
                                    <span className="d-block font-size-50">{currentContent.subtitle}</span>
                                </h1>
                                <div className="mb-6">
                                    <span className="font-size-15 font-weight-bold">LAST CALL FOR UP TO</span>
                                    <span className="font-size-55 font-weight-bold text-lh-45">
                                        <sup className="font-size-36">$</sup>
                                        {currentContent.discount}
                                        <sub className="font-size-16">OFF!</sub>
                                    </span>
                                </div>
                                <Link
                                    to="/products"
                                    className="btn btn-primary transition-3d-hover rounded-lg font-weight-normal py-2 px-md-7 px-3 font-size-16">
                                    Start Buying
                                </Link>
                            </div>
                            <div className="col-lg-7">
                                <img className="img-fluid rounded-lg" src={currentContent.image} alt="Product" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-auto">
                    <div className="bg-light max-width-216">
                        <ul className="nav nav-box-custom bg-white rounded-sm py-2" role="tablist">
                            {tabs.map((tab) => (
                                <li key={tab.id} className="nav-item mx-0">
                                    <a
                                        className={`nav-link p-2 px-4 ${activeTab === tab.id ? "active" : ""}`}
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveTab(tab.id);
                                        }}>
                                        <span className="font-size-14">{tab.label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
