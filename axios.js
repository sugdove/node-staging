const axios = require('axios')

const TIMEOUT = 30000

axios.defaults.timeout = TIMEOUT

module.exports = axios