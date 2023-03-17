import mongoose from 'mongoose'
import asyncHandler from "express-async-handler"
import Order from "../models/orderModel.js";

// desc Add new order
// route POST /api/order
// access Private

const addOrderItems = asyncHandler( async (req, res) => {

    const { 
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
     } = req.body

     if (orderItems && orderItems.lenght === 0) {
        
        res.status(400)
        throw new Error("No order items")
        
     } else {

         const order = await new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
         })

         const newOrder = await order.save()

         res.status(201).json(newOrder)

     }

    

})


// desc Get order by ID
// route GET /api/orders/:id
// access Private

const getOrderById = asyncHandler( async (req, res) => {

   const order = await Order.findById(req.params.id).populate("user", "name email")

   if (order) {
      res.json(order)
   } else {
      res.status(404)

      throw new Error("Order Not Found")
   }

})


// desc Update Order to Paid
// route PUT /api/orders/:id/pay
// access Private

const updateOrderToPaid = asyncHandler( async (req, res) => {

   const orderId = mongoose.Types.ObjectId(req.params.id)
   const order = await Order.findById(orderId)

   if (order) {
      
      order.isPaid = true
      order.paidAt = Date.now()
      order.paymentResult = {
         id: req.body.id,
         status: req.body.status,
         update_time: req.body.update_time,
         email_address: req.body.payer.email_address
      }

      const updateOrder = await order.save()

      res.json(updateOrder)

   } else {
      res.status(404)

      throw new Error("Order Not Found")
   }

})

// desc Update Order to Delivered
// route PUT /api/orders/:id/deliver
// access Private/Admin

const updateOrderToDelivered = asyncHandler( async (req, res) => {

   const orderId = mongoose.Types.ObjectId(req.params.id)
   const order = await Order.findById(orderId)

   if (order) {
      
      order.isDelivered = true
      order.deliveredAt = Date.now()
     

      const updateOrder = await order.save()

      res.json(updateOrder)

   } else {
      res.status(404)

      throw new Error("Order Not Found")
   }

})


// desc Get logged user all Orders
// route GET /api/orders/myorders
// access Private

const getMyOrders = asyncHandler( async (req, res) => {

  const userId = req.user._id

   const orders = await Order.find({user: userId});
  res.json(orders);

})

// desc Get All Orders
// route GET /api/orders
// access Private

const getAllOrders = asyncHandler( async (req, res) => {

   const orders = await Order.find({}).populate("user", "id name");

  res.json(orders);

})

 
export {addOrderItems, getOrderById, updateOrderToPaid, updateOrderToDelivered, getMyOrders, getAllOrders}