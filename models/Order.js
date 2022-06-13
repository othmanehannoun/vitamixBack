const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema

const orderSchema = new mongoose.Schema(
  {
    userId: { 
      type: ObjectId, 
      required: true
    },
    
    products: [],

    Delivery_Puckup: {
      type: String,
      required: true
    },
    
    totalPrice: {
      type: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
