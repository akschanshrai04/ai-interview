"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/Authcontext";
import { getInterviewById } from "@/lib/firestoreHelpers";
import { generateInterviewFeedback } from "@/lib/geminifunction";
import { ArrowLeft, Download, FileText, User, Calendar, Code, Users } from "lucide-react";

export default function FeedbackPage() {
    const [interview, setInterview] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generatingFeedback, setGeneratingFeedback] = useState(false);
    const [error, setError] = useState(null);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (id) {
            const fetchInterview = async () => {
                try {
                    setLoading(true);
                    const interviewData = await getInterviewById(id);
                    setInterview(interviewData);
                } catch (err) {
                    console.error("Error fetching interview:", err);
                    setError("Failed to load interview data");
                } finally {
                    setLoading(false);
                }
            };
            fetchInterview();
        }
    }, [id]);

    useEffect(() => {
        if (interview && !feedback) {
            generateFeedback();
        }
    }, [interview]);

    const generateFeedback = async () => {
        if (!interview) return;

        // Get transcript from sessionStorage
        const transcriptData = sessionStorage.getItem(`interview-transcript-${id}`);
        if (!transcriptData) {
            setError("No transcript found. Please complete an interview first.");
            return;
        }

        setGeneratingFeedback(true);
        try {
            const transcript = JSON.parse(transcriptData);
            const feedbackText = await generateInterviewFeedback(transcript, interview);
            setFeedback(feedbackText);
        } catch (error) {
            console.error("Error generating feedback:", error);
            setError("Failed to generate feedback. Please try again.");
        } finally {
            setGeneratingFeedback(false);
        }
    };

    const handleDownloadPDF = () => {
        if (!feedback) return;

        // Create PDF content
        const pdfContent = `
Interview Feedback Report
========================

Interview Details:
- Type: ${interview?.interviewType}
- Tech Stack: ${interview?.techStack?.join(', ')}
- Experience Level: ${interview?.experienceLevel}
- Date: ${new Date().toLocaleDateString()}
- Interview ID: ${id}

${feedback}
        `;

        // Create blob and download
        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `interview-feedback-${id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getInterviewTypeIcon = (type) => {
        switch (type) {
            case 'technical':
                return <Code className="h-5 w-5" />;
            case 'behavioural':
                return <Users className="h-5 w-5" />;
            case 'mixed':
                return <FileText className="h-5 w-5" />;
            default:
                return <FileText className="h-5 w-5" />;
        }
    };

    if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-dark-charcoal">Loading...</div>
    </div>;
    if (!user) return null;
    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-dark-charcoal">Loading interview...</div>
    </div>;
    if (error) return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
    </div>;
    if (!interview) return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-dark-charcoal">Interview not found</div>
    </div>;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="w-full h-16 bg-white border-b border-border px-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => router.push(`/interview/${id}`)}
                        className="flex items-center space-x-2 text-medium-gray hover:text-dark-charcoal transition-colors duration-200"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="font-medium">Back to Interview</span>
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
                            Interview Feedback
                        </h1>
                        <p className="text-medium-gray">
                            Detailed analysis of your interview performance
                        </p>
                    </div>

                    {/* Interview Details Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-border p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    {getInterviewTypeIcon(interview.interviewType)}
                                </div>
                                <div>
                                    <div className="text-sm text-medium-gray">Type</div>
                                    <div className="font-medium text-dark-charcoal capitalize">
                                        {interview.interviewType}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Code className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <div className="text-sm text-medium-gray">Tech Stack</div>
                                    <div className="font-medium text-dark-charcoal">
                                        {interview.techStack?.join(', ')}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-500/10 rounded-lg">
                                    <User className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                    <div className="text-sm text-medium-gray">Experience</div>
                                    <div className="font-medium text-dark-charcoal">
                                        {interview.experienceLevel}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Calendar className="h-5 w-5 text-purple-500" />
                                </div>
                                <div>
                                    <div className="text-sm text-medium-gray">Date</div>
                                    <div className="font-medium text-dark-charcoal">
                                        {interview.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Content */}
                    <div className="bg-white rounded-lg shadow-sm border border-border">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-semibold text-dark-charcoal">
                                Performance Analysis
                            </h2>
                            <button
                                onClick={handleDownloadPDF}
                                className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                            >
                                <Download className="h-4 w-4" />
                                <span>Download Report</span>
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {generatingFeedback ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                        <div className="text-lg font-medium text-dark-charcoal mb-2">
                                            Generating Feedback...
                                        </div>
                                        <div className="text-sm text-medium-gray">
                                            Analyzing your interview performance
                                        </div>
                                    </div>
                                </div>
                            ) : feedback ? (
                                <div className="prose prose-sm max-w-none">
                                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-gray-50 p-6 rounded-lg">
                                        {feedback}
                                    </pre>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <div className="text-lg font-medium text-dark-charcoal mb-2">
                                        No Feedback Available
                                    </div>
                                    <div className="text-sm text-medium-gray">
                                        Complete an interview to generate feedback
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 