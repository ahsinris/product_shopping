import dbconn from '../db/mysql2.js'
import Httpcode from '../config/httpcodes.js'
import Message from '../message/message.js'

class Service {
  async updateSevice (reqdata, next) {
    try {
      const { orderId, updateproducts } = reqdata
      const [orders] = await dbconn.query('select mainorderid from mainOrder where mainorderid=?', [orderId])
      if (!orders.length) {
        return {
          sucess: false,
          status: Httpcode.HTTP_NOT_FOUND,
          message: Message[106]
        }
      }
      const [totalproductqunatity] = await dbconn.query('select * from products_info')
      const [currentproduct] = await dbconn.query('select * from orders where order_id=?', [orderId])
      // console.log("total", totalproductqunatity)
      // console.log("current", currentproduct)

      const [customers] = await dbconn.query('select cust_id from mainOrder where mainorderid=?', [orderId])

      // console.log(customers)

      const updatesquantityarray = []
      const updateproductquantity = []
      const createproductarray = []
      const addproductinfoquantity = []
      const deleteorders = []

      for (const product of updateproducts) {
        const productid = product.product_id
        const productquantity = product.quantity

        const findproduct = totalproductqunatity.find(obj => obj.product_id === productid)
        // console.log("___________",findproduct)

        if (!findproduct) {
          return {
            sucess: false,
            status: Httpcode.HTTP_BAD_REQUEST,
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
              status: Httpcode.HTTP_NOT_FOUND,
              message: Message[103]
            }
          }
        }

        const findproduct1 = currentproduct.find(currentprod => currentprod.product_id === productid)

        // console.log("........", findproduct1)
        if (findproduct1) {
          updatesquantityarray.push([productquantity, productid])
          const temp = productquantity - findproduct1.quantity
          updateproductquantity.push([temp, productid])
        } else {
          createproductarray.push([orderId, customers[0].cust_id, productid, productquantity])
          updateproductquantity.push([productquantity, productid])
        }
      }

      // console.log(createproductarray)
      // console.log(updateproductquantity)
      // console.log(updatesquantityarray)

      for (const product of currentproduct) {
        const findproduct = updateproducts.find(updateproduct => updateproduct.product_id === product.product_id)

        if (!findproduct) {
          addproductinfoquantity.push([product.quantity, product.product_id])
          deleteorders.push([orderId, product.product_id])
        }

        // console.log(addproductinfoquantity)
      }

      if (updatesquantityarray.length !== 0) {
        let sql = 'update orders set product_id = case product_id'
        updatesquantityarray.forEach(item => {
          sql += ` when ${item[1]} then ${item[0]} `
        })
        sql += 'end where product_id in ('
        updatesquantityarray.forEach((item, index) => {
          sql += `${item[1]}${index < updatesquantityarray.length - 1 ? ',' : ''}`
        })

        sql += ')'
        await dbconn.query(sql)
      }

      if (updateproductquantity.length !== 0) {
        let sql = 'update products_info set quantity = case product_id '
        updateproductquantity.forEach(item => {
          sql += ` when ${item[1]} then quantity - ${item[0]} `
        })

        sql += 'end where product_id in ('
        updateproductquantity.forEach((item, index) => {
          sql += `${item[1]}${index < updateproductquantity.length - 1 ? ',' : ''}`
        })

        sql += ')'

        await dbconn.query(sql)
      }

      if (createproductarray.length !== 0) {
        await dbconn.query('insert into orders(order_id,customers_id,product_id,quantity)values?', [createproductarray])
      }

      if (addproductinfoquantity.length !== 0) {
        let sql = 'update products_info set quantity = case product_id '
        addproductinfoquantity.forEach(item => {
          sql += `when ${item[1]} then quantity + ${item[0]} `
        })

        sql += 'end where product_id in ('
        addproductinfoquantity.forEach((item, index) => {
          sql += `${item[1]}${index < addproductinfoquantity.length - 1 ? ',' : ''}`
        })

        sql += ')'

        await dbconn.query(sql)
      }

      if (deleteorders.length !== 0) {
        let sql = 'delete from orders where (order_id,product_id) in ('
        deleteorders.forEach((item, index) => {
          sql += `(${item[0]}, ${item[1]})${index < deleteorders.length - 1 ? ',' : ''}`
        })
        sql += ')'
        await dbconn.query(sql)
      }

      return {
        sucess: true,
        message: Message[203]
      }
    } catch (err) {
      next(err)
    }
  }
}

export default new Service()
