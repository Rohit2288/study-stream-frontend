import React, { useState, useEffect } from 'react';
import './Summaries.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Summaries = () => {
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSummaries();
    }, []);

    const fetchSummaries = async () => {
        try {
            const response = await fetch(`${API_URL}/api/summaries`);
            const data = await response.json();
            setSummaries(data.summaries || []);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch summaries:', err);
            setError('Failed to load summaries');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading summaries...</p>
            </div>
        );
    }

    return (
        <div className="summaries-page">
            <div className="container">
                <div className="page-header">
                    <h1>Chat Summaries</h1>
                    <p className="page-subtitle">
                        AI-generated summaries of discussion rooms
                    </p>
                </div>

                {error && <div className="error-message">{error}</div>}

                {summaries.length === 0 ? (
                    <div className="empty-state">
                        <p>📭 No summaries generated yet.</p>
                        <p>Summaries are created when discussion rooms are ended.</p>
                    </div>
                ) : (
                    <div className="summaries-grid">
                        {summaries.map((summary) => (
                            <div key={summary.id} className="summary-card">
                                <div className="summary-header">
                                    <h3>{summary.roomTitle}</h3>
                                </div>
                                <div className="summary-meta">
                                    <span>📚 {summary.subject}</span>
                                    <span>📅 Semester {summary.semester}</span>
                                    <span>📝 {summary.year} - {summary.examType === 'midsem' ? 'Mid-Sem' : 'End-Sem'}</span>
                                </div>
                                <div className="summary-content">
                                    <div dangerouslySetInnerHTML={{ __html: summary.content.replace(/\n/g, '<br/>') }} />
                                </div>
                                <div className="summary-footer">
                                    <span>🤖 Generated: {new Date(summary.generatedAt).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Summaries;
