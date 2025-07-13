"use client"

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/Authcontext";
import { useRouter } from "next/navigation";
import { getInterviewById, markInterviewCompleted } from "@/lib/firestoreHelpers";
import Vapi from "@vapi-ai/web";
import { interviewer } from "@/lib/vapihelper";
import { ArrowLeft, Mic, MicOff, Phone, PhoneOff, MessageSquare, Volume2, VolumeX, Eye } from "lucide-react";

const MOCK_USER_PFP = "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&size=200";
const MOCK_AI_PFP = "https://ui-avatars.com/api/?name=AI&background=1976d2&color=fff&size=200";

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);

export default function InterviewPage() {
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { id } = useParams();

    // Vapi state
    const [callStatus, setCallStatus] = useState("INACTIVE"); // INACTIVE | CONNECTING | ACTIVE | FINISHED
    const [messages, setMessages] = useState([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [lastMessage, setLastMessage] = useState("");
    const [isUserSpeaking, setIsUserSpeaking] = useState(false);

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

    // Vapi event handlers
    useEffect(() => {
        const onCallStart = () => setCallStatus("ACTIVE");
        const onCallEnd = () => {
            setCallStatus("FINISHED");
            if (id) markInterviewCompleted(id);
        };
        const onMessage = (message) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                setMessages((prev) => [...prev, { role: message.role, content: message.transcript }]);
                // Set speaking state based on who is talking
                if (message.role === 'user') {
                    setIsUserSpeaking(true);
                    setTimeout(() => setIsUserSpeaking(false), 2000);
                } else {
                    setIsSpeaking(true);
                    setTimeout(() => setIsSpeaking(false), 2000);
                }
            }
        };
        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);
        const onError = (error) => console.log("Vapi error:", error);

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("message", onMessage);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("error", onError);

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("message", onMessage);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("error", onError);
        };
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            setLastMessage(messages[messages.length - 1].content);
        }
    }, [messages]);

    const handleCall = async () => {
        setCallStatus("CONNECTING");
      
        let formattedQuestions = "";
        if (interview?.questions) {
          formattedQuestions = interview.questions.map((q) => `- ${q}`).join("\n");
        }
      
        const updatedInterviewer = {
          ...interviewer,
          model: {
            ...interviewer.model,
            messages: interviewer.model.messages.map((msg) => ({
              ...msg,
              content: msg.content.replace("{{questions}}", formattedQuestions),
            })),
          },
        };
      
        await vapi.start(updatedInterviewer, {
          variableValues: {
            questions: formattedQuestions,
            username: user?.displayName || "User",
            userid: user?.uid || "",
          },
        });
    };

    const handleDisconnect = () => {
        setCallStatus("FINISHED");
        vapi.stop();
    };

    const handleViewFeedback = () => {
        if (messages.length === 0) {
            alert("No transcript available to generate feedback from.");
            return;
        }

        // Store transcript in sessionStorage and redirect to feedback page
        sessionStorage.setItem(`interview-transcript-${id}`, JSON.stringify(messages));
        router.push(`/interview/${id}/feedback`);
    };

    // Group consecutive messages from the same role for transcript display
    function getGroupedMessages(messages) {
        if (!messages.length) return [];
        const grouped = [];
        let last = null;
        messages.forEach((msg) => {
            if (
                last &&
                msg.role === last.role &&
                msg.role === 'assistant'
            ) {
                last.content += ' ' + msg.content;
            } else {
                grouped.push({ ...msg });
                last = grouped[grouped.length - 1];
            }
        });
        return grouped;
    }
    const groupedMessages = getGroupedMessages(messages);

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

            {/* Main Interview Interface */}
            <main className="flex-1 flex flex-col">
                {/* Video Call Area */}
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-6xl">
                        {/* Call Status */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-sm border border-border">
                                <div className={`w-3 h-3 rounded-full ${
                                    callStatus === 'ACTIVE' ? 'bg-green-500 animate-pulse' :
                                    callStatus === 'CONNECTING' ? 'bg-yellow-500 animate-pulse' :
                                    callStatus === 'FINISHED' ? 'bg-red-500' : 'bg-blue-500'
                                }`}></div>
                                <span className="text-sm font-medium text-dark-charcoal">
                                    {callStatus === 'ACTIVE' ? 'Connected' :
                                     callStatus === 'CONNECTING' ? 'Connecting...' :
                                     callStatus === 'FINISHED' ? 'Call Ended' : 'Ready to Start'}
                                </span>
                            </div>
                        </div>

                        {/* Video Participants */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* User */}
                            <div className="relative">
                                <div className={`relative bg-white rounded-2xl shadow-lg border-4 transition-all duration-300 ${
                                    isUserSpeaking 
                                        ? 'border-green-500 shadow-green-500/20' 
                                        : 'border-gray-200'
                                }`}>
                                    <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                        <img 
                                            src={MOCK_USER_PFP} 
                                            alt="User" 
                                            className="w-32 h-32 rounded-full object-cover"
                                        />
                                    </div>
                                    
                                    {/* Speaking Indicator */}
                                    {isUserSpeaking && (
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                                            <Mic className="h-4 w-4 text-white" />
                                        </div>
                                    )}
                                    
                                    {/* User Label */}
                                    <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        You
                                    </div>
                                </div>
                            </div>

                            {/* AI Interviewer */}
                            <div className="relative">
                                <div className={`relative bg-white rounded-2xl shadow-lg border-4 transition-all duration-300 ${
                                    isSpeaking 
                                        ? 'border-green-500 shadow-green-500/20' 
                                        : 'border-gray-200'
                                }`}>
                                    <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
                                        <img 
                                            src={MOCK_AI_PFP} 
                                            alt="AI Interviewer" 
                                            className="w-32 h-32 rounded-full object-cover"
                                        />
                                    </div>
                                    
                                    {/* Speaking Indicator */}
                                    {isSpeaking && (
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                                            <Volume2 className="h-4 w-4 text-white" />
                                        </div>
                                    )}
                                    
                                    {/* AI Label */}
                                    <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        AI Interviewer
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Call Controls */}
                        <div className="flex justify-center space-x-4">
                            {callStatus === 'INACTIVE' && (
                                <button
                                    onClick={handleCall}
                                    className="flex items-center space-x-2 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <Phone className="h-5 w-5" />
                                    <span>Start Interview</span>
                                </button>
                            )}
                            
                            {callStatus === 'CONNECTING' && (
                                <button
                                    disabled
                                    className="flex items-center space-x-3 bg-gray-400 text-white px-8 py-3 rounded-full font-semibold cursor-not-allowed"
                                >
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Connecting...</span>
                                </button>
                            )}
                            
                            {callStatus === 'ACTIVE' && (
                                <button
                                    onClick={handleDisconnect}
                                    className="flex items-center space-x-2 bg-red-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <PhoneOff className="h-5 w-5" />
                                    <span>End Interview</span>
                                </button>
                            )}
                        </div>

                        {/* Feedback Button - Show after interview ends */}
                        {callStatus === 'FINISHED' && messages.length > 0 && (
                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={handleViewFeedback}
                                    className="flex items-center space-x-2 bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <Eye className="h-5 w-5" />
                                    <span>View Feedback</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Transcript Area */}
                <div className="bg-white border-t border-border p-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center space-x-2 mb-4">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold text-dark-charcoal">Live Transcript</h3>
                            {messages.length > 0 && (
                                <span className="text-xs text-medium-gray bg-gray-100 px-2 py-1 rounded">
                                    {messages.length} messages
                                </span>
                            )}
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                            {groupedMessages.length === 0 ? (
                                <div className="text-medium-gray text-center py-8">
                                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">Transcript will appear here once the interview starts...</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {groupedMessages.map((msg, i) => (
                                        <div key={i} className={`flex space-x-3 ${
                                            msg.role === 'user' ? 'justify-end' : 'justify-start'
                                        }`}>
                                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                msg.role === 'user' 
                                                    ? 'bg-primary text-white' 
                                                    : 'bg-white text-dark-charcoal border border-gray-200'
                                            }`}>
                                                <div className="text-xs font-medium mb-1 opacity-75">
                                                    {msg.role === 'user' ? 'You' : 'AI Interviewer'}
                                                </div>
                                                <div className="text-sm">{msg.content}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
