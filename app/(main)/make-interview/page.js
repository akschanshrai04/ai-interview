"use client"

import { useState, useEffect } from "react";
import { useAuth } from "@/context/Authcontext";
import { useRouter } from "next/navigation";
import { createInterview } from "@/lib/firestoreHelpers";
import { generateQuestionsWithGemini } from "@/lib/geminifunction";
import { ArrowLeft, Plus, X, Mic, Code, Users, Settings } from "lucide-react";

export default function MakeInterviewPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        interviewType: "technical",
        techStack: [],
        experienceLevel: "2-3 years",
        questionCount: 5
    });

    const [newTech, setNewTech] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && !user) router.push("/login");
    }, [user, loading, router]);

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-dark-charcoal">Loading...</div>
    </div>;
    if (!user) return null;

    const interviewTypes = [
        { 
            value: "technical", 
            label: "Technical Interview", 
            icon: Code,
            description: "Focus on coding, algorithms, and technical skills"
        },
        { 
            value: "behavioural", 
            label: "Behavioural Interview", 
            icon: Users,
            description: "Assess soft skills and past experiences"
        },
        { 
            value: "mixed", 
            label: "Mixed Interview", 
            icon: Settings,
            description: "Combination of technical and behavioural questions"
        }
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
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="w-full h-16 bg-white border-b border-border px-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => router.push("/home")}
                        className="flex items-center space-x-2 text-medium-gray hover:text-dark-charcoal transition-colors duration-200"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="font-medium">Back to Dashboard</span>
                    </button>
                </div>
                
                <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-medium text-dark-charcoal">
                            {user?.displayName || "User"}
                        </div>
                        <div className="text-xs text-medium-gray">
                            {user?.email || "user@example.com"}
                        </div>
                    </div>
                    
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-foreground">
                            {(user?.displayName || "U").split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-dark-charcoal mb-2">
                            Create New Interview
                        </h1>
                        <p className="text-medium-gray">
                            Configure your interview settings and start practicing with AI
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-border p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Interview Type */}
                            <div>
                                <label className="block text-lg font-semibold text-dark-charcoal mb-4">
                                    Interview Type
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {interviewTypes.map(type => {
                                        const Icon = type.icon;
                                        return (
                                            <label key={type.value} className={`
                                                relative cursor-pointer group
                                                ${formData.interviewType === type.value 
                                                    ? 'ring-2 ring-primary bg-primary/5 border-primary' 
                                                    : 'border-gray-200 hover:border-primary/50'
                                                }
                                                border-2 rounded-lg p-4 transition-all duration-200
                                            `}>
                                                <input
                                                    type="radio"
                                                    name="interviewType"
                                                    value={type.value}
                                                    checked={formData.interviewType === type.value}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, interviewType: e.target.value }))}
                                                    className="sr-only"
                                                />
                                                <div className="flex items-start space-x-3">
                                                    <div className={`p-2 rounded-lg ${formData.interviewType === type.value ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-dark-charcoal mb-1">
                                                            {type.label}
                                                        </div>
                                                        <div className="text-sm text-medium-gray">
                                                            {type.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div>
                                <label className="block text-lg font-semibold text-dark-charcoal mb-4">
                                    Tech Stack <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-4">
                                    <div className="flex space-x-3">
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
                                            placeholder="Type a technology (e.g., React, Python, AWS)"
                                            disabled={formData.techStack.length >= 5}
                                            className={`
                                                flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
                                                ${formData.techStack.length >= 5 ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                                                ${errors.techStack ? 'border-red-500' : 'border-gray-200'}
                                            `}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleTechStackAdd}
                                            disabled={!newTech.trim() || formData.techStack.length >= 5}
                                            className={`
                                                px-4 py-3 rounded-lg font-medium transition-all duration-200
                                                ${!newTech.trim() || formData.techStack.length >= 5
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    : 'bg-primary text-white hover:bg-primary/90'
                                                }
                                            `}
                                        >
                                            <Plus className="h-5 w-5" />
                                        </button>
                                    </div>
                                    
                                    {/* Selected Tech Stack */}
                                    {formData.techStack.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.techStack.map(tech => (
                                                <span key={tech} className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium">
                                                    {tech}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleTechStackRemove(tech)}
                                                        className="ml-2 text-primary hover:text-primary/70 transition-colors"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {formData.techStack.length >= 5 && (
                                        <p className="text-amber-600 text-sm">
                                            Maximum 5 technologies reached
                                        </p>
                                    )}
                                    {errors.techStack && (
                                        <p className="text-red-500 text-sm">{errors.techStack}</p>
                                    )}
                                </div>
                            </div>

                            {/* Experience Level and Question Count */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-lg font-semibold text-dark-charcoal mb-3">
                                        Experience Level
                                    </label>
                                    <select
                                        value={formData.experienceLevel}
                                        onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                                    >
                                        {experienceLevels.map(level => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-lg font-semibold text-dark-charcoal mb-3">
                                        Number of Questions
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="12"
                                        value={formData.questionCount}
                                        onChange={(e) => setFormData(prev => ({ ...prev, questionCount: parseInt(e.target.value) || 0 }))}
                                        className={`
                                            w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white
                                            ${errors.questionCount ? 'border-red-500' : 'border-gray-200'}
                                        `}
                                    />
                                    {errors.questionCount && (
                                        <p className="text-red-500 text-sm mt-1">{errors.questionCount}</p>
                                    )}
                                </div>
                            </div>

                            {/* Error Display */}
                            {errors.submit && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {errors.submit}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`
                                        w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200
                                        ${isSubmitting
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl'
                                        }
                                    `}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Generating Interview...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-2">
                                            <Mic className="h-5 w-5" />
                                            <span>Start Interview</span>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
