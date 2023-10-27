import { Schema, model } from "mongoose";

const cartSchema = new Schema ({
    products :{
        type:[
            {   
                id_prod:{
                    type: Schema.Types.ObjectId, //ID autogenerando desde MongoDB
                    ref: 'products', //Referencia a la colleción Products y así poder "joinearlos"
                    required: true
                },
                quantity: {
                    type:Number,
                    required: true //siempre tiene que empezar en default a 1 
                }
            }
        ],
            default:function(){
                return []
            }

    }
})

// por defecto hace un populate en el find
cartSchema.pre('find', function () {
	this.populate('products.id_prod');
});

export const cartModel = model ('carts', cartSchema)
