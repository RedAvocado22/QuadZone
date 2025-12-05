const AboutUsPage = () => {
    return (
        <div className="about-us-page">
            {/* Hero Section */}
            <div className="py-5" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8 mx-auto text-center">
                            <h1 className="text-white mb-3">About Us</h1>
                            <p className="text-white font-size-18" style={{ opacity: 0.9 }}>
                                QuadZone - Your trusted destination for all technology needs
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Company Story Section */}
            <div className="container py-8">
                <div className="row mb-8">
                    <div className="col-lg-10 mx-auto">
                        <div className="text-center mb-5">
                            <h2 className="font-size-30 mb-3">Our Story</h2>
                            <div className="mx-auto" style={{ width: "80px", height: "3px", backgroundColor: "#667eea" }}></div>
                        </div>
                        <p className="text-gray-90 font-size-16 mb-4">
                            QuadZone was founded with a mission to bring high-quality technology products at the most reasonable prices.
                            We understand that technology is not just about devices, but bridges that help people connect, create, and grow.
                        </p>
                        <p className="text-gray-90 font-size-16">
                            From our early startup days, we have continuously strived to build a reliable e-commerce platform
                            where customers can find everything from laptops, smartphones, to the latest tech accessories.
                        </p>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="row mb-8">
                    <div className="col-md-6 mb-4 mb-md-0">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-5">
                                <div className="mb-4">
                                    <i className="ec ec-favorites font-size-48" style={{ color: "#667eea" }}></i>
                                </div>
                                <h3 className="font-size-20 mb-3">Our Mission</h3>
                                <p className="text-gray-90 mb-0">
                                    To provide high-quality technology products with excellent customer service,
                                    helping everyone access modern technology in the easiest and most convenient way.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-5">
                                <div className="mb-4">
                                    <i className="ec ec-startup font-size-48" style={{ color: "#667eea" }}></i>
                                </div>
                                <h3 className="font-size-20 mb-3">Our Vision</h3>
                                <p className="text-gray-90 mb-0">
                                    To become the leading e-commerce platform in the technology sector,
                                    where customers always find the best products and services with absolute trust.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Core Values */}
                <div className="row mb-8">
                    <div className="col-12">
                        <div className="text-center mb-5">
                            <h2 className="font-size-30 mb-3">Our Core Values</h2>
                            <div className="mx-auto" style={{ width: "80px", height: "3px", backgroundColor: "#667eea" }}></div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="text-center">
                            <div className="mb-3">
                                <i className="ec ec-verified font-size-40" style={{ color: "#667eea" }}></i>
                            </div>
                            <h4 className="font-size-18 mb-2">Quality</h4>
                            <p className="text-gray-90">
                                We only provide genuine products from reputable brands,
                                ensuring the best quality for our customers.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="text-center">
                            <div className="mb-3">
                                <i className="ec ec-transport font-size-40" style={{ color: "#667eea" }}></i>
                            </div>
                            <h4 className="font-size-18 mb-2">Fast Delivery</h4>
                            <p className="text-gray-90">
                                Professional delivery service, ensuring products reach customers
                                quickly and safely.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="text-center">
                            <div className="mb-3">
                                <i className="ec ec-support font-size-40" style={{ color: "#667eea" }}></i>
                            </div>
                            <h4 className="font-size-18 mb-2">24/7 Support</h4>
                            <p className="text-gray-90">
                                Our customer service team is always ready to support and answer
                                all your questions anytime.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="bg-gray-13 py-6 mb-8">
                    <div className="container">
                        <div className="row text-center">
                            <div className="col-6 col-md-3 mb-4 mb-md-0">
                                <div className="mb-2">
                                    <span className="font-size-40 font-weight-bold" style={{ color: "#667eea" }}>10K+</span>
                                </div>
                                <p className="text-gray-90 mb-0">Happy Customers</p>
                            </div>
                            <div className="col-6 col-md-3 mb-4 mb-md-0">
                                <div className="mb-2">
                                    <span className="font-size-40 font-weight-bold" style={{ color: "#667eea" }}>5K+</span>
                                </div>
                                <p className="text-gray-90 mb-0">Products</p>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="mb-2">
                                    <span className="font-size-40 font-weight-bold" style={{ color: "#667eea" }}>50+</span>
                                </div>
                                <p className="text-gray-90 mb-0">Brands</p>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="mb-2">
                                    <span className="font-size-40 font-weight-bold" style={{ color: "#667eea" }}>99%</span>
                                </div>
                                <p className="text-gray-90 mb-0">Satisfaction Rate</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="row mb-8">
                    <div className="col-12">
                        <div className="text-center mb-5">
                            <h2 className="font-size-30 mb-3">Why Choose QuadZone?</h2>
                            <div className="mx-auto" style={{ width: "80px", height: "3px", backgroundColor: "#667eea" }}></div>
                        </div>
                    </div>
                    <div className="col-lg-6 mb-4">
                        <div className="media">
                            <div className="mr-3">
                                <i className="ec ec-checked font-size-30" style={{ color: "#667eea" }}></i>
                            </div>
                            <div className="media-body">
                                <h5 className="font-size-16 mb-2">Competitive Prices</h5>
                                <p className="text-gray-90 mb-0">
                                    We always offer the best prices in the market with many attractive promotions and discounts.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 mb-4">
                        <div className="media">
                            <div className="mr-3">
                                <i className="ec ec-checked font-size-30" style={{ color: "#667eea" }}></i>
                            </div>
                            <div className="media-body">
                                <h5 className="font-size-16 mb-2">Genuine Products</h5>
                                <p className="text-gray-90 mb-0">
                                    100% genuine products with full warranty from manufacturers and distributors.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 mb-4">
                        <div className="media">
                            <div className="mr-3">
                                <i className="ec ec-checked font-size-30" style={{ color: "#667eea" }}></i>
                            </div>
                            <div className="media-body">
                                <h5 className="font-size-16 mb-2">Easy Returns</h5>
                                <p className="text-gray-90 mb-0">
                                    Flexible return and exchange policy within 30 days if products have issues.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 mb-4">
                        <div className="media">
                            <div className="mr-3">
                                <i className="ec ec-checked font-size-30" style={{ color: "#667eea" }}></i>
                            </div>
                            <div className="media-body">
                                <h5 className="font-size-16 mb-2">Secure Payment</h5>
                                <p className="text-gray-90 mb-0">
                                    Multiple secure payment methods with advanced encryption technology.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="row">
                    <div className="col-12">
                        <div className="text-center py-6 px-4 text-white" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                            <h3 className="text-white mb-3">Have Questions?</h3>
                            <p className="text-white mb-4" style={{ opacity: 0.95 }}>
                                Our team is always ready to help you. Contact us anytime!
                            </p>
                            <div className="d-flex justify-content-center flex-wrap">
                                <a href="tel:+80080018588" className="btn btn-white mr-2 mb-2">
                                    <i className="ec ec-phone mr-2"></i>
                                    Call Us
                                </a>
                                <a href="mailto:support@quadzone.com" className="btn btn-outline-white mb-2">
                                    <i className="ec ec-email mr-2"></i>
                                    Email Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;
