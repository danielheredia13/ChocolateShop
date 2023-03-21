import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, ListGroup, Card, Image, Button } from "react-bootstrap";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from "../constants/orderConstans";

const OrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [paypalClientId, setPaypalClientId] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({});

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, order, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success, error: errorPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    success: successDeliver,
    error: errorDeliver,
  } = orderDeliver;

  let orderItems = [];
  let shippingAddress = {};
  let paymentMethod = "";
  let shippingPrice = 0;
  let taxPrice = 0;
  let totalPrice = 0;

  if (order) {
    orderItems = order.orderItems;
    shippingAddress = order.shippingAddress;
    paymentMethod = order.paymentMethod;
    shippingPrice = order.shippingPrice;
    taxPrice = order.taxPrice;
    totalPrice = order.totalPrice;
  }

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }

    const getpaypalClientId = async () => {
      const { data } = await axios("/api/config/paypal");
      setPaypalClientId(data);
    };

    if (!paypalClientId) {
      getpaypalClientId();
    }

    if (typeof order === "undefined" || success) {
      dispatch(getOrderDetails(id));
    }

    if (successDeliver) {
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(id));
    }

    if (paymentDetails.status === "COMPLETED") {
      successPaymentHandler(paymentDetails);
      dispatch({ type: ORDER_PAY_RESET });
    }
  }, [paypalClientId, paymentDetails, success, successDeliver]);

  const addDesimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  if (order) {
    order.itemsPrice = addDesimals(
      Number(orderItems.reduce((acc, cur) => acc + cur.qty * cur.price, 0))
    );
  }

  const successPaymentHandler = (paymentDetails) => {
    dispatch(payOrder(order && order._id, paymentDetails));
  };

  const deliverHandler = (id) => {
    dispatch(deliverOrder(id));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger" text={error} />
  ) : (
    <>
      <h2>Order {order && order._id}</h2>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h4>Shipping</h4>
              <p>
                <strong>User: </strong>
                {order && order.user.name}
              </p>
              <p>Email: {order && order.user.email}</p>
              <p>
                <strong>Address: </strong>
                {shippingAddress.address},{shippingAddress.city},
                {shippingAddress.postalCode},{shippingAddress.country}
              </p>
              {order && order.isDelivered ? (
                <Message
                  variant="success"
                  text={`Delivered at ${order.deliveredAt}`}
                />
              ) : (
                <Message variant="danger" text="Not Delivered" />
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>Payment Method</h4>
              <p>
                <strong>Method: </strong>
                {paymentMethod}
              </p>
              {order && order.isPaid ? (
                <Message variant="success" text={`Paid at ${order.paidAt}`} />
              ) : (
                <Message variant="danger" text="Not Paid" />
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>Order Items</h4>
              {orderItems.lenght === 0 ? (
                <Message text="No Items in youe Order" />
              ) : (
                <ListGroup variant="flush">
                  {orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            rounded
                            fluid
                          />
                        </Col>
                        <Col md={5}>{item.name}</Col>
                        <Col>
                          {item.qty} x {item.price} = $ {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card className="order-summary">
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h5>Order Summary</h5>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>$ {order && order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>$ {shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>$ {taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>$ {totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {order && !order.isPaid ? (
                <ListGroup.Item>
                  {paypalClientId && (
                    <PayPalScriptProvider
                      options={{ "client-id": `${paypalClientId}` }}
                    >
                      <PayPalButtons
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  value: `${totalPrice}`,
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={(data, actions) => {
                          return actions.order.capture().then((details) => {
                            setPaymentDetails(details);
                          });
                        }}
                      />
                    </PayPalScriptProvider>
                  )}
                </ListGroup.Item>
              ) : null}
              {userInfo &&
                userInfo.isAdmin &&
                order &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      onClick={() => deliverHandler(order._id)}
                      type="button"
                      className="btn rounded"
                      variant="dark"
                    >
                      Set as Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
