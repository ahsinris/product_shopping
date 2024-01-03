import express from 'express'

import validation from '../validation/joi.js'

import controller from '../controller/ordercontroller.js'

const router = express.Router()

router.post('/placeorder', validation.orderproductValidation, controller.orderProductController)

export default router
