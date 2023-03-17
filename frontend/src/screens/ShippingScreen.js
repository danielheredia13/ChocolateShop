import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { saveShippingAddress } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'

const ShippingScreen = () => {
const shippingAddress = useSelector(state => state.cart.shippingAddress)

const dispatch = useDispatch()
const navigate = useNavigate()

const [ address, setAddress ] = useState(shippingAddress ? shippingAddress.address : "")
const [ city, setCity ] = useState(shippingAddress ? shippingAddress.city : "")
const [ postalCode, setPostalCode ] = useState(shippingAddress ? shippingAddress.postalCode : "")
const [ country, setCountry ] = useState(shippingAddress ? shippingAddress.country : "")


    const submitHandler = (e) => {

         e.preventDefault()

        dispatch(saveShippingAddress({address,city,postalCode,country}))

        navigate("/payment")

       
    }


  return (
    <>
    <CheckoutSteps step1={true} step2={true} step3={false} step4={false} />
    <FormContainer>
        <h2>Shipping</h2>
        <Form onSubmit={submitHandler}>
            <Form.Group controlId='address'>
                <Form.Label className='mb-1'>Address</Form.Label>
                <Form.Control
                className=''
                type='text'
                value={address}
                placeholder="Address"
                onChange={e => setAddress(e.target.value)}
                required
                ></Form.Control>
            </Form.Group>
            <Form.Group controlId='city'>
                <Form.Label className='mb-1 mt-2'>City</Form.Label>
                <Form.Control
                className=''
                type='text'
                value={city}
                placeholder="City"
                onChange={e => setCity(e.target.value)}
                required
                ></Form.Control>
            </Form.Group>
            <Form.Group controlId='postalCode'>
                <Form.Label className='mb-1 mt-2'>Enter Postal Code</Form.Label>
                <Form.Control
                className=''
                type='text'
                value={postalCode}
                placeholder="Postal Code"
                onChange={e => setPostalCode(e.target.value)}
                required
                ></Form.Control>
            </Form.Group>
            <Form.Group controlId='country'>
                <Form.Label className='mb-1 mt-2'>Enter Country</Form.Label>
                <Form.Control
                className=''
                type='text'
                value={country}
                placeholder="Country"
                onChange={e => setCountry(e.target.value)}
                required
                ></Form.Control>
            </Form.Group>
            <Button type='submit' variant='primary' className='rounded my-3'>Continue</Button>
        </Form>
    </FormContainer>
    </>
  )
}

export default ShippingScreen