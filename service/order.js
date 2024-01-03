import dbconn from '../db/mysql2.js'
import Httpcode from '../config/httpcodes.js'
import Message from '../message/message.js'

class Service {
  async orderproductService (reqdata) {
    const { customersId, products } = reqdata

    const [allproducts] = await dbconn.query('select * from products_info')

    const [customers] = await dbconn.query('select * from customers where customers_id=?', [customersId])

    if (!customers.length) {
      return {
        sucess: false,
        status: Httpcode.HTTP_NOT_FOUND,
        message: Message[104]
      }
    }

    for (const product of products) {
      const productid = product.product_id
      const productquantity = product.quantity

      const findproduct = allproducts.find(obj => obj.product_id === productid)
      // console.log(findproduct)

      if (!findproduct) {
        return {
          sucess: false,
          status: Httpcode.HTTP_OK,
          message: Message[101]
        }
      }

      if (findproduct.quantity - productquantity < 0) {
        if (findproduct.quantity === 0) {
          return {
            sucess: false,
            status: Httpcode.HTTP_NOT_FOUND,
            message: Message[102]
          }
        } else {
          return {
            sucess: false,
            status: Httpcode.HTTP_BAD_REQUEST,
            message: Message[103]
          }
        }
      }
    }

    const orders = []
    const reducequantity = []

    const [result] = await dbconn.query('insert into mainOrder(order_status,cust_id) values(\'order placed\',?)', [customersId])
    // console.log(result.insertId)
    const orderid = result.insertId

    for (const product of products) {
      const productid = product.product_id

      // console.log(productid)
      const productquantity = product.quantity

      const orderInsert = [orderid, customersId, productid, productquantity]
      orders.push(orderInsert)

      const subtractquantity = [productquantity, productid]
      reducequantity.push(subtractquantity)
    }

    // console.log(reducequantity)

    await dbconn.query('insert into orders(order_id,customers_id,product_id,quantity) values ?', [orders])

    let sql = 'UPDATE products_info SET quantity = CASE product_id '

    reducequantity.forEach(item => {
      sql += `WHEN ${item[1]} THEN quantity - ${item[0]} `
    })

    sql += 'END WHERE product_id IN('
    reducequantity.forEach((item, index) => {
      sql += `${item[1]}${index < reducequantity.length - 1 ? ',' : ''}`
    })
    sql += ')'

    await dbconn.query(sql)

    return {
      sucess: true
    }
  }
}

export default new Service()
