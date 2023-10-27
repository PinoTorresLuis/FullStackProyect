import { useRef } from 'react';//Guarda una referencia de lo que es el formulario. Por ende cada vez que hago referencia con ref hago referencia al Formulario
import {useNavigate} from 'react-router-dom';
export const Register = ()=>{

    const formRef = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        console.log(formRef.current);
        const  datForm = new FormData(formRef.current); //Transforma un HTML en un Objeto Iterador 
        const data = Object.fromEntries(datForm); //Dado un objeto iterador me trae los datos de los promt
        console.log(data);

        const response = await fetch('http://localhost:4000/api/session/register',{
            method:'POST',
            headers:{
                'Content-type':'application/json',
            },
            body:JSON.stringify(data)
        })
        //Cuando sea un Login válido
        if(response.status == 200){
            const datos = await response.json()
            console.log(datos);
            navigate('/login');
        }else {
            console.log('Registro invalido');
        }
    }

    return (
        <div className='container'>
        <h1>Formulario de Registro</h1>
        <form onSubmit={handleSubmit} ref={formRef}>
        <div className="mb-3">
            <label htmlFor="first_name">Ingrese su nombre</label>
            <input type="text" name='first_name'/>
        </div>    
        <div className="mb-3">
            <label htmlFor="lastname">Ingrese su Apellido</label>
            <input type="text" name='lastname'/>
        </div>
        <div className="mb-3">
            <label htmlFor="age">Ingrese su Edad</label>
            <input type="number" name='age'/>
        </div>
        <div className="mb-3">
            <label htmlFor="email">Ingrese su email</label>
            <input type="email" name='email'/>
        </div>
        <div className="mb-3">
            <label htmlFor="password">Ingrese su contraseña:</label>
            <input type="password" name='password' />
        </div>
            <button type='
            submit' className='btn btn-dark'>Registrarse</button>
        </form>
    </div>
    )
}