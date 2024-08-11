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