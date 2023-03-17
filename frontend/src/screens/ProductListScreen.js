import React, { useEffect } from 'react'
import { LinkContainer } from "react-router-bootstrap"
import {Table, Button, Row, Col } from "react-bootstrap"
import Message from "../components/Message"
import Loader from "../components/Loader"
import { deleteProduct, listProducts, createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom"

const ProductListScreen = () => {


    const dispatch = useDispatch()
    const navigate = useNavigate()

     const userLogin = useSelector(state => state.userLogin)
     const { userInfo } = userLogin

    const productList = useSelector(state => state.productList)
    const { loading, products, error } = productList

    const productDelete = useSelector(state => state.productDelete)
    const { loading: loadingDelete, success, error: errorDelete } = productDelete

     const productCreate = useSelector(state => state.productCreate)
    const { loading: loadingCreate, createdProduct, error: errorCreate } = productCreate


    useEffect(() => {

        dispatch({type: PRODUCT_CREATE_RESET})

        if (userInfo && !userInfo.isAdmin) {
            navigate("/login")
        }

        if (createdProduct) {
            navigate(`/admin/product/${createdProduct._id}/edit`)
        } else {

               dispatch(listProducts())

        }

    },[success, createdProduct, userInfo])


    const deleteProductHandler = (id) => {

        if (window.confirm("Delete Product ?")) {
            dispatch(deleteProduct(id))
        }
    }

    const createProductHandler = () => {

        dispatch(createProduct())

    }

  return (
    <>
        <Row className='align-items-center'>
            <Col><h2>Products</h2></Col>
            <Col className='end-right'>
                <Button className='btn rounded mb-3' onClick={() => createProductHandler()}>
                    <i className='fas fa-plus'></i> Create Product
                </Button>
            </Col>
        </Row>
        { loading ? <Loader /> : error ? <Message variant="danger" text={error} />
        : (
             <Table striped bordered hover responsive className='table-sm'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                { products && products.map( product => (
                    <tr key={product._id} >
                        <td>{product._id}</td>
                        <td>{product.name}</td>
                        <td>$ {product.price}</td>
                        <td>{product.categpry}</td>
                        <td>{product.brand}</td>
                        <td>
                            <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                <Button className='btn btn-sm' variant='light'>
                                    <i className='fas fa-edit'></i>
                                </Button>
                            </LinkContainer>
                            <Button onClick={() => deleteProductHandler(product._id)} className='btn btn-sm' variant='danger'>
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

export default ProductListScreen