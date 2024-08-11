import { Router } from "express"
import products from '../data/products.json' assert { type: 'json' }
import { ProductsManager } from "../dao/productsManager.js"
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const filePath = path.join(__dirname, '../data/products.json')
const productsManager = new ProductsManager(filePath)

export const router = Router()

router.get("/", async (req, res) => {
    let productos
    try {
        productos = await productsManager.getProducts()
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
    let { code, title, price, category, thumbnails, stock, status, description } = req.body

    const priceNumero = Number(price)
    const stockNumero = Number(stock)

    const statusBooleano = Boolean(status)

    if (isNaN(priceNumero) || isNaN(stockNumero)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: 'Los valores de price y stock deben ser números válidos' })
    }

    if (!code) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: 'Ingrese un codigo Valido' })
    }

    let products = await productsManager.getProducts()
    let existe = products.find(p => p.code === code)
    if (existe) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: 'El producto con ese code ya existe' })
    }

    try {
        let productoNuevo = await productsManager.addProduct({
            code,
            title,
            price: priceNumero,
            category,
            thumbnails,
            stock: stockNumero,
            status: statusBooleano,
            description
        });
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ productoNuevo })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Error inesperado98 - Intente mas tarde',
            detalle: `${error.mensaje}`
        });
    }
})

router.put("/:pid", async (req, res) => {
    let { pid } = req.params
    pid = Number(pid)
    if (isNaN(pid)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: `pid debe ser numerico` })
    }

    let productos
    try {
        productos = await productsManager.getProducts()
    } catch (error) {
        console.log('Error al obtener productos:', error)
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json(
            {
                error: 'Error inesperado - Intente mas tarde',
                detalle: `${error.message}`
            }
        )
    }

    let producto = productos.find(p => p.id === parseInt(pid))
    if (!producto) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: `Producto con ${pid} no fue encontrado` })
    }

    const { title, price, category, thumbnails, stock, code, status, description } = req.body
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
    delete req.body.id


    let aModificar = req.body

    delete aModificar.pid

    // validaciones
    if (aModificar.title) {
        let existe = products.find(p => p.title.toLowerCase() === aModificar.title.toLowerCase() && p.id !== pid)
        if (existe) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: `No se puede modificar el nombre ${aModificar.title}. Cree un nuevo producto` })
        }
    }

    try {
        let productoModificado = await productsManager.updateProduct(pid, aModificar)
        console.log(`Producto ${pid} modificado exitosamente`)
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json({ productoModificado })
    } catch (error) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({
            error: 'Error inesperado 99 - Intente mas tarde',
            detalle: `${error.message}`
        })
    }
})

router.delete("/:pid", async (req, res) => {
    let { pid } = req.params
    if (isNaN(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `id debe ser numerico` })
    }
    try {
        await productsManager.deleteProduct(pid)
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ mensaje: `Producto ${pid} eliminado correctamente` })
    } catch (error) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({ error: `No se puede eliminar el producto: (${error.message})` })
    }

})
