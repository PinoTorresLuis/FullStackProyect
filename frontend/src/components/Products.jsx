import { useEffect, useState } from "react"

export const Products = ()=>{
    const [products,setProducts] = useState([]);

    const queryParams = {
        limit: '10',
        page : '1',
        filter: 'lapicera',
        ord: 'asc'
    }
    const queryString = new URLSearchParams(queryParams).toString();

    const fetchProducts = async(req,res)=>{
        const response = await fetch (`http://localhost:4000/api/products?${queryString}`,{
            method:'GET',
            headers:{
                'Content-type':'application/json',
            },   
        });

        if(response.status == 200){
            const data = await response.json();
            console.log(data.docs);
            setProducts(data.docs);
        }

    }
//UseEffect tiene un control sobre el estado de los productos. Sin esto va a llamar todo el tiempo la BDD. De esta forma controlo que sólo llame cuando haya cambios importantes.
    useEffect(()=>{
        fetchProducts()
    },[]);

    return (
        
        <div className="container row">
            {products.map(prods =>
            <div className="card" style={{width: '18rem'}}>
                <div className="card-body">
                  <h5 className="card-title"> {prods.title}</h5>
                  <p className="card-text"> {prods.description} </p>
                  <p className="card-text"> {prods.category} </p>
                  <p className="card- text"> {prods.price} </p>
                  <p className="card-text"> {prods.stock} Unidades</p>
                  <button className="btn btn-secondary">Ver Producto</button>
                </div>
            </div>
                )}
        </div>
    )
}