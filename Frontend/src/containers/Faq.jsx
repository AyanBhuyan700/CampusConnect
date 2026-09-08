import React, { useState } from "react";
import { Link } from "react-router-dom";

function FAQ() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");

    const faqs = [
        {
            id: "faq1",
            category: "general",
            question: "What is CampusConnect and how does it work?",
            answer: "CampusConnect is a global university discovery network that aggregates verified academic records, department details, and course catalogs. Students can browse, filter, compare universities worldwide, and directly contact faculties or inquire about degrees."
        },
        {
            id: "faq2",
            category: "admissions",
            question: "Is there any cost for students to use CampusConnect?",
            answer: "No, CampusConnect is 100% free for all students, parents, and educators. You can explore university rankings, course catalogs, and department directories without any subscription fee."
        },
        {
            id: "faq3",
            category: "admissions",
            question: "How do I apply or inquire about a specific course?",
            answer: "Navigate to the desired university, select the respective Department, and click on 'View Courses'. On the course card, click 'Inquire Program' to initiate a direct admission inquiry with the department."
        },
        {
            id: "faq4",
            category: "general",
            question: "How frequently is university and course data updated?",
            answer: "Our academic directory is updated on a weekly basis in coordination with university registrars and department chairs to ensure tuition rates, course codes, and faculty rosters remain current."
        },
        {
            id: "faq5",
            category: "technical",
            question: "How can I submit a support ticket or request an institution listing?",
            answer: "You can submit an official request through our 'Submit Request' form under the Support menu. Our administration team processes incoming listings and tickets within 24–48 hours."
        },
        {
            id: "faq6",
            category: "technical",
            question: "How do I access the Admin Panel?",
            answer: "The Admin Panel is reserved for registered university administrators and system operators. Once an admin account logs in, the 'Admin Panel' dropdown will automatically appear in the top navigation bar."
        }
    ];

    const filteredFaqs = faqs.filter(faq => {
        const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="container py-5">
            {/* Header */}
            <div className="text-center mb-5">
                <span className="section-badge">
                    <i className="bi bi-question-circle-fill"></i> Help Center
                </span>
                <h1 className="section-title">Frequently Asked Questions</h1>
                <p className="section-subtitle">
                    Quickly find clear answers to common questions about navigating CampusConnect, admissions, and course catalogs.
                </p>
            </div>

            {/* Search & Category Filter */}
            <div className="glass-card p-3 p-md-4 mb-4" style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div className="input-icon-wrapper mb-3">
                    <i className="bi bi-search"></i>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search answers (e.g. costs, applying, admin, updates)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <button
                        className={`btn btn-sm rounded-pill px-3 fw-semibold ${activeCategory === 'all' ? 'btn-primary' : 'btn-light border'}`}
                        onClick={() => setActiveCategory('all')}
                    >
                        All Topics
                    </button>
                    <button
                        className={`btn btn-sm rounded-pill px-3 fw-semibold ${activeCategory === 'general' ? 'btn-primary' : 'btn-light border'}`}
                        onClick={() => setActiveCategory('general')}
                    >
                        General Info
                    </button>
                    <button
                        className={`btn btn-sm rounded-pill px-3 fw-semibold ${activeCategory === 'admissions' ? 'btn-primary' : 'btn-light border'}`}
                        onClick={() => setActiveCategory('admissions')}
                    >
                        Admissions & Courses
                    </button>
                    <button
                        className={`btn btn-sm rounded-pill px-3 fw-semibold ${activeCategory === 'technical' ? 'btn-primary' : 'btn-light border'}`}
                        onClick={() => setActiveCategory('technical')}
                    >
                        Technical & Admin
                    </button>
                </div>
            </div>

            {/* Accordion FAQ list */}
            <div className="accordion mb-5" id="faqAccordion" style={{ maxWidth: "800px", margin: "0 auto" }}>
                {filteredFaqs.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="bi bi-search fs-1 text-muted"></i>
                        <p className="text-muted mt-2">No answers match "{searchTerm}". Try a different keyword.</p>
                    </div>
                ) : (
                    filteredFaqs.map((item, idx) => (
                        <div key={item.id} className="accordion-item mb-3 border rounded-3 overflow-hidden shadow-sm">
                            <h2 className="accordion-header" id={`heading${item.id}`}>
                                <button
                                    className={`accordion-button fw-bold py-3 ${idx !== 0 ? 'collapsed' : ''}`}
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapse${item.id}`}
                                    aria-expanded={idx === 0 ? "true" : "false"}
                                    aria-controls={`collapse${item.id}`}
                                    style={{ fontSize: "1rem" }}
                                >
                                    {item.question}
                                </button>
                            </h2>
                            <div
                                id={`collapse${item.id}`}
                                className={`accordion-collapse collapse ${idx === 0 ? 'show' : ''}`}
                                aria-labelledby={`heading${item.id}`}
                                data-bs-parent="#faqAccordion"
                            >
                                <div className="accordion-body text-secondary small" style={{ lineHeight: "1.7", backgroundColor: "#fafbfc" }}>
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Need More Assistance Banner */}
            <div className="glass-card p-4 text-center" style={{ maxWidth: "800px", margin: "0 auto" }}>
                <h5 className="fw-bold text-dark mb-2">Didn't find what you're looking for?</h5>
                <p className="text-muted small mb-3">Our support specialists are always on standby to assist with specific questions.</p>
                <div className="d-flex justify-content-center gap-2">
                    <Link to="/contact" className="btn btn-sm btn-outline-primary rounded-pill px-4 fw-semibold">
                        Contact Advisory
                    </Link>
                    <Link to="/support-request" className="btn btn-sm btn-primary rounded-pill px-4 fw-semibold">
                        Submit Ticket
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default FAQ;
