import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const UploadPaper = () => {
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        semester: '',
        year: '',
        examType: 'midsem'
    });
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    const { token } = useAuth();
    const navigate = useNavigate();

    const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const years = [2025, 2024, 2023, 2022, 2021, 2020];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Please select a valid PDF file');
            setFile(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!file) {
            setError('Please select a PDF file');
            return;
        }

        setUploading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('file', file);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('subject', formData.subject);
            formDataToSend.append('semester', formData.semester);
            formDataToSend.append('year', formData.year);
            formDataToSend.append('examType', formData.examType);

            const response = await fetch(`${API_URL}/api/papers/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            navigate('/papers');
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-page">
            <div className="container">
                <div className="upload-container">
                    <h1>Upload Question Paper</h1>
                    <p className="page-subtitle">
                        Share question papers with your fellow students
                    </p>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit} className="upload-form">
                        <div className="form-group">
                            <label htmlFor="title">Paper Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Data Structures Mid-Term 2023"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Data Structures and Algorithms"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="semester">Semester</label>
                            <select
                                id="semester"
                                name="semester"
                                value={formData.semester}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Semester</option>
                                {semesters.map((sem) => (
                                    <option key={sem} value={sem}>
                                        Semester {sem}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="year">Year</label>
                            <select
                                id="year"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Year</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="examType">Exam Type</label>
                            <select
                                id="examType"
                                name="examType"
                                value={formData.examType}
                                onChange={handleChange}
                                required
                            >
                                <option value="midsem">Mid-Sem</option>
                                <option value="endsem">End-Sem</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="file">PDF File</label>
                            <input
                                type="file"
                                id="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                required
                            />
                            {file && (
                                <small className="text-success">✓ {file.name} selected</small>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={uploading}
                        >
                            {uploading ? 'Uploading...' : 'Upload Paper'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadPaper;
