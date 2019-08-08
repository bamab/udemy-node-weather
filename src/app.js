const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

//console.log(__dirname)
//console.log(path.join(__dirname, '../public'))

const app = express()

// Define paths fo Express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Bryan Johnson'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Bryan Johnson'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        name: 'Bryan Johnson',
        message: 'This is the weather app help page...'
    })
})

app.get('/products', (req, res) => {
    console.log(req.query)

    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }

    res.send({
       products: [] 
    })
})

app.get('/weather', (req, res) => {

    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }

    let address = req.query.address

    geocode(address, (error, { latitude, longtitude, location } = {}) => {
        
        if (error) {
            return res.send({ error })
        }
        
        forecast(latitude, longtitude, (error, { summary, temperature, precip }) => {
            if (error) {
                return res.send({ error })
            }
            
            let forecast = summary + ' The current temperature is ' + temperature + ' degrees with ' + precip + '% chance of precipitation.'

            res.send({
                address,
                location,
                forecast
            })
        })
    })

})

app.get('/help/*', (req, res) => {
    res.render('error', {
        title: 'Error',
        name: 'Bryan Johnson',
        message: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('error', {
        title: 'Error',
        name: 'Bryan Johnson',
        message: 'Page not found.'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})