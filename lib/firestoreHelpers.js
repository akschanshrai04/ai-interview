import { addDoc, collection, serverTimestamp, doc, getDoc, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function createInterview({ userId, formData, questions }) {
  try {
    const docRef = await addDoc(collection(db, "interviews"), {
      userId,
      createdAt: serverTimestamp(),
      interviewType: formData.interviewType,
      techStack: formData.techStack,
      experienceLevel: formData.experienceLevel,
      questionCount: formData.questionCount,
      questions,
      status: 'incomplete', // Set status as incomplete on creation
    });

    return docRef.id;
  } catch (err) {
    console.error("Error creating interview:", err);
    throw err;
  }
}

export async function getInterviewById(interviewId) {
  try {
    const ref = doc(db, "interviews", interviewId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      throw new Error("Interview not found");
    }

    return { id: snap.id, ...snap.data() };
  } catch (err) {
    console.error("Failed to fetch interview:", err);
    throw err;
  }
}

export async function getInterviewsByUserId(userId) {
  try {
    const q = query(collection(db, "interviews"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const interviews = [];
    querySnapshot.forEach((doc) => {
      interviews.push({ id: doc.id, ...doc.data() });
    });
    return interviews;
  } catch (err) {
    console.error("Failed to fetch interviews by userId:", err);
    throw err;
  }
}

export async function markInterviewCompleted(interviewId) {
  try {
    const ref = doc(db, "interviews", interviewId);
    await updateDoc(ref, { status: 'completed' });
  } catch (err) {
    console.error("Failed to mark interview as completed:", err);
    throw err;
  }
}
