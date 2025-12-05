import { Link } from "react-router-dom";

const FAQPage = () => {
    const faqs = [
        {
            category: "General",
            questions: [
                {
                    question: "What is QuadZone?",
                    answer: "QuadZone is an e-commerce platform specializing in technology products including laptops, smartphones, tablets, accessories, and more. We offer high-quality products at competitive prices with excellent customer service."
                },
                {
                    question: "How do I create an account?",
                    answer: "You can create an account by clicking on the 'Register' button in the top navigation bar. You'll need to provide your email address, name, and create a password. Alternatively, you can checkout as a guest without creating an account."
                },
                {
                    question: "Do I need an account to make a purchase?",
                    answer: "No, you can checkout as a guest without creating an account. However, having an account allows you to track your orders, save your shipping information, and access exclusive deals."
                }
            ]
        },
        {
            category: "Orders & Shipping",
            questions: [
                {
                    question: "How can I track my order?",
                    answer: "Once your order is confirmed, you'll receive a tracking number via email. You can also track your order by visiting the 'Track Order' page and entering your order number."
                },
                {
                    question: "What are the shipping options?",
                    answer: "We offer various shipping options including standard shipping, express shipping, and same-day delivery (where available). Shipping costs and delivery times are calculated at checkout based on your location."
                },
                {
                    question: "How long does shipping take?",
                    answer: "Shipping times vary depending on your location and the shipping method selected. Standard shipping typically takes 3-7 business days, while express shipping takes 1-3 business days. You'll see estimated delivery dates at checkout."
                },
                {
                    question: "Can I change or cancel my order?",
                    answer: "You can cancel your order within 24 hours of placement if it hasn't been processed yet. To change your order, please contact our customer service team as soon as possible."
                }
            ]
        },
        {
            category: "Payment",
            questions: [
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept various payment methods including credit cards, debit cards, bank transfers, and cash on delivery (where available). All payments are processed securely through our payment gateway."
                },
                {
                    question: "Is my payment information secure?",
                    answer: "Yes, we use industry-standard encryption and secure payment gateways to protect your payment information. We never store your full credit card details on our servers."
                },
                {
                    question: "When will I be charged?",
                    answer: "For credit card and bank transfer payments, you'll be charged immediately when you place your order. For cash on delivery, you'll pay when the product is delivered to you."
                }
            ]
        },
        {
            category: "Returns & Refunds",
            questions: [
                {
                    question: "What is your return policy?",
                    answer: "We offer a 30-day return policy for most products. Items must be in their original condition with all packaging and accessories included. Some items like software licenses may have different return policies."
                },
                {
                    question: "How do I return a product?",
                    answer: "To return a product, log into your account, go to your orders, and select the item you want to return. Follow the return process and you'll receive a return label. Once we receive the item, we'll process your refund."
                },
                {
                    question: "How long does it take to process a refund?",
                    answer: "Refunds are typically processed within 5-10 business days after we receive the returned item. The refund will be issued to the original payment method used for the purchase."
                }
            ]
        },
        {
            category: "Products",
            questions: [
                {
                    question: "Are the products genuine and authentic?",
                    answer: "Yes, all products sold on QuadZone are 100% genuine and authentic. We source our products directly from authorized distributors and manufacturers."
                },
                {
                    question: "Do products come with a warranty?",
                    answer: "Yes, most products come with manufacturer warranties. Warranty periods vary by product and manufacturer. You'll find warranty information on each product page."
                },
                {
                    question: "What if a product is out of stock?",
                    answer: "If a product is out of stock, you can sign up for email notifications to be alerted when it becomes available again. We restock popular items regularly."
                }
            ]
        },
        {
            category: "Account & Support",
            questions: [
                {
                    question: "How do I reset my password?",
                    answer: "Click on 'Login' and then 'Forgot Password'. Enter your email address and you'll receive a password reset link. Follow the instructions in the email to create a new password."
                },
                {
                    question: "How can I contact customer support?",
                    answer: "You can contact our customer support team through the 'Contact Us' page, via email at quadzone@gmail.com, or by calling our support line at (+800) 856 800 604. Our support team is available Monday to Friday, 9 AM to 6 PM."
                },
                {
                    question: "Can I change my account information?",
                    answer: "Yes, you can update your account information including name, email, phone number, and address by logging into your account and visiting the 'Profile' page."
                }
            ]
        }
    ];

    return (
        <div className="faq-page">
            {/* Hero Section */}
            <div className="py-5" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8 mx-auto text-center">
                            <h1 className="text-white mb-3">Frequently Asked Questions</h1>
                            <p className="text-white" style={{ opacity: 0.9 }}>
                                Find answers to common questions about QuadZone
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="bg-gray-13 bg-md-transparent">
                <div className="container">
                    <div className="my-md-3">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-3 flex-nowrap flex-xl-wrap overflow-auto overflow-xl-visble">
                                <li className="breadcrumb-item flex-shrink-0 flex-xl-shrink-1">
                                    <Link to="/">Home</Link>
                                </li>
                                <li
                                    className="breadcrumb-item flex-shrink-0 flex-xl-shrink-1 active"
                                    aria-current="page">
                                    FAQ
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            {/* FAQ Content */}
            <div className="container py-8">
                <div className="row">
                    <div className="col-lg-10 mx-auto">
                        {faqs.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="mb-8">
                                <h2 className="font-size-24 mb-4" style={{ color: "#667eea" }}>{category.category}</h2>
                                <div className="accordion" id={`faqAccordion${categoryIndex}`}>
                                    {category.questions.map((faq, faqIndex) => {
                                        const itemId = `faq-${categoryIndex}-${faqIndex}`;
                                        return (
                                            <div key={faqIndex} className="card border mb-3">
                                                <div className="card-header bg-white p-0" id={`heading${itemId}`}>
                                                    <button
                                                        className="btn btn-link text-left w-100 p-4 font-weight-bold text-gray-90"
                                                        type="button"
                                                        data-toggle="collapse"
                                                        data-target={`#${itemId}`}
                                                        aria-expanded={faqIndex === 0 ? "true" : "false"}
                                                        aria-controls={itemId}>
                                                        <span className="d-flex align-items-center">
                                                            <i className="ec ec-help font-size-20 mr-3" style={{ color: "#667eea" }}></i>
                                                            {faq.question}
                                                        </span>
                                                    </button>
                                                </div>
                                                <div
                                                    id={itemId}
                                                    className={`collapse ${faqIndex === 0 ? "show" : ""}`}
                                                    aria-labelledby={`heading${itemId}`}
                                                    data-parent={`#faqAccordion${categoryIndex}`}>
                                                    <div className="card-body p-4 text-gray-90">
                                                        {faq.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Still Have Questions Section */}
                <div className="row mt-8">
                    <div className="col-lg-8 mx-auto">
                        <div className="card border-0 shadow-sm text-white text-center p-5" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                            <h3 className="font-size-24 mb-3">Still Have Questions?</h3>
                            <p className="mb-4" style={{ opacity: 0.95 }}>
                                Can't find the answer you're looking for? Please contact our friendly team.
                            </p>
                            <Link to="/contact" className="btn btn-light">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
