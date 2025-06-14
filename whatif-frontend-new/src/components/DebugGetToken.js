import React from 'react';
import { getAuth } from "firebase/auth";

function DebugGetToken() {
  const handleGetToken = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      
      const token = await user.getIdToken(true);
      console.log("✅ Your fresh ID Token:", token);
    } else {
      console.log("❌ No user signed in");
    }
  };

  return <button onClick={handleGetToken}>Get Fresh ID Token</button>;
}

export default DebugGetToken;

