import "./AuthDrawer.css";
import { useEffect, useState } from "react";

import RegisterForm from "../Auth/RegisterForm";
import LoginForm from "../Auth/LoginForm";

function AuthDrawer({ isOpen, onClose, defaultView = "register" }) {
  const [isLogin, setIsLogin] = useState(defaultView === "login");

  useEffect(() => {
    setIsLogin(defaultView === "login");
  }, [defaultView]);

  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      ></div>

      <div className={`auth-drawer ${isOpen ? "open" : ""}`}>
        <button
          className="close-btn"
          onClick={onClose}
        >
          ✕
        </button>

        {isLogin ? (
          <LoginForm
            switchToRegister={() => setIsLogin(false)} 
            onLoginSuccess={onClose}
          />
        ) : (
          <RegisterForm switchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </>
  );
}

export default AuthDrawer;