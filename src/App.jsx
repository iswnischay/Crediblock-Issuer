import { HashRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Issuer from "./Issuer";
import Home from "./Home";
import Login from "./Login"; // Import the Login component
import { auth } from "./firebase"; // Import the auth instance
import "./App.css";

const App = () => {
  const [theme, setTheme] = useState("light");
  const [user, setUser ] = useState(null);

  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    const htmlElement = document.getElementById("root-html");
    htmlElement.setAttribute("data-bs-theme", newTheme);
  };

  // Effect to load theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.getElementById("root-html").setAttribute("data-bs-theme", savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.getElementById("root-html").setAttribute("data-bs-theme", initialTheme);
    }
  }, []);

  // Apply the theme class to the body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser (user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="container">
        <nav className="fixed-top">
          <Link className="ref" to="/">Home</Link>
          {user && <Link className="ref" to="/issuer">Issuer</Link>} {/* Conditionally render Issuer link */}

          <button onClick={toggleTheme} className="theme-toggle">
            {theme === "light" ? (
              <i className="bi bi-moon-fill"></i>
            ) : (
              <i className="bi bi-sun-fill"></i>
            )}
          </button>
        </nav>

        <Routes>
          <Route path="/issuer" element={user ? <Issuer user={user} /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;