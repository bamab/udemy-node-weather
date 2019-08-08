const request = require('request')

const forecast = (latitude, longitude, callback) => {
  const url = 'https://api.darksky.net/forecast/e6eb8e5c6f2b321c807b280bb78f26af/' + encodeURIComponent(latitude) + ',' + encodeURIComponent(longitude)

  request({ url, json: true } , (error, { body }) => {
    if (error) {
      callback('Unable to connect to weather service!', undefined)
    } else if (body.error) {
      callback('Unable to find location!')
    } else {
      callback(undefined, {
        summary: body.daily.data[0].summary,
        temperature: body.currently.temperature,
        precip: body.currently.precipProbability
      })
    }
  })
}

module.exports = forecast