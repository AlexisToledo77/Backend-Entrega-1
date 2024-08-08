import { products } from "../data/products.js";
import fs from 'fs';

export class ProductsManager {
    constructor(path) {
        this.path = path;
    }

    static async getProducts() {
        console.log("Productos obtenidos:", products); // Log para depuración
        return products;
    }

    static async addProduct(producto = {}) {
        let products = await this.getProducts()
        let id = 1
        if (products.length > 0) {
            id = Math.max(...products.map(d => d.id)) + 1
        }
        let nuevoProducto = {
            id,
            ...producto
        }

        products.push(nuevoProducto)

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
        return nuevoProducto
    }

    static async updateProduct(pid, aModificar = {}) {
        let products = await this.getProducts()
        let indiceProductos = products.findIndex(h => h.id === pid)
        if (indiceProductos === -1) {
            throw new Error(`Error: no existe id ${id}`)
        }
        products[indiceProductos] = {
            ...products[indiceProductos],
            ...aModificar,
            pid
        }
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
        return products[indiceProductos]
    }

}
