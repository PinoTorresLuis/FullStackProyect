//Passport lo que hace es descriptar el Token y revisa si este tiene la misma contraseña que ingresó. Si es sí el Token se valida, sino el Token no funciona.
import local from 'passport-local'; //Estrategia 
import passport from 'passport'; //Manejador de las estrategias
import GithubStrategy from 'passport-github2'; //Estrategia de GitHub
import jwt from 'passport-jwt';
import { createHash, validatePassword } from '../utils/bcrypt.js' ; //Los voy a implementar dentro de la estrategia
import { userModel } from '../models/users.model.js';

//Defino la estrategia a utilizar. Es la configuración de mi estrategia
const localStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt //Extractor de los headers de la consulta

//Función de mi estrategia
export const initializePassport =()=>{
    const cookieExtractor = req =>{
        console.log(req.cookies)//Si me devuelve un {} no hay cookies en mi app. Es algo totalmente distinto a que no exista mi cookie
        //Si existen cookies, consulte por mi cookie y sino asigno null.
        //Acá lo que hacemos es consultar si existe la cookie, si es así la devuelve sino devuelve un objeto vacio.
        const token = req.cookies ? req.cookies.jwtCookie: {} //Consulto el Token llamado jwtCookie
        console.log(token); 
        //Esto es para extraer la cookie especifica del navegador e implementarla
        return token
    }
    passport.use('jwt', new JWTStrategy({
        //Primero consulto de dónde proviene la cookie.
        //jwtFromRequest: es una propiedad. Y en fromExtractor le digo de dónde voy a extraer la cookie y le paso la función que creamos arriba
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET 
    }, async(jwt_payload,done)=>{ //Payload es la forma en la que puedo implementar los datos. Tiene que ver con el resultado de mi consulta
        try {
            console.log(jwt_payload);
            return done(null, jwt_payload)//Retorno el contenido del Token Cokiee 
        } catch (error) {
            return done(error);
        }
    }))
    //done es como si fuese un res.status(),el callback de respuesta. 
    //Acá defino qué y en qué ruta voy a utilizar mi estrategia
    passport.use('register', new localStrategy(//defino como voy a  registrar a mis usuarios con el new localstrategy
    //con passreqtolocal se devuelve el código como true y lo re defino con el usernamefield:"email" que es lo que nosotros tenemos en nuestra base de datos así no tengo que crear un nuevo campo 

    {passReqToCallback:true, usernameField:"email"}, async(req,username,password,done) =>{
            //Defino como voy a registrar un usuario
        const {first_name,lastname,email,age} = req.body
        
        try {
            const user = await userModel.findOne({email:email})
            if (user){
                //es como si fuese un return de un callback
                return done(null,false);//Acá el null significa que si ya existe no lo puedo volver a crear
            }//Si no existe,lo creo
            const hashPassword = createHash(password);
            const userCreated = await userModel.create({
                first_name:first_name,
                lastname:lastname,
                email:email,
                password:hashPassword,
                age:age
            })
            console.log(userCreated);
            return done(null, userCreated);
        } catch (error) { //Acá el error sería por un error de conexión o un error de la base de datos
            return done(error);
        }
        }
    ))
     
     passport.use('login', new localStrategy({usernameField:'email'}, async(username,password,done)=>{
        try {
            const user = await userModel.findOne({email:username})
          //Consulto por un Login. Si éste no existe, retorno null y false
            if(!user){
                return done(null,false);
            }//SI existe el usuario, compruebo que la contraseña sea valida
            if(validatePassword(password, user.password)){
                return done(null,user)//Usuario y contraseña válidos
            }
            //Si el usuario existe pero la contraseña no lo es, retorno false
            return done(null,false)//Contraseña no valida

        } catch (error) {
            return done(error);
        }
    }))

       //Inicializar la sesión del usuario con serializeUser
        //En los parametros me pide un usuario y done en el caso que se devuelva algo
        passport.serializeUser((user,done)=>{
            //Antes era user.user._id
            done(null,user._id); //Esto es para dar un código más complejo que me permite consultar si existe o no existe el doble usuario. Si yo entro con Login normal es user.id. Si entro con JWT es user.user. Esto sería consultar si existe un objeto que agarra al otro. 
         })
         //Eliminar la sesión del usuario con DESerializeUser
         passport.deserializeUser(async(id,done)=>{
            const user = await userModel.findById(id);
            done(null,user)
         })
    
         //Acá abajo hago el login consultando por los atributos enviados
         //La estrategia se llama 'login'
         //usernameField va a ser email porque no tengo username en mi base de datos
         //Pido los datos dentro del async para después validarlos
         
    passport.use('github', new GithubStrategy({//En este caso ya github nos provee las estrategias, al igual que si lo haría con Google.
        //Me pide 3 elementos, esto es muy común en todas las estregias que no sean local
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, async(accessToken,refreshToken, profile,done)=>{
        try {
            console.log("Este es tu accesToken:", accessToken);
            console.log("Este es tu refreshToken:",refreshToken);
        //esto es para encontrar el usuario:
        const user = await userModel.findOne({email:profile._json.email})//como el email es un atributo único es la única forma de garantizarme si ya existe o no 
        if(!user){ //Si no existe el usuario, lo creo
            const userCreated = await userModel.create({
                first_name: profile._json.name,
                lastname :' ', //Lastname no puedo mandarlo vacio ya que es requerido por lo tanto tengo que enviarle aunque sea una CADENA para que me lo tome como válido
                email: profile._json.email,
                age:18, //Edad por defecto,
                password: 'password' //Creo una password sencilla para que después el usuario lo modifique
            })
          done(null,userCreated);
        }else { 
            done(null,user) //Si existe, lo retorno
        }     
        } catch (error) {
            done(error)
        }
       
    })) 

}
