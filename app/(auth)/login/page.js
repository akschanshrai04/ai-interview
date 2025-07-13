"use client";
import { useState , useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/Authcontext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isloading, setisLoading] = useState(false);
  const router = useRouter();
  const {user , loading} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
      <h2>Login</h2>
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
        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <p style={{ marginTop: 16 }}>
        Don&#39;t have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}
