import React from "react";
import LogoPanel from "../components/auth/LogoPanel";
import AuthForm from "../components/auth/AuthForm";

const AuthPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <LogoPanel />
      <AuthForm />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)", // Creates two equal columns
    height: "100vh", // Takes up the full viewport height
    width: "100vw", // Takes up the full viewport width
  },
};

export default AuthPage;
