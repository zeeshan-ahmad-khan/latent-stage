import React from "react";
import LogoPanel from "../components/auth/LogoPanel";
import AuthForm from "../components/auth/AuthForm";

const AuthPage: React.FC = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        height: "100vh",
      }}
    >
      <LogoPanel />
      <AuthForm />
    </div>
  );
};

export default AuthPage;
