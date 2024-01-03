import dbconn from '../db/mysql2.js'
import Httpcode from '../config/httpcodes.js'
import Message from '../message/message.js'

class Service {
  async fetchuserorderServive (reqdata) {
    const { customersId } = reqdata

    const [iscustomerexist] = await dbconn.query('select * from customers where customers_id=?', [customersId])

    console.log(iscustomerexist)

    if (!iscustomerexist.length) {
      return {
        sucess: false,
        status: Httpcode.HTTP_NOT_FOUND,
        message: Message[104]
      }
    }

    const [result] = await dbconn.query('select orders.quantity,name,description,price from  products_info  join orders on orders.customers_id=? and orders.product_id = products_info.product_id ', [customersId])
    console.log(result)

    if (!result.length) {
      return {
        sucess: false,
        status: Httpcode.HTTP_BAD_REQUEST,
        message: Message[105]
      }
    }

    return {
      sucess: true,
      data: result
    }
  }
}

export default new Service()
