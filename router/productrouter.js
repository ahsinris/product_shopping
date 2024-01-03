import express from 'express'

import validation from '../validation/joi.js'

import controller from '../controller/productcontroller.js'

const router = express.Router()

router.post('/addproducts', validation.addproductValidation, controller.addProductController)

export default router
