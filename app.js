import express from 'express'

/** routes */

import productsrouter from './router/productrouter.js'

import orderproducts from './router/orderproduct.js'

import updateproducts from './router/update.js'

import fetchuserorders from './router/fetchapi.js'

import errorHandler from './middleware/errorhandler.js'

const app = express()

app.use(express.json())

/** use the errorhandler in app */
app.use(errorHandler)

/** use the routes in app */

app.use(productsrouter)
app.use(orderproducts)
app.use(updateproducts)
app.use(fetchuserorders)

app.listen(process.env.PORT, () => {
  console.log(`port listned at ${process.env.PORT}`)
})
