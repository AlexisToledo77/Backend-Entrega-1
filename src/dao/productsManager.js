import { products } from "../data/products.js";
import fs from 'fs';

export class ProductsManager{
    constructor(path){
        this.path = path;
    }

    static async getProducts(){
        return products
    }

    static async addProduct(producto={}){
        let products=await this.getProducts()
        let id=1
        if(products.length>0){
            id=Math.max(...products.map(d=>d.id))+1
        }
        let nuevoProducto={
            id,
            ...producto
        }

        products.push(nuevoProducto)

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
        return nuevoProducto
    }
}