import service from '../service/fetching.js'

import Httpcode from '../config/httpcodes.js'

import Message from '../message/message.js'

import Response from '../response/response.js'

import logger from '../middleware/logger.js'

class Controller {
  async fetchuserorders (req, res, next) {
    try {
      const result = await service.fetchuserorderServive(req.body)
      if (!result.sucess) {
        logger.error(result.message)
        return Response.errors(req, res, result.status, null, result.message)
      }
      logger.info('sucess', Message[200])
      return Response.sucess(req, res, Httpcode.HTTP_OK, result.data, Message[200])
    } catch (err) {
      logger.error(err)
      next(err)
    }
  }
}

export default new Controller()
