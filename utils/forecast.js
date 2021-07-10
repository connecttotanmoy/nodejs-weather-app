const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=94d9d710cffa1a84872ff550a439c0e2&query=' + latitude + ',' + longitude

    request({ url: url, json: true }, (error, response) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (response.body.error) {
            callback('Unable to find location', undefined)
        } else {
            //callback(undefined, response.body.daily.data[0].summary + ' It is currently ' + response.body.current.temperature + ' degress out. There is a ' + response.body.current.precipProbability + '% chance of rain.')
            callback(undefined, response.body.current.weather_descriptions[0] +' ,It is currently ' + response.body.current.temperature+' degress out. There is a ' + response.body.current.precip + '% chance of rain.')
        }
    })
}

module.exports = forecast