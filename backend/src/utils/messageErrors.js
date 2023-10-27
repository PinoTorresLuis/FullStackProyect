import passport from "passport";

//Función general para retornar errores en las estrategias de passport.
export const passportError = (strategy)=>{
    //Primer filtro de cualquier estrategia de Passport
    return async(req,res,next)=>{
        passport.authenticate(strategy,(error,user,info)=>{
            if (error){ //Retornamos el error
                return next(error)
            }
            if (!user){
                res.status(401).send({error:info.messages ? info.messages : info.toString()})//Si me envían ifo message, muestro la respuesta que me enviaron, sino muestro el objeto info pasado a string(Pueden enviar info.messages = "Usuario no valido" o info = "User no validado")
            }
            req.user = user;
            next();
        })(req,res,next); //Esto es porque es un middleware porque va a estar entre mi ruta y mi aplicación. Retorno lo que sería la aplicación. No está como middweare ya implementando, sino que lo implemento a traves de una función passportError y el valor que ingrese va a estar al nivel del Middware
    }
}
//Ingreso un rol y verifico si mi usuario lo cumple.Ej: Ingreso admin y compruebo si existe
export const authorization = (rol)=>{
    return async (req,res,next)=>{
        //Se vuelve a consultar si el usuario existe porque el Token puede expirar, el usuario borrar el historial o algún problema técnico con la pc
        if(!req.user){//Si no existe el usuario
            return res.status(401).send({error:"User no autorizado"});
        }//Este código es porque la sesión se repite dos veces, primero se crea la sesión y después el objeto interno por eso el [0]
        if(req.user.user.rol !=rol){//Si mi usuario tiene un rolo distinto al ingresado como paramétro
            return res.status(403).send({error:'User no tiene los privilegios necesarios'});
        }
        next();
    }
}