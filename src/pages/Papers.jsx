import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Papers = () => {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('all');

    const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

    useEffect(() => {
        fetchPapers();
    }, [selectedSemester]);

    const fetchPapers = async () => {
        try {
            const url =
                selectedSemester === 'all'
                    ? `${API_URL}/api/papers`
                    : `${API_URL}/api/papers?semester=${selectedSemester}`;

            const response = await fetch(url);
            const data = await response.json();
            setPapers(data.papers || []);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch papers:', err);
            setError('Failed to load papers');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading papers...</p>
            </div>
        );
    }

    return (
        <div className="papers-page">
            <div className="container">
                <div className="page-header">
                    <h1>Question Papers</h1>
                    <p className="page-subtitle">
                        Browse and download previous year question papers
                    </p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="filter-section">
                    <label htmlFor="semester-filter">Filter by Semester:</label>
                    <select
                        id="semester-filter"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className="semester-select"
                    >
                        <option value="all">All Semesters</option>
                        {semesters.map((sem) => (
                            <option key={sem} value={sem}>
                                Semester {sem}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="papers-grid">
                    {papers.length === 0 ? (
                        <div className="empty-state">
                            <p>No papers available for the selected semester.</p>
                        </div>
                    ) : (
                        papers.map((paper) => (
                            <div key={paper.id} className="paper-card">
                                <div className="paper-icon">📄</div>
                                <h3 className="paper-title">{paper.title}</h3>
                                <div className="paper-details">
                                    <div className="paper-detail">
                                        <strong>Subject:</strong> {paper.subject}
                                    </div>
                                    <div className="paper-detail">
                                        <strong>Semester:</strong> {paper.semester}
                                    </div>
                                    <div className="paper-detail">
                                        <strong>Year:</strong> {paper.year}
                                    </div>
                                    <div className="paper-detail">
                                        <strong>Exam Type:</strong> {paper.examType === 'midsem' ? 'Mid-Sem' : 'End-Sem'}
                                    </div>
                                    <div className="paper-detail">
                                        <strong>Uploaded by:</strong> {paper.uploadedBy}
                                    </div>
                                    <div className="paper-detail">
                                        <strong>Date:</strong>{' '}
                                        {new Date(paper.uploadedAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="paper-actions">
                                    <a
                                        href={paper.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                    >
                                        View PDF
                                    </a>
                                    <a
                                        href={paper.fileUrl}
                                        download
                                        className="btn btn-secondary"
                                    >
                                        Download
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Papers;
