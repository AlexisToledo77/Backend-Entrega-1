import fs from 'fs'

export class CartManager {
    constructor(path) {
        this.path = path
        this.carts = []
    }

    async addCart(producto = {}) {
        let id = 1
        if (this.carts.length > 0) {
            id = Math.max(...this.carts.map(d => d.id)) + 1
        }
        let nuevoCarrito = {
            id,
            ...producto
        };

        this.carts.push(nuevoCarrito)

        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 5))
        return nuevoCarrito
    }













}