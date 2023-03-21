import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Form, Col, Row, Button } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getUserDetails, updateUserProfile } from "../actions/userAccions";
import { useDispatch, useSelector } from "react-redux";
import { myListOrders } from "../actions/orderActions";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [list, setList] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderMyList = useSelector((state) => state.orderMyList);
  const {
    loading: listLoading,
    success,
    orders,
    error: listError,
  } = orderMyList;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!user) {
        dispatch(getUserDetails());
      } else if (user) {
        user && setName(user.name);
        user && setEmail(user.email);
      }
    }
    if (orders) {
      setList(orders);
    }
  }, [user, userInfo, orders]);

  const viewOrdersHandler = () => {
    if (!success) {
      dispatch(myListOrders());
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(
        updateUserProfile({
          id: user._id,
          name: name,
          email: email,
          password: password,
        })
      );
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>Profile</h2>
        {message && <Message variant="danger" text={message} />}
        {error && <Message variant="danger" text={error} />}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              className="rounded"
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              className="rounded"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Pasword</Form.Label>
            <Form.Control
              className="rounded"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Pasword</Form.Label>
            <Form.Control
              className="rounded"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" className="my-3 rounded" variant="primary">
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2> My Orders</h2>
        {listLoading && <Loader />}
        {listError && <Message variant="danger" text={listError} />}
        <Button
          onClick={viewOrdersHandler}
          className="btn btn-sm rounded mb-3"
          variant="info"
        >
          View Orders
        </Button>
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list &&
              list.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className="btn-sm" variant="light">
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default ProfileScreen;

/*

why is myListOrders action making the profile screen rerender ?

this is the profile screen

import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { LinkContainer } from "react-router-bootstrap"
import {Table, Form, Col, Row, Button } from "react-bootstrap"
import Message from "../components/Message"
import Loader from "../components/Loader"
import { getUserDetails, updateUserProfile } from '../actions/userAccions'
import { useDispatch, useSelector } from 'react-redux'
import { myListOrders } from '../actions/orderActions'


const ProfileScreen = () => {

    const [name, setName] =useState("")
    const [email, setEmail] =useState("")
    const [password, setPassword] =useState("")
    const [confirmPassword, setConfirmPassword] =useState("")
    const [ message, setMessage] = useState("")

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const orderMyList = useSelector(state => state.orderMyList)
    const { loading: listLoading, success, orders, error: listError } = orderMyList


    useEffect(() => {
       
    
        if(!userInfo){  
            navigate("/login")
        } else {
            if(!user) {
                dispatch(getUserDetails())
          
            } else if (user) {
               user && setName(user.name)
               user && setEmail(user.email)
            }
        }
    },[user, userInfo, dispatch, navigate])

    useEffect(() => {
        if (!orders) {
             dispatch(myListOrders())
        }
             
    }, [orders, dispatch, myListOrders])

    const submitHandler = (e) => {
          e.preventDefault()

        if (password !== confirmPassword) {
         
            setMessage("Passwords do not match")

        } else {
            dispatch(updateUserProfile({ id: user._id, name: name, email: email, password: password }))
           
        }

     
    }

this is the order action

export const myListOrders = () => async (dispatch, getState) => {

    try {
        
        dispatch({type: ORDER_MY_LIST_REQUEST})

        const userInfo = getState().userLogin.userInfo
       

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios(`/api/orders/myorders`, config)
        dispatch({
            type: ORDER_MY_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ORDER_MY_LIST_FAIL,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}


this is the order reducer

export const orderMyListReducer = (state = {success: false, orders: []}, action ) => {

    switch (action.type) {
        case ORDER_MY_LIST_REQUEST:
            return {loading: true }
        
        case ORDER_MY_LIST_SUCCESS:
            return { loading: false, success: true, orders: action.payload }
    
        case ORDER_MY_LIST_FAIL:
            return { loading: false, error: action.payload }

        default:
            return { state }
    }



}




    */
