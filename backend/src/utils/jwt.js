import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const generateToken = (user) =>{
    /* 
        1er parámetro: Objeto asociado al token.
        2do parámetro : Clave privada para el cifrado.
        3er parámetro: Tiempo de expiración.
    */
    const token = jwt.sign({user}, "coderhouse123",{expiresIn:'12h'}); //acá el profesor harcodeo la clave con "coderhouse123" para que genere la contraseña secreta porque todavía no está conectado con la aplicación. Por eso no se puede generar el Token de la nada

    return token
}
//console.log(generateToken({"_id":"650dc9e0edfd3c6a48d1d3d7","first_name":"cripto","lastname":"cripto","email":"cripto@gmail.com","password":"$2b$15$9fdzFMmVJC7yrmhcN05j2uN.w1fRtV.q8ISXuW4cvsfxfYmux9o3a","rol":"user","age":{"$numberInt":"40"}}));

//Compruebo autenticación
export const authToken = (req,res,next)=>{
    //Consulto el header
    const authHeader = req.headers.Authorization //Consulto si existe el token
    if(!authHeader){
        return res.status(401).send({Error:'Usuario no autenticado'})
    }
    const token = authHeader.split(' ')[1]  //Separo en dos mi token y me quedo con la parte valida.La que me interesa es la que no dice Beader

    //Ahora consultamos si el Token es valido. Lo que hacemos es verificar si la contraseña es la misma con la que yo la encripté
    jwt.sign(token,process.env.JWT_SECRET,(error,credentials)=>{
        if(error){
            return res.status(403).send({Error:'Usuario no autorizado'})
        }
        //Descifro el Token
        req.user = credentials.user; 
        next();
    })
}