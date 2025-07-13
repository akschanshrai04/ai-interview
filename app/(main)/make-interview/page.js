"use client"

import { useState } from "react";
import { useAuth } from "@/context/Authcontext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createInterview } from "@/lib/firestoreHelpers";
import { generateQuestionsWithGemini } from "@/lib/geminifunction";


export default function MakeInterviewPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        interviewType: "technical",
        techStack: [],
        experienceLevel: "2 years",
        questionCount: 5
    });

    const [newTech, setNewTech] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && !user) router.push("/login");
    }, [user, loading, router]);

    if (loading) return (<div className="bg-white text-black">loading...</div>);
    if (!user) return null;

    const interviewTypes = [
        { value: "technical", label: "Technical Interview" },
        { value: "behavioural", label: "Behavioural Interview" },
        { value: "mixed", label: "Mixed Interview" }
    ];

    const experienceLevels = [
        "0-1 years", "1-2 years", "2-3 years", "3-5 years", "5+ years"
    ];

    const handleTechStackAdd = () => {
        const trimmedTech = newTech.trim();
        if (trimmedTech && !formData.techStack.includes(trimmedTech) && formData.techStack.length < 5) {
            setFormData(prev => ({
                ...prev,
                techStack: [...prev.techStack, trimmedTech]
            }));
            setNewTech("");
        }
    };

    const handleTechStackRemove = (tech) => {
        setFormData(prev => ({
            ...prev,
            techStack: prev.techStack.filter(t => t !== tech)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const newErrors = {};

        if (formData.techStack.length === 0) {
            newErrors.techStack = "Please select at least one technology";
        }

        if (formData.questionCount < 1 || formData.questionCount > 12) {
            newErrors.questionCount = "Question count must be between 1 and 12";
        }

        if (Object.keys(newErrors).length === 0) {
            try {
                console.log("Interview Configuration:", formData);
                const questions = await generateQuestionsWithGemini(formData);
                const interviewId = await createInterview({
                    userId: user.uid,
                    formData,
                    questions,
                });
                console.log("interview created : " , interviewId);
                router.push(`/interview/${interviewId}`);
            } catch (error) {
                console.error("Error creating interview:", error);
                setErrors({ submit: error.message || "Failed to create interview. Please try again." });
            }
        } else {
            setErrors(newErrors);
        }
        
        setIsSubmitting(false);
    };

    return (
        <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f5f5f5' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>Create New Interview</h1>
                <button 
                    onClick={() => router.push("/home")}
                    style={{ 
                        padding: '8px 16px', 
                        backgroundColor: '#6c757d', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    ← Back to Dashboard
                </button>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '15px', 
                    padding: '40px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '30px', textAlign: 'center' }}>
                        Configure Your Interview
                    </h2>

                    <form onSubmit={handleSubmit}>
                        {/* Interview Type */}
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                                Interview Type *
                            </label>
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                {interviewTypes.map(type => (
                                    <label key={type.value} style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        cursor: 'pointer',
                                        padding: '10px 15px',
                                        border: formData.interviewType === type.value ? '2px solid #007bff' : '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        backgroundColor: formData.interviewType === type.value ? '#f8f9ff' : 'white',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <input
                                            type="radio"
                                            name="interviewType"
                                            value={type.value}
                                            checked={formData.interviewType === type.value}
                                            onChange={(e) => setFormData(prev => ({ ...prev, interviewType: e.target.value }))}
                                            style={{ marginRight: '8px' }}
                                        />
                                        {type.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Tech Stack */}
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                                Tech Stack * (Max 5 technologies)
                            </label>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                <input
                                    type="text"
                                    value={newTech}
                                    onChange={(e) => setNewTech(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleTechStackAdd();
                                        }
                                    }}
                                    placeholder="Type a technology and press Enter or click +"
                                    disabled={formData.techStack.length >= 5}
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px',
                                        flex: '1',
                                        fontSize: '14px',
                                        backgroundColor: formData.techStack.length >= 5 ? '#f5f5f5' : 'white'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleTechStackAdd}
                                    disabled={!newTech.trim() || formData.techStack.length >= 5}
                                    style={{
                                        padding: '12px 16px',
                                        backgroundColor: (!newTech.trim() || formData.techStack.length >= 5) ? '#ccc' : '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: (!newTech.trim() || formData.techStack.length >= 5) ? 'not-allowed' : 'pointer',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        minWidth: '50px'
                                    }}
                                >
                                    +
                                </button>
                            </div>
                            
                            {/* Selected Tech Stack */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {formData.techStack.map(tech => (
                                    <span key={tech} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '5px 12px',
                                        backgroundColor: '#e3f2fd',
                                        color: '#1976d2',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        border: '1px solid #bbdefb'
                                    }}>
                                        {tech}
                                        <button
                                            type="button"
                                            onClick={() => handleTechStackRemove(tech)}
                                            style={{
                                                marginLeft: '8px',
                                                background: 'none',
                                                border: 'none',
                                                color: '#1976d2',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                            {formData.techStack.length >= 5 && (
                                <p style={{ color: '#ffc107', fontSize: '14px', marginTop: '5px' }}>
                                    Maximum 5 technologies reached
                                </p>
                            )}
                            {errors.techStack && (
                                <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>{errors.techStack}</p>
                            )}
                        </div>

                        {/* Experience Level */}
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                                Experience Level
                            </label>
                            <select
                                value={formData.experienceLevel}
                                onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    fontSize: '14px'
                                }}
                            >
                                {experienceLevels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>

                        {/* Question Count */}
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                                Number of Questions
                            </label>
                                                            <input
                                    type="number"
                                    min="1"
                                    max="12"
                                    value={formData.questionCount}
                                onChange={(e) => setFormData(prev => ({ ...prev, questionCount: parseInt(e.target.value) || 0 }))}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.questionCount ? '1px solid #dc3545' : '1px solid #ddd',
                                    borderRadius: '5px',
                                    fontSize: '14px'
                                }}
                            />
                            {errors.questionCount && (
                                <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>{errors.questionCount}</p>
                            )}
                        </div>

                        {/* Error Display */}
                        {errors.submit && (
                            <div style={{ 
                                marginBottom: '20px', 
                                padding: '15px', 
                                backgroundColor: '#f8d7da', 
                                color: '#721c24', 
                                border: '1px solid #f5c6cb', 
                                borderRadius: '5px',
                                textAlign: 'center'
                            }}>
                                {errors.submit}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div style={{ textAlign: 'center' }}>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    padding: '15px 40px',
                                    fontSize: '18px',
                                    backgroundColor: isSubmitting ? '#6c757d' : '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    fontWeight: 'bold',
                                    boxShadow: isSubmitting ? 'none' : '0 4px 15px rgba(0,123,255,0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => !isSubmitting && (e.target.style.transform = 'translateY(-2px)')}
                                onMouseOut={(e) => !isSubmitting && (e.target.style.transform = 'translateY(0)')}
                            >
                                {isSubmitting ? '⏳ Generating Interview...' : '🎤 Start Interview'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
