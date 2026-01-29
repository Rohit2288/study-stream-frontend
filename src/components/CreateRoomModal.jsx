import React, { useState } from 'react';
import './CreateRoomModal.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const CreateRoomModal = ({ isOpen, onClose, onRoomCreated, token }) => {
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        semester: '',
        year: '',
        examType: 'midsem'
    });
    const [questionPaper, setQuestionPaper] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type (images only)
            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file');
                return;
            }

            setQuestionPaper(file);
            setError('');

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!questionPaper) {
                throw new Error('Please upload a question paper image');
            }

            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('subject', formData.subject);
            formDataToSend.append('semester', formData.semester);
            formDataToSend.append('year', formData.year);
            formDataToSend.append('examType', formData.examType);
            formDataToSend.append('questionPaper', questionPaper);

            const response = await fetch(`${API_URL}/api/chat-rooms`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create room');
            }

            // Reset form
            setFormData({
                title: '',
                subject: '',
                semester: '',
                year: '',
                examType: 'midsem'
            });
            setQuestionPaper(null);
            setPreview(null);

            onRoomCreated(data.room);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create Discussion Room</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="create-room-form">
                    <div className="form-group">
                        <label htmlFor="title">Room Title *</label>
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

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="subject">Subject *</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Data Structures"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="semester">Semester *</label>
                            <select
                                id="semester"
                                name="semester"
                                value={formData.semester}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Semester</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                    <option key={sem} value={sem}>{sem}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="year">Year *</label>
                            <select
                                id="year"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Year</option>
                                {[2025, 2024, 2023, 2022, 2021, 2020].map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="examType">Exam Type *</label>
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
                    </div>

                    <div className="form-group">
                        <label htmlFor="questionPaper">Question Paper Image *</label>
                        <input
                            type="file"
                            id="questionPaper"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                        />
                        {preview && (
                            <div className="image-preview">
                                <img src={preview} alt="Question paper preview" />
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRoomModal;
