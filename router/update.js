import express from 'express'

import validation from '../validation/joi.js'

import controller from '../controller/update.js'

const router = express.Router()

router.put('/updateorders', validation.updateordervalidation, controller.updateController)

export default router
