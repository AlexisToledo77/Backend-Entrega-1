import express from 'express'
import CartManager from '../dao/cartManager.js'

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const { cid, pid } = req.body
        const newCart = await CartManager.addCart(cid, pid)
        res.status(201).json(newCart)
    } catch (error) {
        res.status(500).json({ error: 'Error creating cart' })
    }
})


router.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid
        const products = await CartManager.getCartProducts(cid)

        if (!products) {
            return res.status(404).json({ error: 'Cart not found' })
        }

        res.json(products)
    } catch (error) {
        console.error('Error retrieving cart products:', error.message)
        res.status(500).json({ error: 'Error retrieving cart products' })
    }
})


router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const actualizarProductos = await CartManager.addProductToCart(cid, pid)
        res.json(actualizarProductos)
    } catch (error) {
        if (error.message.includes('Cart with id')) {
            return res.status(404).json({ error: error.message })
        }
        if (error.message.includes('Product with id')) {
            return res.status(404).json({ error: error.message })
        }
        console.error('Error adding product to cart:', error.message)
        res.status(500).json({ error: 'Error adding product to cart' })
    }
})


export { router }









