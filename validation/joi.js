import joi from 'joi'

/** order validation */

const productSchema = joi.object({
  product_id: joi.number().integer().positive().required(),
  quantity: joi.number().integer().positive().required()
})

/** update order validation */

const updateorderschema = joi.object({
  product_id: joi.number().integer().positive().required(),
  quantity: joi.number().integer().positive().required()
})

class Validation {
  /** add product validation */
  async addproductValidation (req, res, next) {
    try {
      const schema = joi.object({
        name: joi.string().required(),
        description: joi.string().required(),
        price: joi.string().required(),
        quantity: joi.string().required()
      })

      await schema.validateAsync(req.body)
      next()
    } catch (err) {
      next(err)
    }
  }

  /** order validation */

  async orderproductValidation (req, res, next) {
    try {
      const schema = joi.object({
        customersId: joi.number().integer().positive().required(),
        products: joi.array().items(productSchema).min(1).required()
      })

      await schema.validateAsync(req.body)
      next()
    } catch (err) {
      next(err)
    }
  }

  /** update order validation */

  async updateordervalidation (req, res, next) {
    try {
      const schema = joi.object({
        orderId: joi.number().integer().positive().required(),
        updateproducts: joi.array().items(updateorderschema).min(1).required()
      })

      await schema.validateAsync(req.body)
      next()
    } catch (err) {
      next(err)
    }
  }

  /** * user order validation */

  async fetchuserrvalidation (req, res, next) {
    try {
      const schema = joi.object({
        customersId: joi.number().integer().positive().required()
      })

      await schema.validateAsync(req.body)
      next()
    } catch (err) {
      next(err)
    }
  }
}

export default new Validation()
