import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <h1>IET Study Stream</h1>
                    </Link>

                    <nav className="nav">
                        {isAuthenticated ? (
                            <>
                                <Link to="/chat" className="nav-link">Chat</Link>
                                <Link to="/summaries" className="nav-link">Summaries</Link>
                                <Link to="/papers" className="nav-link">Papers</Link>
                                {user?.isIETStudent && (
                                    <Link to="/upload" className="nav-link">Upload Paper</Link>
                                )}
                                <div className="user-info">
                                    <span className="user-name">{user?.name}</span>
                                    <button onClick={handleLogout} className="btn btn-secondary">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/papers" className="nav-link">Papers</Link>
                                <Link to="/login" className="btn btn-primary">Login</Link>
                                <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
