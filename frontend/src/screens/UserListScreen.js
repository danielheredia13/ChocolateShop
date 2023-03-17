import React, { useEffect } from 'react'
import { LinkContainer } from "react-router-bootstrap"
import {Table, Button } from "react-bootstrap"
import Message from "../components/Message"
import Loader from "../components/Loader"
import { deleteUser, getAllUsers } from '../actions/userAccions'
import { useDispatch, useSelector } from 'react-redux'

const UserListScreen = () => {


    const dispatch = useDispatch()

    const usersList = useSelector(state => state.userList)
    const { loading, users, error } = usersList

    const userDelete = useSelector(state => state.userDelete)
    const { success } = userDelete

    useEffect(() => {

        dispatch(getAllUsers())

    },[dispatch, success])


    const deleteUserHandler = (id) => {

        if (window.confirm("Delete user ?")) {
             dispatch(deleteUser(id))
        }
       

    }

  return (
    <>
        <h2>Users</h2>
        { loading ? <Loader /> : error ? <Message variant="danger" text={error} />
        : (
             <Table striped bordered hover responsive className='table-sm'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Admin</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                { users && users.map( user => (
                    <tr key={user._id} >
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.isAdmin ? <i className='fas fa-check' style={{color: "green"}}></i>
                            : <i className='fas fa-times' style={{color: "red"}}></i>}</td>
                        <td>
                            <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                <Button className='btn btn-sm' variant='light'>
                                    <i className='fas fa-edit'></i>
                                </Button>
                            </LinkContainer>
                            <Button onClick={() => deleteUserHandler(user._id)} className='btn btn-sm' variant='danger'>
                                <i className='fas fa-trash'></i>
                            </Button>
                        </td>
                    </tr>
                )) }
            </tbody>
        </Table>
        ) }
       
    </>
  )
}

export default UserListScreen