import React from "react";
import "./cancel.css"; // Import the CSS file
import { NavLink } from "react-router-dom";

const Cancel = () => {
  return (
    <div className="cancel-container">
      <div className="cancel-content">
        <h1>Payment Cancelled</h1>
        <p>Reasons may be one of the Following:</p>
        <ul>
          <li>Unstable Internet Connection</li>
          <li>You Cancelled Your Payment</li>
          <li>Wrong Credentials</li>
          <li>Insufficient Balance in your account</li>
        </ul>
        <button type="button">
          <NavLink to="/">Go to Home</NavLink>
        </button>
      </div>
      <div className="cancel-image">
        <img
          src="https://msipatna.com/images/Payment-cancelled.png"
          alt="cancel payment"
        />
      </div>
    </div>
  );
};

export default Cancel;
