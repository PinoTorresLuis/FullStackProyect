import { cartModel } from "../models/cart.models.js";
import { productModel } from "../models/products.models.js";

//Ruta que se utiliza para traer todos los cart que existan
export const findCarts =  async(req,res)=>{
    const prods = await cartModel.find();
    res.status(200).send({resultado:"Carritos encontrados", message:prods});
}

//Ruta que se utiliza para traer un carrito en especifico
export const findCart = async(req,res)=>{
    const {cid} = req.params;
    const prods = await cartModel.findById(cid)//.populate('products.id_prod');
    if (prods){
        res.status(200).send({resultado:"Tu carrito es:", message:prods})
    }else {
        res.status(404).send({resultado:"No se encontró ningún carrito"})
    }
}
//Ruta que se utiliza para crear un carrito
export const createCart = async(req,res)=>{
    try {
        const cart = await cartModel.create({});
        res.status(200).send({resultado:"Carrito creado correctamente",cart})
    } catch (error) {
        res.status(401).send({resultado:"Error al crear el carrito", error});
    }
}
//Ruta que se utiliza para aumentar la cantidad
export const cartQuantity = async(req,res)=>{
    const {cid,pid} = req.params;
    try {
        //Se busca el cid en Cart y pid en Product 
        const cart = await cartModel.findById(cid);
        const product = await productModel.findById(pid);
		//En el caso de que no exista devuelve error
        if(!product){
            res.status(404).send({resultado:"Producto no encontrado", message:product});
            return false
        }
		//En el caso de que exista ingreso al carrito -> products -> y busco el id
        if(cart){
            const productExist = cart.products.find(prod => prod.id_prod == pid);
            if(productExist){//Si existe, aumento la cantida
                productExist.quantity++
            }else { //Si no existe, lo creo y pusheo el atributo quantity en 1
                cart.products.push({id_prod:product._id,quantity:1})
            }
            await cart.save(); //Guardo los cambios
            res.status(200).send({resultado:"Producto agregado correctamente", message:cart});
        }       
    } catch (error) {
        res.status(400).send({error:"Error al agregar el producto al carrito", error})
    }
};

//Ruta para buscar por cid la cual sirve para acumular productos repetidos por su cantidad o si no existe, agregarlo
export const updateProducts = async (req, res) => {
	const { cid } = req.params;
	const updateProducts = req.body; 

	try {
		const cart = await cartModel.findById(cid);
		if(!cart){
			res.status(404).send({resultado:"no existe el carrito"})	
			}
			//Recorro elemento del array del producto enviado desde req.body para verificiar si existe o no
		updateProducts.forEach(prod => {
			const productExists = cart.products.find(cartProducts => cartProducts.id_prod == prod.id_prod);//Compruebo que el id del producto exista 
			if (productExists) {  //Si existe acumulo la cantidad
				productExists.quantity += prod.quantity;
			} else { 
				cart.products.push(prod); //Si no existe, lo agrego 
			}
		});
		await cart.save();
		cart
			? res.status(200).send({ resultado: 'OK', message: cart })
			: res.status(404).send({ resultado: 'Not Found', message: cart }); 
	} catch (error) {
		res.status(400).send({ error: `Error al agregar productos: ${error}` });
	}
};

//Ruta para buscar por CID y PID como indentificares únicos e aumentar la cantidad 
export const updateQuantity = async (req, res) => {
	const { cid, pid } = req.params; 
	const { quantity } = req.body;

	try {
		const cart = await cartModel.findById(cid);

		if (cart) { //Si el id del carrito existe, se busca dentro el id de Productos
			const productExists = cart.products.find(prod => prod.id_prod == pid);
			if (productExists) { //En el caso de que exista
				productExists.quantity += quantity; //se aumenta la cantidad
			} else {
				//Sino, se devuelve error 
				res.status(404).send({ resultado: 'Product Not Found', message: cart });
				
			}
			await cart.save(); //Se guardan los cambios
			res.status(200).send({ resultado: 'Cantidad aumentada correctamente', message: cart });
		} else {
			res.status(404).send({ resultado: 'Cart Not Found', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al agregar productos: ${error}` });
	}
};

//Ruta para los productos que pueden haber dentro de un carrito por su identificación
export const deleteCart = async (req, res) => {
	const { cid } = req.params;
	try { 
		const cart = await cartModel.findByIdAndUpdate(cid, { products: [] });//Se busca y se actualiza con un array vacio
		if(cart){
		res.status(200).send({ resultado: 'El carrito se vació correctamente', message: cart });
		} else {
		 res.status(404).send({ resultado: 'Not Found', message: cart })
		};
	} catch (error) {
		res.status(400).send({ error: `Error al vaciar el carrito: ${error}` });
	}
};

//Ruta para borrar dentro de un carrito el producto en especifico
export const deleteProductCart = async (req, res) => {
	const { cid, pid } = req.params;

	try {
		const cart = await cartModel.findById(cid);
		if (cart) { //Se busca un producto dentro del carrito que tenga un identificador específico
			const productIndex = cart.products.findIndex(prod => prod.id_prod == pid);
			let deletedProduct; //Variable para almacenar temporalmente el producto eliminado
			if (productIndex !== -1) { //Si existe el resultado se almacena en productIndex , si no existe es porque es -1
				deletedProduct = cart.products[productIndex]; //Se guarda el producto encontrado en la variable antes de eliminarlo del carrito
				cart.products.splice(productIndex, 1); //Se utiliza el método splice en el arreglo para eliminar el producto encontrado en la posición productIndex. Ingresamos (1) para indicar que sólo borraremos un elemento.
			} else {
				res.status(404).send({ resultado: 'Product Not Found', message: cart });
				return;
			}
			await cart.save();
			res.status(200).send({ resultado: 'OK', message: deletedProduct });
		} else {
			res.status(404).send({ resultado: 'Cart Not Found', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al eliminar producto: ${error}` });
	}
};