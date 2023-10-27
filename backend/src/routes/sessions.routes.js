import { Router } from "express";
import passport from "passport";
import { createUserGitHub, loginGitHub, logout, sessionLogin, testSessionJWT, userCurrent, userRegister } from "../controllers/session.controller.js";

import { passportError, authorization } from "../utils/messageErrors.js";
const sessionRouter = Router();

sessionRouter.post('/login', passport.authenticate('login'),sessionLogin);


//Esta es la ruta de creación de Usario
sessionRouter.get('/github', passport.authenticate('github', {scope:['user:email']}), createUserGitHub);

//Ruta de inicio de sesión
sessionRouter.get('/githubSession', passport.authenticate('github'),loginGitHub);


sessionRouter.post('/register', passport.authenticate('register'),userRegister);

//Prueba de inicio de sesión para el manejo de JWT
sessionRouter.get('/testJWT', passport.authenticate('jwt', {session:false}),testSessionJWT);

sessionRouter.get('/current', passportError('jwt'), authorization('user'), userCurrent); //Si quiero mandar varias opciones tengo que hacer un array en Authorization ['User','UserPremium]

sessionRouter.get('/logout',logout);

export default sessionRouter;

