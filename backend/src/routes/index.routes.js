import { Router } from 'express';
//Ruta de HandleBars
import routerHandleBars from './views.routes.js';
//Ruta de ProductsDB
import productRouter from './productsdb.routes.js';
//Ruta de CartProductsDB
import cartRouterDB from './cartdb.routes.js';
//Ruta de SessionesDB
import sessionRouter from "./sessions.routes.js";
//Ruta de UsuariosDB
//import userRouter from './users.routes.js';

const router = Router();

router.use('/api/products', productRouter);
//router.use('/api/users', userRouter);
router.use('/api/carts',cartRouterDB);
router.use('/api/session', sessionRouter);
router.use('/static',routerHandleBars);

export default router;