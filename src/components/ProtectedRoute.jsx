import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireIETStudent = false }) => {
    const { isAuthenticated, isIETStudent, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requireIETStudent && !isIETStudent) {
        return (
            <div className="access-denied">
                <h2>Access Denied</h2>
                <p>This feature is only available to IET DAVV students (@ietdavv.edu.in)</p>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
