import React from "react";
import "./success.css";
import { NavLink } from "react-router-dom";

const Success = () => {
  return (
    <div className="payment-successful">
      <div className="success-message">
        <h2>You Almost there!</h2>
        <h3>Payment Successful</h3>
        <p>
          Thank you for choosing DevCart. Your custom reports will be generated
          within two business days.
        </p>
        <img src="/productDelivery.png" alt="product Delivery" />
        <button type="button">
          <NavLink to="/">Go to Home</NavLink>
        </button>
      </div>
      <div className="success-image">
        <img src="/successCelebration.png" alt="Success celebration" />
      </div>
    </div>
  );
};

export default Success;
