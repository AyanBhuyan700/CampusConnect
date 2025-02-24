import React from "react";

function FAQ() {
    return (
        <div className="container mt-5">
            <h2 className="text-center text-primary mb-4">Frequently Asked Questions</h2>

            <div className="accordion" id="faqAccordion">
                {/* Question 1 */}
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                            What is this website about?
                        </button>
                    </h2>
                    <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                        <div className="accordion-body">
                            This website provides university listings with detailed information on their departments and courses.
                        </div>
                    </div>
                </div>

                {/* Question 2 */}
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                            How can I submit a request?
                        </button>
                    </h2>
                    <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                        <div className="accordion-body">
                            You can submit a request using the <strong>Submit Request</strong> form available on our website.
                        </div>
                    </div>
                </div>

                {/* Question 3 */}
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                            Is there a cost to use this platform?
                        </button>
                    </h2>
                    <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                        <div className="accordion-body">
                            No, our platform is free to use for students and universities.
                        </div>
                    </div>
                </div>

                {/* Question 4 */}
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                            How can I contact support?
                        </button>
                    </h2>
                    <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                        <div className="accordion-body">
                            You can contact support through our <strong>Contact Us</strong> page or email us at <a href="mailto:support@example.com">support@example.com</a>.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FAQ;
