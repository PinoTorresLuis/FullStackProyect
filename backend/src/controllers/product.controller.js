import { productModel } from "../models/products.models.js";

//Generamos funciones en un formato más general.Combinamos Cada fn son el método involucrado + el modelo.
export const getProducts = async(req,res)=>{
    const {limit,page,filter,sort} = req.query;

    const fil = filter ? filter : {};
    const pag = page ? page : 1;
    const lim = limit ? limit : 10;
    const ord = sort == 'asc' ? 1: -1;
    console.log(fil);
    try {
        const products = await productModel.paginate({category:fil},{limit:lim,page:pag,sort:{price:ord}});
        if (products){
          return res.status(200).send(products);
        }
        res.status(404).send({mensaje: "Productos no encontrados"})
    } catch (error) {
        res.status(500).send({error:"Error al consultar productos:", error})
    }
}

export const getProduct = async(req,res)=>{
    const {id} = req.query
   
    try {
        const idProduct = await productModel.findById(id);
        if (idProduct){
          return res.status(200).send(idProduct);
        }
        res.status(404).send({error: "Productos no encontrado"})
    } catch (error) {
        res.status(500).send({error:"Error en consultar producto:", error})
    }
}

export const postProduct = async(req,res)=>{
    const {title,description,code,price,stock,category} = req.body;
    try {
        const product = await productModel.create({title,description,code,price,stock,category});
        if (product){
          return res.status(201).send({resultado:'Producto enviado correctamente', message:product});
        }
        res.status(404).send({error: "Productos no encontrado"})
    } catch (error) {
        if(error.code = 11000){
            return res.status(400).send({error:'Código duplicado'})
        } else {
            return res.send(500).send({error:'Error en crear el producto',error}) //Error 500 es un error general
        }
    }
    //tengo que validar que el usuario mande el form completo para crearlo
}

export const putProducts = async(req,res)=>{
    const {id} = req.params
    const {title,description,code,price,stock,category,status} = req.body;
    try {
        const product = await productModel.findByIdAndUpdate(id,{title,description,code,price,stock,category,status});
        if (product){
          return res.status(200).send({mensaje:'Producto creado correctamente', product});
        }
        res.status(404).send({error: "Productos no encontrado"})
    } catch (error) {
         res.send(500).send({error:'Error en actualizar el producto',error}) //Error 500 es un error general
    }
}

export const deleteProduct = async(req,res)=>{
    const {id} = req.params ; 
    try {
        const product = await productModel.findByIdAndDelete(id);
        if (product){
          return res.status(200).send({mensaje:'Producto eliminado correctamente', product});
        }
        res.status(404).send({error: "Productos no encontrado"})
    } catch (error) {
        res.send(500).send({error:'Error en actualizar el producto',error}) //Error 500 es un error general
    }
}