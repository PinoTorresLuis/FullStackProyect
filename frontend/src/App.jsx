import { BrowserRouter, Routes, Route} from 'react-router-dom'
import { Login } from './components/Login'
import { Register } from './components/Register'
import { Products } from './components/Products'
import { NewProduct } from './components/NewProduct'
export const App = ()=>{
  return(
  <div>
    <BrowserRouter>
      <Routes>
        <Route path='/products' element={<Products/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/newProduct' element={<NewProduct/>}/>
        <Route path='/*' element={<h1>404 Not Found</h1>}/>
      </Routes>
    </BrowserRouter>
  </div>
  )
}
