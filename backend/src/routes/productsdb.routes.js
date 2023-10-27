import { Router } from "express";
import { passportError, authorization } from "../utils/messageErrors.js";
import { deleteProduct, getProduct, getProducts, postProduct, putProducts } from "../controllers/product.controller.js";

const productRouter = Router();
//Ruta inicial de Products
productRouter.get('/', getProducts
  /*   //Definimos las opciones que va a poder ingresar mi usuario
    const {limit,page,sort,category, status} = req.query;
  
    const limitNumber = parseInt(limit) || 10;   //Limitamos que por default traiga 10 productos en la página o que el usuario pueda ingresar el límite
    const pageNumber = parseInt(page) || 1; //Definimos que por defecto inicia en la página 1 o que el usuario elija qué página quiere navegar

    //Utilizamos la query.sort que viaja desde el lado del cliente para que según lo que ingrese ordene de forma Ascendente o Descendente
    let sortOption;
	sort == 'asc' && (sortOption = 'price');
	sort == 'desc' && (sortOption = '-price');

    //Almacenamos las variables dentro del objeto Options para utilizarlo más adelante. Es lo que recomienda la documentación de Paginate -v2
    const options = {
        page: pageNumber,
        limit:limitNumber,
        sort:sortOption || null
    }

    //Acá definimos la posibilidad de buscar por categoria o status(disponibile). Lo vamos a utilizar más adelante
	const query = {};
	category && (query.category = category);
	status && (query.status = status);

    try {
        const prods = await productModel.paginate(query, options); //Pasamos los objetos dentro de los paramétros
        console.log(prods);
        res.status(200).send({resultado:'Solicitud de productos correcta', message:prods})
    } catch (e) {
        res.status(400).send({e:'Error al consultar los productos',e});
    } */
)

//Ruta para traer un producto según su ID
productRouter.get('/:id', getProduct
  /*   const {id} = req.params
    try {
        const prod = await productModel.findById(id);
        if(prod){
        res.status(200).send({resultado:'Producto encontrado correctamente', message:prod})
        }else {
        res.status(404).send({resultado:"Not Found", message:prod})
        }
    } catch (e) {
        res.status(400).send({e:'Error al consultar el producto',e});
    } */
)
//Ruta para crear un producto
productRouter.post('/', passportError('jwt'), authorization('Admin'), postProduct /* async(req,res)=>{
    const {title,description,stock,code,category,price} = req.body
    try {
        const succes = await productModel.create({
            title,description,stock,code,category,price
        });
        if(succes){
        res.status(200).send({resultado:'Producto enviado correctamente', message:succes})
        }
    } catch (e) {
        res.status(400).send({e:"Todos los campos son obligatorios",e});
    } 
}*/
)
//Ruta para actualizar un producto buscado por su ID
productRouter.put('/:id',  passportError('jwt'), authorization('Admin'), putProducts /* async(req,res)=>{
    const {id} = req.params
    const {title,description,stock,code,category,price,status} = req.body
    try {
        const succes = await productModel.findByIdAndUpdate(id,{
            title,description,stock,code,category,price,status
        });
        if(succes){
        res.status(200).send({resultado:'Producto actualizado correctamente', message:succes})
        }else{
            res.status(404).send({e:'Not Found-Update', message:succes});
        }
    } catch (e) {
        res.status(400).send({e:'Error al actualizar el producto',e});
    }
} */)

//Ruta para borrar un producto según su ID
productRouter.delete('/:id', passportError('jwt'), authorization('Admin'), deleteProduct  /*  async(req,res)=>{
    const {id} = req.params
    try {
        const succes = await productModel.findByIdAndDelete(id); //Utilizamos el método FindByIDAndUpdate que mismo mongoDB lo provee.
        if(succes){
        res.status(200).send({resultado:'Producto borrado correctamente', message:succes})
        }else{
            res.status(404).send({e:'Not found', message:succes});
        }
    } catch (e) {
        res.status(400).send({e:'Error al eliminar el producto',e});
    }
} */)

export default productRouter;