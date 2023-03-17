import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom"
import { Form, Button } from "react-bootstrap"
import Message from "../components/Message"
import Loader from "../components/Loader"
import FormContainer from '../components/FormContainer'
import { getUserDetailsById, updateUserDetailsById } from '../actions/userAccions'
import { useDispatch, useSelector } from 'react-redux'


const UserEditScreen = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams()

    const [name, setName] =useState("")
    const [email, setEmail] =useState("")
    const [isAdmin, setIsAdmin] =useState(false)



    const userDetailsById = useSelector(state => state.userDetailsById)
    const { loading, error, userInfo } = userDetailsById

    const userUpdateById = useSelector(state => state.userUpdateById)
    const { loading: updatedLoading, user, error: updatedError } = userUpdateById

    useEffect(() => {

        if(userInfo && userInfo.name ||userInfo && userInfo._id !== id){
           userInfo && setName(userInfo.name)
           userInfo && setEmail(userInfo.email)
        } else {
           
           dispatch(getUserDetailsById(id))
        }


    },[userInfo, id, user])

    const updateHandler = (e) => {

        const user = {
            name: name,
            email: email,
            isAdmin: isAdmin
        }

           dispatch(updateUserDetailsById(userInfo._id, user))

        e.preventDefault()
    }

  return (
    <FormContainer>
        <h2>Edit User</h2>
        <Link to="/admin/userlist" className='btn btn-sm btn-dark mb-3 rounded' >Go Back</Link>
        { error && <Message variant="danger" text={error} /> }
        { loading && <Loader /> }
        <Form onSubmit={updateHandler}>
            <Form.Group  controlId='name'>
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                className='rounded'
                type="text"
                placeholder='Enter Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                ></Form.Control>
            </Form.Group>
            <Form.Group  controlId='email'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                className='rounded'
                type="email"
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
            </Form.Group>
            <Form.Group  controlId='isAdmin'>
                <Form.Check
                className='rounded'
                type="checkbox"
                label='Is Admin'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                ></Form.Check>
            </Form.Group>
            <Button type='submit' className='my-3 rounded' variant='primary'>Update</Button>
        </Form>
    </FormContainer>
  )
}

export default UserEditScreen