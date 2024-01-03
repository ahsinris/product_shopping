import dbconn from '../db/mysql2.js'
import Httpcode from '../config/httpcodes.js'
import Message from '../message/message.js'

class Service {
  async addproductService (reqdata) {
    const { name, description, price, quantity } = reqdata

    const [result] = await dbconn.query(`insert into products_info (name,description,price,quantity)
        values(?,?,?,?)`, [name, description, price, quantity])
    if (result.length === 0) {
      return {
        sucess: false,
        status: Httpcode.HTTP_BAD_REQUEST,
        message: Message[100]
      }
    }

    return {
      sucess: true
    }
  }
}

export default new Service()
