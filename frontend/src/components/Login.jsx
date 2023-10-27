import { useRef } from 'react';//Guarda una referencia de lo que es el formulario. Por ende cada vez que hago referencia con ref hago referencia al Formulario
import {useNavigate} from 'react-router-dom'

export const Login = ()=>{
    const formRef = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        console.log(formRef.current);
        const  datForm = new FormData(formRef.current); //Transforma un HTML en un Objeto Iterador 
        const data = Object.fromEntries(datForm); //Dado un objeto iterador me trae los datos de los promt
        console.log(data);

        const response = await fetch('http://localhost:4000/api/session/login',{
            method:'POST',
            headers:{
                'Content-type':'application/json',
            },
            body:JSON.stringify(data)
        })
        //Cuando sea un Login válido
        if(response.status == 200){
            const datos = await response.json()
            document.cookie = `jwtToken=${datos.token}; expires=${new Date(Date.now()+ 1 * 24 * 60 * 60 * 1000).toUTCString()};path=/`
            navigate('/products');
        }else {
            console.log('Login invalido');
        }

    }

    return(
        <div className='container'>
            <h1>Formulario de Login</h1>
            <form onSubmit={handleSubmit} ref={formRef}>
                <div className="mb-3">
                <label htmlFor="email">Ingrese su email</label>
                <input type="email" name='email'/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password">Ingrese su contraseña:</label>
                    <input type="password" name='password' />
                </div>
                <button type='
                submit' className='btn btn-dark'>Iniciar Sesion</button>
            </form>
        </div>
    )
}