const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const axios = require('axios')
const chartDataAll = require('./mocks/chart-data-all.json')
const chartData1Day = require('./mocks/chart-data-1day.json')
const chartData7Days = require('./mocks/chart-data-7days.json')
const chartData1Month = require('./mocks/chart-data-1month.json')
const chartData1Year = require('./mocks/chart-data-1year.json')

require('dotenv').config()

const app = express()

app.use(morgan('tiny'))
app.use(cors())

app.get('/chart-data', (req, res) => {
  console.log(req.originalUrl, req.query.range)
  const chartDataMap = {
    day: chartData1Day,
    week: chartData7Days,
    month: chartData1Month,
    year: chartData1Year,
    all: chartDataAll
  }

  res.send(chartDataMap[req.query.range] || chartDataMap['day'])
})

app.get('/*', (req,res) => {
    console.log(req.originalUrl)
    let url = `https://pro-api.coinmarketcap.com${req.originalUrl}`
    
    console.log('URL', url)
    axios.get(url,{headers: { 'X-CMC_PRO_API_KEY': req.get('x-cmc_pro_api_key') }})
        .then(response => {
            res.send(response.data)
        })
        .catch(err => {
            console.log(err.response.data)
            res.send(err.response.data)
        })
})

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log('Listening on port ',port)
})
