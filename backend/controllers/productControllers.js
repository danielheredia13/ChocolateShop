import asyncHandler from "express-async-handler"
import Product from "../models/productModel.js";


// desc Fetch all products
// route GET /api/products
// access Public

const getProducts =  asyncHandler(async (req, res) => {

    const products = await Product.find()
   
     res.json(products)
})



// desc Fetch one product by id
// route GET /api/products/:id
// access Public

const getProductById =   asyncHandler(async (req, res) => {

  

    const product = await Product.findById(req.params.id)

    if (product) {
        res.json(product)    
    } else {
        res.status(404)
        throw new Error("Product not found")
    }

})

// desc Delete one product by id
// route DELETE /api/products/:id
// access Private/Admin

const deleteProduct =   asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id)

    if (product) {
        product.remove()
        
        res.json({message: "Product Removed"})

    } else {
        res.status(404)
        throw new Error("Product not found")
    }

})

// desc Create a product
// route POST /api/products
// access Private/Admin

const createProduct =  asyncHandler(async (req, res) => {

    const product = new Product({
        user: req.user._id ,
        name: "Sample Name",
        image: "/sample.jpg",
        brand: "Sample Brand",
        category: "Sample Category",
        description: "Sample Description",
        rating: 0,
        numReviews: 0,
        price: 0,
        countInStock: 0,
    })

    const createdProduct = await product.save()
   
     res.status(201).json(createdProduct)

})

// desc Update a product
// route UPDATE /api/products/:id
// access Private/Admin

const updateProduct =  asyncHandler(async (req, res) => {

     const {
        name,
        image,
        brand,
        category,
        description,
        rating,
        numReviews,
        price,
        countInStock,
    } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {

        product.name = name || product.name
        product.image = image || product.image
        product.brand = brand || product.brand
        product.category = category || product.category
        product.description = description || product.description 
        product.rating = rating || product.rating
        product.numReviews = numReviews || product.numReviews
        product.price = price || product.price
        product.countInStock = countInStock || product.countInStock

        const updatedProduct = await product.save()

        res.json(updatedProduct)

    } else {

        res.status(404)
        throw new Error("Product Not Found")
    }
       
        
})

export { getProducts, getProductById, deleteProduct, updateProduct, createProduct }

  