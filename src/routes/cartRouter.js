import express from 'express'
import CartManager from '../dao/cartManager.js'

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const { cid, pid } = req.body
        const newCart = await CartManager.addCart(cid, pid)
        res.status(201).json(newCart)
    } catch (error) {
        res.status(500).json({ error: 'Error al crear Carrito' })
    }
})


router.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid
        const products = await CartManager.getCartProducts(cid)

        if (!products) {
            return res.status(404).json({ error: 'Carrito no encontrado' })
        }

        res.json(products)
    } catch (error) {
        console.error('Error al recuperar productos del carrito:', error.message)
        res.status(500).json({ error: 'Error al recuperar productos del carrito' })
    }
})


router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const actualizarProductos = await CartManager.addProductToCart(cid, pid)
        res.json(actualizarProductos)
    } catch (error) {
        if (error.message.includes('Carrito con id')) {
            return res.status(404).json({ error: error.message })
        }
        if (error.message.includes('Producto con id')) {
            return res.status(404).json({ error: error.message })
        }
        console.error('Error al agregar el producto al carrito:', error.message)
        res.status(500).json({ error: 'Error al agregar el producto al carrito' })
    }
})


export { router }









