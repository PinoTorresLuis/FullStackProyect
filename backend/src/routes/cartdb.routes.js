import { Router } from "express";

import { cartQuantity, createCart, deleteCart, deleteProductCart, findCart, findCarts, updateProducts, updateQuantity } from "../controllers/cart.controller.js";

const cartRouterDB = Router(); //Almaceno Router en una variable para poder utilizar las rutas

//Ruta que se utiliza para traer todos los cart que existan
cartRouterDB.get('/', findCarts);

//Ruta que se utiliza para traer un carrito en especifico
cartRouterDB.get('/:cid', findCart);

//Ruta que se utiliza para crear un carrito
cartRouterDB.post('/', createCart);

//Ruta que se utiliza para aumentar la cantidad
cartRouterDB.post('/:cid/products/:pid', cartQuantity);

//Ruta para buscar por cid la cual sirve para acumular productos repetidos por su cantidad o si no existe, agregarlo
cartRouterDB.put('/:cid', updateProducts);

//Ruta para buscar por CID y PID como indentificares únicos e aumentar la cantidad 
cartRouterDB.put('/:cid/products/:pid', updateQuantity);

//Ruta para los productos que pueden haber dentro de un carrito por su identificación
cartRouterDB.delete('/:cid',deleteCart);

//Ruta para borrar dentro de un carrito el producto en especifico
cartRouterDB.delete('/:cid/products/:pid', deleteProductCart);

export default cartRouterDB
