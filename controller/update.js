import service from '../service/update.js'

import Httpcode from '../config/httpcodes.js'

import Response from '../response/response.js'

import logger from '../middleware/logger.js'

import Message from '../message/message.js'

class Controller {
  async updateController (req, res, next) {
    try {
      const result = await service.updateSevice(req.body)

      if (!result.sucess) {
        logger.error(result.message)
        return Response.errors(req, res, result.status, null, result.message)
      }
      logger.info('sucess', Message[200])

      return Response.sucess(req, res, Httpcode.HTTP_OK, result.data, result.message)
    } catch (err) {
      logger.error(err)
      next(err)
    }
  }
}

export default new Controller()
