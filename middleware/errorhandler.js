import Httpcode from '../config/httpcodes.js'

import Message from '../message/message.js'

function errorHandler (err, req, res, next) {
  console.log(err)
  res.status(err.status || Httpcode.HTTP_INTERNAL_SERVER_ERROR).json({
    message: Message[500] + err
  })
}

export default errorHandler
