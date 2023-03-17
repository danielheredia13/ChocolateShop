import React, { useEffect} from 'react'
import { useNavigate } from "react-router-dom"
import {Col, Row, Button, ListGroup, Card, Image } from "react-bootstrap"
import Message from "../components/Message"
import { useDispatch, useSelector } from 'react-redux'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder, getOrderDetails } from '../actions/orderActions'

const PlaceOrderScreen = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const cart = useSelector(state => state.cart)
    const cartItems = useSelector(state => state.cart.cartItems)
    const shippingAddress = useSelector(state => state.cart.shippingAddress)
    const paymentMethod = useSelector( state => state.cart.paymentMethod)
    const orderCreate = useSelector( state => state.orderCreate)
    const { loading, success, order } = orderCreate

    useEffect(() => {

        if (success) {

             dispatch(getOrderDetails(order._id))

            navigate(`/order/${order._id}`)
        }
        // eslint-disable-next-line
    },[success])


    const addDesimals = (num) => {
     return(Math.round(num * 100) / 100).toFixed(2)

    }

    cart.itemsPrice =addDesimals(Number(cartItems.reduce((acc,cur) => acc + cur.qty * cur.price, 0)))
    cart.shippingPrice =addDesimals(Number(cart.itemsPrice > 100 ? 0 : cart.itemsPrice * 0.15))
    cart.taxPrice =addDesimals(Number(cart.itemsPrice * 0.16))
    cart.totalPrice = addDesimals(Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice))



    const placeOrderHandler = () => {

        dispatch(createOrder({ 
            orderItems: cartItems,
            shippingAddress,
            paymentMethod,
            itemsPrice:cart.itemsPrice,
            taxPrice: cart.taxPrice,
            shippingPrice: cart.shippingPrice,
            totalPrice: cart.totalPrice }))

    }
 

  return (
    <>
        <CheckoutSteps step1={true} step2={true} step3={true} step4={true} />
        <Row>
        <Col md={8}>
        <ListGroup variant='flush'>
            <ListGroup.Item>
                <h4>Shipping</h4>
                <p>
                    <strong>Address: </strong>
                    {shippingAddress && shippingAddress.address}, 
                    {shippingAddress && shippingAddress.city}, 
                    {shippingAddress && shippingAddress.postalCode}, 
                    {shippingAddress && shippingAddress.country}
                </p>
            </ListGroup.Item>
            <ListGroup.Item>
                <h4>Payment Method</h4>
                <strong>Method: </strong>
                { paymentMethod }
            </ListGroup.Item>
            <ListGroup.Item>
                <h4>Order Items</h4>
                { cartItems.lenght === 0 
                ? <Message text="No Items in youe Cart" />
                : ( <ListGroup variant="flush">
                    {cartItems.map((item,index) => (
                        <ListGroup.Item key={index} >
                        <Row>
                            <Col md={2}>
                                <Image src={item.image} alt={item.name} rounded fluid />
                            </Col>
                            <Col md={5}>{item.name}</Col>
                            <Col>{item.qty} x {item.price} = $ {item.qty * item.price}</Col>
                        </Row>
                        </ListGroup.Item>
                    ) )}
                    </ListGroup>
                )}
            </ListGroup.Item>
        </ListGroup>
        </Col>
        <Col md={4}>
            <Card className='order-summary'>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h5>Order Summary</h5>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                Items
                            </Col>
                            <Col>
                                $ {cart.itemsPrice}
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                Shipping
                            </Col>
                            <Col>
                                $ {cart.shippingPrice}
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                Tax
                            </Col>
                            <Col>
                                $ {cart.taxPrice}
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                Total
                            </Col>
                            <Col>
                                $ {cart.totalPrice}
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item className='place-order-button-wrap'>
                        <Button className='rounded' variant='info' type='button' disabled={cartItems === 0} onClick={placeOrderHandler}>Place Order</Button>
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </Col>
        </Row>
    </>
  )
}

export default PlaceOrderScreen