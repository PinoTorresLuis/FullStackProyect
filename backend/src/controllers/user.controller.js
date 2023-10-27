export const userRegister = async(req,res)=>{
    try {
        if(!req.user){
            res.status(400).send({mensaje:"Usuario ya creado"});
        }
        return res.status(200).send({mensaje:"Usuario creado correctamente"});
    } catch (error) {
        res.status(500).send({error:"Error al crear usuario", error});
    }
}