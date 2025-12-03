import * as React from 'react';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { sendContact } from '../api/contactApi';

const ContactUsPage: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        subject: Yup.string().required('Subject is required'),
        message: Yup.string().required('Message is required'),
    });

    const handleSubmit = async (values: any, { resetForm }: any) => {
        setIsSubmitting(true);
        try {
            await sendContact(values);

            toast.success('Contact form submitted successfully! We will get back to you soon.');
            resetForm();
        } catch (error) {
            toast.error('Failed to send contact form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="text-center mb-5">
                        <h1 className="h2 mb-3">Contact Us</h1>
                        <p className="text-muted">
                            Have a question or need help? Send us a message and we'll get back to you as soon as possible.
                        </p>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <Formik
                                initialValues={{
                                    name: '',
                                    email: '',
                                    subject: '',
                                    message: '',
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ isValid }) => (
                                    <Form>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="name" className="form-label">
                                                    Name *
                                                </label>
                                                <Field
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    className="form-control"
                                                    placeholder="Your full name"
                                                />
                                                <ErrorMessage name="name" component="div" className="text-danger small mt-1" />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="email" className="form-label">
                                                    Email *
                                                </label>
                                                <Field
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    className="form-control"
                                                    placeholder="your.email@example.com"
                                                />
                                                <ErrorMessage name="email" component="div" className="text-danger small mt-1" />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="subject" className="form-label">
                                                Subject *
                                            </label>
                                            <Field
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                className="form-control"
                                                placeholder="What's this about?"
                                            />
                                            <ErrorMessage name="subject" component="div" className="text-danger small mt-1" />
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="message" className="form-label">
                                                Message *
                                            </label>
                                            <Field
                                                as="textarea"
                                                id="message"
                                                name="message"
                                                rows={6}
                                                className="form-control"
                                                placeholder="Tell us how we can help you..."
                                            />
                                            <ErrorMessage name="message" component="div" className="text-danger small mt-1" />
                                        </div>

                                        <div className="text-center">
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-lg px-5"
                                                disabled={!isValid || isSubmitting}
                                            >
                                                {isSubmitting ? 'Sending...' : 'Send Message'}
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>

                    <div className="row mt-5">
                        <div className="col-md-4 text-center">
                            <div className="mb-3">
                                <i className="ec ec-support font-size-40 text-primary"></i>
                            </div>
                            <h5>Support</h5>
                            <p className="text-muted small">
                                (+800) 856 800 604
                            </p>
                        </div>
                        <div className="col-md-4 text-center">
                            <div className="mb-3">
                                <i className="ec ec-envelope font-size-40 text-primary"></i>
                            </div>
                            <h5>Email</h5>
                            <p className="text-muted small">
                                quadzone04@gmail.com
                            </p>
                        </div>
                        <div className="col-md-4 text-center">
                            <div className="mb-3">
                                <i className="ec ec-map-marker font-size-40 text-primary"></i>
                            </div>
                            <h5>Address</h5>
                            <p className="text-muted small">
                                Hanoi, Vietnam
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;
