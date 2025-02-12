import ProductServices from "../services/ProductServices.js"
import {error500} from "../utils.js"

const getProducts = async (req, res) => {
    try {
        let { limit = 10, page = 1, query, sort } = req.query
        let filter = {}
        limit = Number(limit)
        page = Number(page)

        if (isNaN(limit) || limit <= 0) limit = 10
        if (isNaN(page) || page < 0) page = 1

        if (query) {
            const [key, value] = query.split(":")
            if (key && value !== undefined) {
                if (key === "price" || key === "stock") {
                    filter[key] = Number(value)
                } else if (key === "status") {
                    filter[key] = value === "true"
                } else {
                    filter[key] = { $regex: value, $options: "i" }
                }
            }
        }

        let sortOption = sort === 'desc' ? -1 : 1

        const result = await ProductServices.getProductsFilter(filter, limit, page, sortOption)

        res.setHeader('Content-type', 'application/json')
        return res.status(200).json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.page - 1,
            nextPage: result.page + 1,
            page: result.page,
            hasPrevPage: result.page > 1,
            hasNextPage: result.page < result.totalPages,
            prevLink: result.page > 1 ? `/api/products?page=${result.page - 1}&limit=${limit}` : null,
            nextLink: result.page < result.totalPages ? `/api/products?page=${result.page + 1}&limit=${limit}` : null
        })
    } catch (error) {
        error500(res, error)
    }
}

const getProductById = async (req, res) => {
    res.setHeader('Content-type', 'application/json')
    let productId = req.params.pid
    try {
        let productDb = await ProductServices.getProductById(productId)
        if (!productDb) {
            return res.status(404).send({ status: "error", error: "product not found" })
        }
        return res.status(200).send(productDb)
    } catch (error) {
        error500(res, error)
    }
}

const createProduct = async (req, res) => {
    let { title, description, code, price, status, stock, category, thumbnails } = req.body
    price = Number(price)
    stock = Number(stock)

    if (isNaN(price)) return res.status(400).json({ status: "error", error: "Price is not a number" })
    if (isNaN(stock)) return res.status(400).json({ status: "error", error: "Stock is not a number" })

    if (!title || !description || !code || price <= 0 || stock < 0 || !category) {
        return res.status(400).json({ status: "error", error: "All fields are required and must be valid" })
    }

    try {
        let productDb = await ProductServices.getProduct(title, code)
        if (productDb) {
            return res.status(400).send({ status: "error", message: "Product exists" })
        }
        ProductServices.addProduct(title, description, code, price, status, stock, category, thumbnails)
        return res.status(201).send({ status: "success", message: "product created" })
    } catch (error) {
        error500(res, error)
    }
}

const updateProduct = async (req, res) => {
    let { title, description, code, price, status, stock, category, thumbnails } = req.body
    let productId = req.params.pid

    productId = Number(productId)
    if (isNaN(productId)) {
        return res.status(400).json({ status: "error", error: "Incorrect data type" })
    }

    try {
        let productDb = await ProductServices.getProductById(productId)
        if (!productDb) {
            return res.status(404).json({ status: "error", error: "product not exist" })
        }
        await ProductServices.updateProduct(productId, title, description, code, price, status, stock, category, thumbnails)
        return res.status(200).json({ status: "success", message: "product updated" })
    } catch (error) {
        error500(res, error)
    }
}

const deleteProduct = async (req, res) => {
    let productId = req.params.pid
    productId = Number(productId)

    if (isNaN(productId)) {
        return res.status(400).json({ status: "error", error: "Incorrect data type" })
    }

    try {
        let productDb = await ProductServices.getProductById(productId)
        if (!productDb) {
            return res.status(404).json({ status: "error", error: "product not found" })
        }
        ProductServices.deleteProduct(productId)
        return res.status(200).json({ status: "success", message: "product deleted" })
    } catch (error) {
        error500(res, error)
    }
}

export default {getProducts,getProductById,createProduct,updateProduct,deleteProduct}