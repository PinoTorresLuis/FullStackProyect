import { Schema, model } from "mongoose";
import { cartModel } from "./cart.models.js";
//Definición de mi esquema de datos
const userSchema = new Schema({
    first_name: {
        required:true,
        type:String,
    },
    lastname:{
        required:true,
        type:String,
    },
    email: {
        required:true,
        type:String,
        index:true,
        unique: true
    },
    password:{
        required:true,      
        type:String,
    },
    rol:{
        type:String,
        default:'user'
    },
    age:{
        required:true,
        type:Number,
    },
    cart: { //Tengo que crear el carrito cuando creo el usuario
        type: Schema.Types.ObjectId, //ID autogenerando desde MongoDB
        ref: 'carts'
    }
})

userSchema.pre('save', async function (next) {
    try {
        const newCart = await cartModel.create({})
        this.cart = newCart._id
    } catch (error) {
        next(error)
    }

})

export const userModel = model('users',userSchema)//Defino mi modelo con un nombre y el Schema