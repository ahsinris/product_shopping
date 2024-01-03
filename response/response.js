class Response {
  sucess (req, res, status, data, message) {
    data = data || undefined
    message = message || 'sucess'

    const response = {
      status,
      message,
      data
    }
    return res.status(status).json(response)
  }

  errors (req, res, status, data, message) {
    console.log('error response')
    const response = {
      status,
      message,
      data: data || undefined
    }
    return res.status(status).json(response)
  }
}

export default new Response()
