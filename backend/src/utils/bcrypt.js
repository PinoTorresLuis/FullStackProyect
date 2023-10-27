import bcrypt from 'bcrypt';
import 'dotenv/config.js'; //Permite utilizar variables de entorno

//Encriptar contraseña
//La variable SALT no se suele almacenar el número 10 porque es el número por defecto y los cyberataques empezarían a probar desde ahí.

//Lo que estamos haciendo acá es encriptar la contraseña que ingresa mi usuario 
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT)));

const hashPassword = createHash("Coderhouse");
//console.log(hashPassword);
//Para descencryptar la contraseña en los parámetros a la izquierda ingreso la contraseña de mi usuario que quiere ingresar y a la derecha la contraseña de mi base de datos
export const validatePassword = (passwordSend,passwordBBD) => bcrypt.compareSync(passwordSend,passwordBBD);
//Internamente bcrypt ya sabe la cantidad de saltos que hizo

//A la izquierda va la contraseña que va a enviar mi usuario y a la derecha va a estar el hashPassword para que se encrypte y no sea legible para nadie en la BD
//console.log(validatePassword("coderhouse",hashPassword));
//Ingresé una contraseña, se encrypto, por lo tanto tengo una forma para encriptarla y otra para validar si la contraseña es valida. 


