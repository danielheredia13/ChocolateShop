import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { detailsProduct, updateProduct } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";

const ProductEditScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState("");

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    success,
    error: errorUpdate,
    product: updatedProduct,
  } = productUpdate;

  useEffect(() => {
    if (success) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate("/admin/productlist");
    } else {
      if (product && product._id !== id) {
        dispatch(detailsProduct(id));
      } else {
        product && setName(product.name);
        product && setImage(product.image);
        product && setBrand(product.brand);
        product && setCategory(product.category);
        product && setDescription(product.description);
        product && setPrice(product.price);
        product && setCountInStock(product.countInStock);
      }
    }
  }, [product, id, updatedProduct, dispatch, navigate, success]);

  const updateHandler = (e) => {
    dispatch(
      updateProduct({
        _id: product._id,
        name: name,
        price: price,
        brand: brand,
        category: category,
        description: description,
        image: image,
        countInStock: countInStock,
      })
    );

    e.preventDefault();
  };

  const uploadHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post("/api/upload", formData, config);

      setImage(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormContainer>
      <h2>Edit Product</h2>
      <Link
        to="/admin/productlist"
        className="btn btn-sm btn-dark mb-3 rounded"
      >
        Go Back
      </Link>
      {error || (errorUpdate && <Message variant="danger" text={error} />)}
      {loading || (loadingUpdate && <Loader />)}
      <Form onSubmit={updateHandler}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            className="rounded"
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            className="rounded"
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="brand">
          <Form.Label>Brand</Form.Label>
          <Form.Control
            className="rounded"
            type="text"
            placeholder="Enter brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            className="rounded"
            type="text"
            placeholder="Enter category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            className="rounded"
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="image">
          <Form.Label>Image</Form.Label>
          <Form.Control
            className="rounded"
            type="text"
            placeholder="Enter image url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          ></Form.Control>
          <Form.Control
            type="file"
            id="image-file"
            label="Choose File"
            custom
            onChange={uploadHandler}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="countInStock">
          <Form.Label>Count In Stock</Form.Label>
          <Form.Control
            className="rounded"
            type="text"
            placeholder="Enter count in stock"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" className="my-3 rounded" variant="primary">
          Update
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ProductEditScreen;
