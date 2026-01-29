import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="home-page">
            <section className="hero">
                <div className="container">
                    <img src="/logo.png" alt="IET DAVV Logo" className="hero-logo" />
                    <h1 className="hero-title">IET Study Stream</h1>
                    <p className="hero-subtitle">
                        Academic Collaboration Platform for IET DAVV Students
                    </p>
                    <p className="hero-description">
                        Connect, collaborate, and excel together. Join your fellow students in real-time discussions,
                        access AI-powered chat summaries, and build a comprehensive question paper repository.
                    </p>

                    <div className="cta-buttons">
                        {isAuthenticated ? (
                            <>
                                <Link to="/chat" className="btn btn-primary btn-large">
                                    Go to Chat
                                </Link>
                                <Link to="/papers" className="btn btn-secondary btn-large">
                                    Browse Papers
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/signup" className="btn btn-primary btn-large">
                                    Get Started
                                </Link>
                                <Link to="/login" className="btn btn-secondary btn-large">
                                    Login
                                </Link>
                                <Link to="/papers" className="btn btn-outline btn-large">
                                    View Papers
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="container">
                    <h2 className="section-title">Features</h2>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3>Real-Time Chat</h3>
                            <p>
                                Connect with fellow IET DAVV students instantly. Share knowledge,
                                discuss coursework, and collaborate in real-time.
                            </p>
                            <div className="feature-badge badge-teal">IET Students Only</div>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="12" cy="9" r="2" />
                                </svg>
                            </div>
                            <h3>AI-Powered Summaries</h3>
                            <p>
                                Get concise, academic-style summaries of chat discussions powered by
                                Google Gemini AI. Never miss important study information.
                            </p>
                            <div className="feature-badge badge-green">Available to All</div>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="16" cy="16" r="3" />
                                </svg>
                            </div>
                            <h3>Question Paper Repository</h3>
                            <p>
                                Access a comprehensive collection of previous year question papers,
                                organized by semester and subject.
                            </p>
                            <div className="feature-badge badge-blue">Public Access</div>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3>Secure & Controlled</h3>
                            <p>
                                Email-based access control ensures only verified IET DAVV students
                                can contribute and participate in discussions.
                            </p>
                            <div className="feature-badge badge-amber">@ietdavv.edu.in</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="how-it-works">
                <div className="container">
                    <h2 className="section-title">How It Works</h2>

                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Sign Up</h3>
                            <p>Create an account with your IET DAVV email address</p>
                        </div>

                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>Connect</h3>
                            <p>Join the real-time chat and connect with your peers</p>
                        </div>

                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Collaborate</h3>
                            <p>Share resources, discuss topics, and access study materials</p>
                        </div>

                        <div className="step">
                            <div className="step-number">4</div>
                            <h3>Excel</h3>
                            <p>Leverage AI summaries and question papers to ace your exams</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="container">
                    <h2>Ready to Join?</h2>
                    <p>Start collaborating with your fellow students today</p>
                    {!isAuthenticated && (
                        <Link to="/signup" className="btn btn-primary btn-large">
                            Create Account
                        </Link>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
