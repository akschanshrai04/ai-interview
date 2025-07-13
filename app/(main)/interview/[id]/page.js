"use client"

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/Authcontext";
import { useRouter } from "next/navigation";
import { getInterviewById, markInterviewCompleted } from "@/lib/firestoreHelpers";
import Vapi from "@vapi-ai/web";
import { interviewer } from "@/lib/vapihelper";
import Image from "next/image";

const MOCK_USER_PFP = "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff";
const MOCK_AI_PFP = "https://ui-avatars.com/api/?name=AI&background=1976d2&color=fff";

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
      
        // 🔧 Replace {{questions}} in system prompt before passing to Vapi
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

    if (authLoading) return <div className="bg-white text-black">Loading...</div>;
    if (!user) return null;
    if (loading) return <div>Loading interview...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!interview) return <div>Interview not found</div>;

    // Modern, clean UI
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 36, minWidth: 350, maxWidth: 420, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1976d2', marginBottom: 12 }}>AI Interview Session</h2>
                <div style={{ marginBottom: 18, fontSize: 16, color: '#666', fontWeight: 500 }}>
                    Status: <span style={{ color: callStatus === 'ACTIVE' ? '#388e3c' : callStatus === 'CONNECTING' ? '#fbc02d' : callStatus === 'FINISHED' ? '#d32f2f' : '#1976d2', fontWeight: 700 }}>{callStatus}</span>
                </div>
                <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                    <button
                        onClick={handleCall}
                        disabled={callStatus === 'ACTIVE' || callStatus === 'CONNECTING'}
                        style={{
                            padding: '10px 28px',
                            background: callStatus === 'ACTIVE' || callStatus === 'CONNECTING' ? '#bdbdbd' : '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: 8,
                            fontSize: 16,
                            fontWeight: 600,
                            cursor: callStatus === 'ACTIVE' || callStatus === 'CONNECTING' ? 'not-allowed' : 'pointer',
                            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
                            transition: 'background 0.2s',
                        }}
                    >
                        {callStatus === 'CONNECTING' ? 'Connecting...' : 'Start Interview'}
                    </button>
                    {callStatus === 'ACTIVE' && (
                <button 
                            onClick={handleDisconnect}
                    style={{ 
                                padding: '10px 28px',
                                background: '#d32f2f',
                        color: 'white', 
                        border: 'none', 
                                borderRadius: 8,
                                fontSize: 16,
                                fontWeight: 600,
                        cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(211, 47, 47, 0.08)',
                                transition: 'background 0.2s',
                    }}
                >
                            End Interview
                </button>
                    )}
            </div>
                <div style={{ width: '100%', marginBottom: 12 }}>
                    <h4 style={{ fontSize: 18, fontWeight: 600, color: '#1976d2', marginBottom: 8 }}>Transcript</h4>
                <div style={{ 
                        minHeight: 80,
                        maxHeight: 220,
                        overflowY: 'auto',
                        background: '#f5f5f5',
                        borderRadius: 8,
                        padding: 12,
                        border: '1px solid #e3e3e3',
                        fontSize: 15,
                        color: '#333',
                    }}>
                        {groupedMessages.length === 0 ? (
                            <div style={{ color: '#aaa', fontStyle: 'italic' }}>Transcript will appear here...</div>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {groupedMessages.map((msg, i) => (
                                    <li key={i} style={{ marginBottom: 8 }}>
                                        <span style={{ fontWeight: 600, color: msg.role === 'user' ? '#1976d2' : msg.role === 'assistant' ? '#388e3c' : '#888' }}>{msg.role}:</span> {msg.content}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                {callStatus === 'FINISHED' && (
                    <div style={{ marginTop: 16, color: '#388e3c', fontSize: 15, fontWeight: 500, textAlign: 'center' }}>
                        Thank you for participating! You may close this window.
                    </div>
                )}
            </div>
        </div>
    );
}
