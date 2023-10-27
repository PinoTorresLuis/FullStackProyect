const btnLogOut = document.getElementById('btn-logout');

btnLogOut.addEventListener('click',()=>{
	try {
		fetch('api/session/logout'),{
			method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
		}
		Swal.fire({
			icon: 'success',
			text: 'Cerraste la sesión correctamente!',
			timer: 1500
		  })
            .then(() => {
                window.location.replace('/static/signin');
            });
	} catch (error) {
		Swal.fire({
			icon: 'error',
			text: 'No se pudo cerrar la sesión correctamente!',
			timer: 1500
		  })
		  console.log(error);  
	}
})
