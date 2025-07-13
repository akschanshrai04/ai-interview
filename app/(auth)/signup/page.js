"use client";
import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/Authcontext";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isloading, setisLoading] = useState(false);
  const {user , loading} = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setisLoading(false);
    }
  };

  useEffect( () => {
    if(user && !loading) router.push("/home");
  } , [user , loading , router]);

  if(loading){
    return(
        <div className="text-black">
            loading...
        </div>
    )
  }


  if(user) return null;

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 24 }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 8 }}
        />
        <button type="submit" disabled={isloading} style={{ width: "100%" }}>
          {isloading ? "Signing up..." : "Sign Up"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <p style={{ marginTop: 16 }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
