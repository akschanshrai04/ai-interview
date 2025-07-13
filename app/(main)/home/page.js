"use client";

import { useAuth } from "@/context/Authcontext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getInterviewsByUserId } from "@/lib/firestoreHelpers";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Mic2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [interviews, setInterviews] = useState([]);
  const [interviewsLoading, setInterviewsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchInterviews() {
      if (user?.uid) {
        setInterviewsLoading(true);
        try {
          const data = await getInterviewsByUserId(user.uid);
          setInterviews(data);
        } catch {
          setInterviews([]);
        } finally {
          setInterviewsLoading(false);
        }
      }
    }
    fetchInterviews();
  }, [user]);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] text-[#e0e0e0]">
        <Loader2 className="animate-spin h-8 w-8 text-[#60a5fa]" />
        <span className="ml-3 text-lg font-semibold">Loading...</span>
      </div>
    );

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleMakeInterview = () => {
    router.push("/make-interview");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#0f0f0f] p-6 md:p-12 text-[#e0e0e0] flex flex-col"
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-12 px-6 py-4 bg-[#1f1f1f] rounded-lg shadow-md border border-[#3f3f3f]">
        <h1 className="text-3xl font-extrabold tracking-tight">AI Interview Dashboard</h1>
        <div className="flex items-center space-x-6">
          <span className="text-[#a0a0a0] font-medium truncate max-w-xs md:max-w-sm">
            Welcome, {user.email}
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto flex-1 flex flex-col gap-12">
        {/* Make Interview Section */}
        <Card className="bg-[#2a2a2a] rounded-xl shadow-lg p-10 text-center">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold text-[#7dd3fc] mb-4">
              Ready for Your Next Interview?
            </CardTitle>
            <CardDescription className="text-[#a0a0a0] max-w-xl mx-auto text-lg">
              Practice with our AI-powered mock interviews. Get real-time feedback and improve your skills.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="lg"
              className="mt-8 bg-[#60a5fa] hover:bg-[#3b82f6] shadow-md shadow-[#60a5fa]/40 transition-transform transform hover:-translate-y-1"
              onClick={handleMakeInterview}
            >
              <Mic2 className="mr-2 h-5 w-5" />
              Start New Interview
            </Button>
          </CardContent>
        </Card>

        {/* Past Interviews Section */}
        <section>
          <h2 className="text-2xl font-bold mb-8 border-b border-[#3f3f3f] pb-3">Your Interview History</h2>

          {interviewsLoading ? (
            <div className="flex justify-center py-16 text-[#7a7a7a] text-lg font-medium">
              Loading interviews...
            </div>
          ) : interviews.length === 0 ? (
            <div className="flex justify-center py-16 text-[#7a7a7a] text-lg font-medium">
              No interviews found. Start your first interview!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {interviews.map((interview) => (
                <Card
                  key={interview.id}
                  className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-lg shadow-md p-6 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-[#7dd3fc] truncate">
                      {interview.interviewType || "Interview"}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        interview.status === "Completed"
                          ? "bg-green-600 text-white"
                          : "bg-yellow-600 text-white"
                      }`}
                    >
                      {interview.status || "Incomplete"}
                    </span>
                  </div>
                  <p className="text-[#a0a0a0] mb-4 truncate">
                    {Array.isArray(interview.techStack)
                      ? interview.techStack.join(", ")
                      : interview.techStack || "No tech stack info"}
                  </p>
                  <div className="flex justify-between text-[#7a7a7a] text-sm font-medium">
                    <span>Questions: {interview.questionCount || 0}</span>
                    <span>
                      {interview.createdAt?.toDate
                        ? interview.createdAt.toDate().toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </motion.div>
  );
}
