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

    static async addCart(cid, pid) {
        const carts = await this.getCarts()
        const newCart = {
            id: cid,
            products: []
        };

        if (pid) {
            const products = await ProductsManager.getProducts()
            const product = products.find(p => p.id === pid)
            if (product) {
                newCart.products.push({ product, quantity: 1 })
            }
        }

        carts.push(newCart);

        await fs.promises.writeFile(cartsFilePath, JSON.stringify(carts, null, 2))

        return newCart.id
    }

    static async getCartProducts(cid) {
        try {
            const carts = await this.getCarts()
            const cart = carts.find(c => c.id === cid)

            if (!cart) {
                throw new Error(`Cart with id ${cid} not found`)
            }

            return cart.products
        } catch (error) {
            console.error(error)
            return [];
        }
    }

    static async addProductToCart(cid, pid) {
        const carts = await this.getCarts()
        let cart = carts.find(c => c.id === cid)
      
        if (!cart) {
          cart = {
            id: cid,
            products: []
          };
          carts.push(cart)
        }
      
        const products = await ProductsManager.getProducts()
        const product = products.find(p => p.id === pid)
        if (!product) {
          throw new Error(`Product with id ${pid} not found.`)
        }
      
        const productIndex = cart.products.findIndex(p => p.product.id === pid)
        if (productIndex === -1) {
          cart.products.push({ product, quantity: 1 })
        } else {
          cart.products[productIndex].quantity += 1
        }
      
        await fs.promises.writeFile(cartsFilePath, JSON.stringify(carts, null, 2))
      
        return cart.products;
      }

    static generateId = (items) => {
        const ids = items.map(item => item.id)
        return ids.length ? Math.max(...ids) + 1 : 1
    }

}

export default CartManager
