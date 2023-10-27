import { useRef } from 'react';//Guarda una referencia de lo que es el formulario. Por ende cada vez que hago referencia con ref hago referencia al Formulario
import {useNavigate} from 'react-router-dom';
export const NewProduct = ()=>{

    const formRef = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        console.log(formRef.current);
        const  datForm = new FormData(formRef.current); //Transforma un HTML en un Objeto Iterador 
        const data = Object.fromEntries(datForm); //Dado un objeto iterador me trae los datos de los promt
        console.log(data);

        const response = await fetch('http://localhost:4000/api/products',{
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
            navigate('/products');
        }else {
            console.log('Error en creación del producto');
        }
    }

    return (
        <div className='container'>
        <h1>Formulario de Creación de Producto</h1>
        <form onSubmit={handleSubmit} ref={formRef}>
        <div className="mb-3">
            <label htmlFor="title">Title</label>
            <input type="text" name='title' required/>
        </div>    
        <div className="mb-3">
            <label htmlFor="description">Description</label>
            <input type="text" name='description' required/>
        </div>
        <div className="mb-3">
            <label htmlFor="price">Price</label>
            <input type="number" name='price' required/>
        </div>
        <div className="mb-3">
            <label htmlFor="thumbnail">Thumbnail</label>
            <input type="text" name='thumbnail'required/>
        </div>
        <div className="mb-3">
            <label htmlFor="code">Código</label>
            <input type="text" name='code' required/>
        </div>
        <div className="mb-3">
            <label htmlFor="stock">Stock</label>
            <input type="text" name='stock' required/>
        </div>
            <button type='
            submit' className='btn btn-dark'>Crear</button>
        </form>
    </div>
    )
}