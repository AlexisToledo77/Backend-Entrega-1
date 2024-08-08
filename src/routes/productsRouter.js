import { Router } from "express"
import { products } from "../data/products.js"
import { ProductsManager } from "../dao/productsManager.js"



export const router = Router()

router.get("/", async (req, res) => {
    let productos
    try {
        productos = await ProductsManager.getProducts()
        console.log("Productos obtenidos:", productos); // Log para depuración
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
    console.log("Producto encontrado:", producto); // Log para depuración
    if (producto) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ payload: producto })
    } else {
        return res.status(404).json({ error: 'Producto no encontrado' })
    }
})

router.post("/", async (req, res) => {
    let { code, ...otros } = req.body
    if (!code) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'Ingrese un codigo Valido' });
    }

    let products = await ProductsManager.getProducts()
    let existe = products.find(p => p.code === code)
    if (existe) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'El producto con ese code ya existe' });
    }

    try {
        let productoNuevo = await ProductsManager.addProduct({ code, ...otros })
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ productoNuevo });

    } catch (error) {
        console.log(error)
        return res.status(500).json(
            {
                error: 'Error inesperado - Intente mas tarde',
                detalle: `${error.mensaje}`
            })

    }

})


router.put("/:pid", async (req, res) => {
    let { pid } = req.params
    pid = Number(pid)
    if (isNaN(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `pid debe ser numerico` })
    }

    console.log(`Modificando producto ${pid}`); //consol debug
    let productos
    try {
        productos = await ProductsManager.getProducts()
        console.log('Productos obtenidos:', productos); //consol debug
    } catch (error) {
        console.log('Error al obtener productos:', error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: 'Error inesperado - Intente mas tarde',
                detalle: `${error.message}`
            }
        )
    }

    let producto = productos.find(p => p.id === parseInt(pid))
    if (!producto) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Producto con ${pid} no fue encontrado` })
    }

    const { title, price, category, thumbnails, stock, code, status, description } = req.body;
    let productoModificado = {
        ...producto,
        title: title || producto.title,
        price: price || producto.price,
        category: category || producto.category,
        thumbnails: thumbnails || producto.thumbnails,
        stock: stock || producto.stock,
        code: code || producto.code,
        status: status !== undefined ? status : producto.status,
        description: description || producto.description

    }

    let aModificar=req.body

    delete aModificar.pid

    // validaciones pertinentes
    if(aModificar.title){
        let existe=products.find(p=>p.title.toLowerCase()===aModificar.title.toLowerCase() && p.id!==pid)
        if(existe){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No se puede modificar el nombre ${aModificar.title}. Cree un nuevo producto`})
        }
    }

    try {
        let productoModificado= await ProductsManager.updateProduct(pid, aModificar);
        console.log(`Producto ${pid} modificado exitosamente`);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({productoModificado});
    } catch (error) {
        console.log('Error al actualizar el producto:', error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
            error: 'Error inesperado 99 - Intente mas tarde',
            detalle: `${error.message}`
        });
    }
});




// router.delete("/:pid", (req, res) => {
//     let { pid } = req.params
//     let productos = `borra producto ${pid}`

//     res.setHeader('Content-Type', 'application/json');
//     return res.status(200).json({ payload: productos });
// }) 