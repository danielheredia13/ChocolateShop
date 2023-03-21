import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { savePaymentMethod } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";

const PaymentMethodScreen = () => {
  const shippingAddress = useSelector((state) => state.cart.shippingAddress);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [paymentMethod, setpaymentMethod] = useState("Paypal");

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(savePaymentMethod(paymentMethod));

    navigate("/placeorder");
  };

  return (
    <>
      <CheckoutSteps step1={true} step2={true} step3={true} step4={false} />
      <FormContainer>
        <h2>Payment</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="address">
            <Form.Label className="mb-1">Select Method</Form.Label>
            <Form.Check
              type="radio"
              value={paymentMethod}
              label="Paypal or Credit Card"
              onChange={(e) => setpaymentMethod(e.target.value)}
              required
              checked
            ></Form.Check>
          </Form.Group>
          <Button type="submit" variant="primary" className="rounded my-3">
            Continue
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default PaymentMethodScreen;
