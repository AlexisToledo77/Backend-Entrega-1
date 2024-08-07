import { Router } from "express"
import { products } from "../data/products.js"
import { ProductsManager } from "../dao/productsManager.js"

export const router = Router()

router.get("/", async (req, res) => {
    let productos
    try {
        productos = await ProductsManager.getProducts()
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ payload: productos })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Error inesperado - Intente mas tarde' })
    }
})

router.get("/:pid", (req, res) => {
    let { pid } = req.params
    let producto = products.find(p => p.id === parseInt(pid))
    if (producto) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ payload: producto })
    } else {
        return res.status(404).json({ error: 'Producto no encontrado' })
    }
})


router.post("/", async (req, res) => {
    let {code, ...otros}=req.body
    if(!code){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error:'Ingrese un codigo Valido' });
    }

    let products = await ProductsManager.getProducts()
    let existe=products.find(p=>p.code===code)
    if (existe){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error:'El producto con ese code ya existe' });
    }

    try {
        let productoNuevo=await ProductsManager.addProduct({code, ...otros})
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({productoNuevo});

    } catch (error) {
        console.log(error)
        return res.status(500).json(
            { 
                error: 'Error inesperado - Intente mas tarde' ,
                detalle: `${error.mensaje}`
            })
        
    }

})

router.put("/:pid", (req, res) => {
    let { pid } = req.params
    let productos = `modifica producto ${pid}`

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ payload: productos });
})

router.delete("/:pid", (req, res) => {
    let { pid } = req.params
    let productos = `borra producto ${pid}`

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ payload: productos });
}) 