import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const stepBGColor1 = step1 ? "#D1CECD" : "FFF";
  const stepColor1 = step1 ? "#000" : "333333";

  const stepBGColor2 = step2 ? "#D1CECD" : "FFF";
  const stepColor2 = step2 ? "#000" : "333333";

  const stepBGColor3 = step3 ? "#D1CECD" : "FFF";
  const stepColor3 = step3 ? "#000" : "333333";

  const stepBGColor4 = step4 ? "#D1CECD" : "FFF";
  const stepColor4 = step4 ? "#000" : "333333";

  return (
    <Container className="chechout-container">
      <p
        className="checkout-steps rounded"
        style={{ backgroundColor: `${stepBGColor1}`, color: `${stepColor1}` }}
      >
        Sign In
      </p>
      <p
        className="checkout-steps rounded"
        style={{ backgroundColor: `${stepBGColor2}`, color: `${stepColor2}` }}
      >
        Shipping
      </p>
      <p
        className="checkout-steps rounded"
        style={{ backgroundColor: `${stepBGColor3}`, color: `${stepColor3}` }}
      >
        Payment
      </p>
      <p
        className="checkout-steps rounded"
        style={{ backgroundColor: `${stepBGColor4}`, color: `${stepColor4}` }}
      >
        Place Order
      </p>
    </Container>
  );
};

export default CheckoutSteps;
