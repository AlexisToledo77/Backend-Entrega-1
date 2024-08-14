import fs from 'fs'


class ProductsManager {
    static path;
    static products = [];

    static async init(path) {
        this.path = path;
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8')
            this.products = JSON.parse(data)
            return this.products
        } catch (error) {
            console.error(error)
            return []
        }
    }

    async addProduct(producto = {}) {
        let id = 1
        if (this.products.length > 0) {
            id = Math.max(...this.products.map(d => d.id)) + 1
        }
        let nuevoProducto = {
            id,
            ...producto
        };

        this.products.push(nuevoProducto)

        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 5))
        return nuevoProducto
    }

    async updateProduct(pid, aModificar = {}) {
        let indiceProductos = this.products.findIndex(h => h.id === pid)
        if (indiceProductos === -1) {
            throw new Error(`Error: no existe id ${pid}`)
        }
        this.products[indiceProductos] = {
            ...this.products[indiceProductos],
            ...aModificar,
            pid
        };
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 5))
        return this.products[indiceProductos]
    }

    async deleteProduct(pid) {
        let products = await this.getProducts()
        let indiceProductos = products.findIndex(h => h.id == pid)
        if (indiceProductos === -1) {
            throw new Error(`Error: no existe id ${pid}`)
        }
        let cantidad0 = products.length
        products = products.filter(h => h.id != pid)
        let cantidad1 = products.length

        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
        } catch (error) {
            console.error(`Error al escribir el archivo: ${error}`)

            return cantidad0 - cantidad1
        }

    }
}
export default ProductsManager;

