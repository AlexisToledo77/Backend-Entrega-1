import fs from 'fs'
import path from 'path'
import { ProductsManager } from "./productsManager.js"

const cartsFilePath = path.resolve('src/data/cart.json')

class CartManager {
    static async getCarts() {
        if (fs.existsSync(cartsFilePath)) {
            return JSON.parse(await fs.promises.readFile(cartsFilePath, 'utf-8'))
        } else {
            return []
        }
    }

    static async addCart() {
        const carts = await this.getCarts()
        const newCart = {
            id: cart1(), 
            products: []
        };

        carts.push(newCart)

        await fs.promises.writeFile(cartsFilePath, JSON.stringify(carts, null, 2))

        return newCart
    }

    static async getCartProducts(cid) {
        try {
            const carts = await this.getCarts()
            const cart = carts.find(c => c.id === cid)

            if (!cart) {
                return null
            }

            return cart.products
        } catch (error) {
            console.error('Error retrieving cart products:', error.message)
            throw new Error('Error retrieving cart products')
        }
    }

    static async addProductToCart(cid, pid) {
        const carts = await this.getCarts()
        const cart = carts.find(c => c.id === cid)
        if (!cart) {
            throw new Error(`Cart with id ${pid} not found.`)
        }
    
        const products = await ProductsManager.getProducts()
        const product = products.find(p => p.id === pid)
        if (!product) {
            throw new Error(`Product with id ${pid} not found.`)
        }
    
        const productIndex = cart.products.findIndex(p => p.product === pid)
        if (productIndex === -1) {
            cart.products.push({ product: pid, quantity: 1 })
        } else {
            cart.products[productIndex].quantity += 1
        }
    
        await fs.promises.writeFile(cartsFilePath, JSON.stringify(carts, null, 2))
    
        return cart.products
    }
    
}

export default CartManager
