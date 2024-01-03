import express from 'express'

import validation from '../validation/joi.js'

import controller from '../controller/fetching.js'

const router = express.Router()

router.get('/fetchdetails', validation.fetchuserrvalidation, controller.fetchuserorders)

export default router
