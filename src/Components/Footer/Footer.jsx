import React from "react";
import "./Footer.css"; 

const Footer = ({ theme }) => {
  return (
    <footer className={`app-footer ${theme}`}>
      <p>&copy; 2024 NoteIt. All rights reserved.</p>
      <div className="footer-links">
        <p>Privacy Policy</p> 
        <p>Terms of Service</p> 
        <p>Contact Us</p>
      </div>
    </footer>
  );
};

export default Footer;