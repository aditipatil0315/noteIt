import React, { useState } from "react";
import './Navbar.css'
// import { useGSAP } from "@gsap/react";
// import gsap from 'gsap';
import { Link } from "react-router-dom";

const Navbar = ({ theme, setTheme }) => {
  const [isSelected, setIsSelected] = useState("");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className={`nav_container ${theme}`}>
      <div className="nav_contents">
        <div className="logo">
          <p>SummarizeIt</p>
        </div>
        <div className="options">
          <ul>
            <li>
              <Link
                to="/"
                onClick={() => setIsSelected("home")}
                className={isSelected === "home" ? "active" : ""}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/room"
                onClick={() => setIsSelected("room")}
                className={isSelected === "room" ? "active" : ""}
              >
                Room
              </Link>
            </li>
            <li>
              <Link
                to="/community"
                onClick={() => setIsSelected("community")}
                className={isSelected === "community" ? "active" : ""}
              >
                Community
              </Link>
            </li>
          </ul>
        </div>
        <div className="side_menu">
          <button className="theme-toggle" onClick={toggleTheme}>
            <i className={`fa-solid ${theme === "light" ? "fa-moon" : "fa-sun"}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
