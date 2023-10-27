//MODULOS
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session'; //Módulo para manejar las sesion previamente definido
import passport from 'passport'; //Módulo para manejar los inicios de sesión con otras plataformas.Ej:Google.
import MongoStore from 'connect-mongo'; //Módulo MongoStore para conectar la sesión con MONGODB
import path from 'path'; //Se utiliza para definir las rutas
import {__dirname} from './path.js'; //Se utiliza para definir la carpeta dentro de una ruta
import { engine } from 'express-handlebars' //Módulo para utilizar Handlebars
import { Server } from 'socket.io'; //Módulo para utilizar WebSocket

import cors from 'cors';

//FUNCIONES IMPORTADAS
import { productModel } from './models/products.models.js'; //ProductsModel para crear Productos
import { initializePassport } from './config/passport.js'; //Import función InitializePassport 
import mongoConnect from './database.js'; //Import Función que realiza la conexión con el Servidor MONGODB 
import router from './routes/index.routes.js'; //Funciones de las rutas de las páginas

//Ruta de MessagesDB con WESBSOCKET
import { messagesModel } from './models/messages.models.js';

const whiteList = ['http://localhost:5173'];

const corsOptions = {
  origin: function(origin,callback){
    if(whiteList.indexOf(origin)!= -1 || !origin){//Si existe dentro del array la dirección entonces lo muestra
      callback(null,true);
    }else {
    callback(new Error('Acceso denegado'))
  }
}}

const PORT = 4000; //Almaceno en el puerto que voy a trabajar
const app = express(); //Inicio el servidor Express

//Inicio mi servidor MongoDB
mongoConnect();

//Server
const server = app.listen(PORT,()=>{
    console.log("SERVIDOR FUNCIONANDO EN PUERTO:", PORT);
})
//Se ubica acá arriba apropósito porque Socket io necesita saber la configuración de los servidores
const io = new Server(server);  //Inicio el server WebSocket

//Middlewares
app.use(cors(corsOptions));
app.use(express.json()); //Se utiliza para que mis rutas puedan leer archivos json
app.use(express.urlencoded({extended:true})); //Se utiliza para optimizar la búsqueda en las rutas
app.engine('handlebars', engine())//Defino que voy a trabajar con handlebars
app.set('view engine', 'handlebars');//Defino extensión
app.set('views', path.resolve(__dirname, './views')) //Defino localización
app.use(cookieParser(process.env.JWT_SECRET)); //Cookie Parser
/* Configuración de la sesión de mi Usuario en mi APP
  FileStore pide 3 argumentos: 
  1: TTL: Time To Live. Vida de la sesión.
  2: Retries: Tiempo de veces que el servidor tratará de leer el archivo.
  3: Path : Ruta donde vivirá la carpeta para almacenar la sessión que en este se va a generar de forma LOCAL
*/
app.use(session({ //Colocamos session como MIDDLEWARE
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL, //Utilizo los .ENV
    mongoOptions: {useNewUrlParser: true,useUnifiedTopology:true},
    ttl:90//Va a durar segundos
  }),
  //store : new fileStorage({path: './sessions',ttl:10000, retries:1}),
  secret:process.env.SESSION_SECRET,
  resave:false, //Permite que la sesion permanezca activa en caso de estar inactivo. Con false muere la sesión
  saveUninitialized:false //Permite guardar cualquier sesion aun cuando el objeto de sesion no tengo nada por contener
}))

initializePassport(); //Exporto la función que está en passport.js
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/static', express.static(path.join(__dirname,'/public')));

app.use('/', router);
app.get('/*',(req,res)=>{   //Ruta con error 404 que se utiliza a nivel general
    res.send("Error 404: Page not found");
})

//Conexión de Socket.io
io.on("connection", (socket)=>{
    console.log("Conexión con Socket.io OK");
    
    //Método para agregar los mensajes a la base de datos
    socket.on("message", async data=>{
      const { email, message } = data;
      await messagesModel.create({
        email,message});
      const messages = await messagesModel.find();
      io.emit('messageLogs', messages);
    })
    
   socket.on('load', async () => {
		const data = await productModel.paginate({}, { limit: 5 });
		socket.emit('products', data);
	});
})



