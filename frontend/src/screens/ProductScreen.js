import React, { useEffect, useState } from 'react'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"
import { detailsProduct } from "../actions/productActions"
import Rating from '../components/Rating';
import Loader from "../components/Loader"
import Message from "../components/Message"

const ProductScreen = () => {

    const [qty, setQty] = useState(1)

    const { id } = useParams();

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const productDetails = useSelector(state => state.productDetails)
    const {loading, product, error} = productDetails


    useEffect(()=> {
        dispatch(detailsProduct(id))
    }, [dispatch, id])

    const addToCartHandler = () => {
      navigate(`/cart/${id}?qty=${qty}`)
    }


  return (
    <>
    {loading ? <Loader /> : error ? <Message variant="danger" text={error} /> : 
    <> 
    <Link className='btn btn-dark my-3 rounded' to="/">Go Back</Link>
    <Row>
        <Col md={6}>
            <Image className='rounded' src={product.image} alt={product.name} fluid />
        </Col>
        <Col md={3}>
            <ListGroup>
                <ListGroup.Item>
                    <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Rating value={product.rating} text={` ${product.numReviews} Reviews`} />
                </ListGroup.Item>
                <ListGroup.Item>
                    Price: ${product.price}
                </ListGroup.Item>
                <ListGroup.Item>
                    Description: {product.description}
                </ListGroup.Item>
            </ListGroup>
        </Col>
        <Col md={3}>
            <Card>
            <ListGroup>
                <ListGroup.Item>
                <Row>
                    <Col>
                        Price:
                    </Col>
                    <Col>
                        ${product.price}
                    </Col>
                </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                <Row>
                    <Col>
                        Status:
                    </Col>
                    <Col>
                        {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                    </Col>
                </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && ( 
                <ListGroup.Item>
                    <Row>
                        <Col>Qty:</Col>
                        <Col>
                            <Form.Select value={qty} onChange={(e) => {
                            setQty(e.target.value) }}>
                               { [...Array(product.countInStock).keys()].map(x => (
                                    <option key={x + 1} value={x + 1}>
                                        {x+ 1}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                </ListGroup.Item>
                )}
                <ListGroup.Item className='d-grid'>
                    <Button className='rounded' variant='dark' type='button' onClick={addToCartHandler} disabled={product.countInStock === 0}>Add to Cart</Button>
                </ListGroup.Item>
            </ListGroup>
            </Card>
        </Col>
    </Row>
    </>
    }
    </>
  )
}

export default ProductScreen