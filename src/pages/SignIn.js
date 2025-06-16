import React, { useState, useEffect } from "react";
import { auth } from "../firebase.js";  
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

// Helper function to decode the token
const decodeToken = (token) => {
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload;
  } catch (e) {
    console.error("Could not decode token", e);
    return null;
  }
};

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        
        const idToken = await currentUser.getIdToken(true);
        console.log("✅ Fresh ID Token is:", idToken);
        const decoded = decodeToken(idToken);
        if (decoded) {
          console.warn("PROOF - Token Audience (aud):", decoded.aud);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Sign-in failed:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Signed out successfully!");
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  };

  if (user) {
    return (
      <div>
        <p>Welcome, {user.email}</p>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    );
  } else {
    return (
      <div>
        <h2>Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={handleSignIn}>Sign In</button>
      </div>
    );
  }
};

export default SignIn;
