const express = require('express')
const path = require('path')
const app = express()
const hbs = require('hbs')
const geocode = require('../utils/geocode')
const forecast = require('../utils/forecast')

constDirpath = path.join(__dirname,'../public')
viewPath = path.join(__dirname,'../templates/views')
partialPath = path.join(__dirname,'../templates/partials')

app.set('view engine', 'hbs');
app.set('views',viewPath)
app.use(express.static(constDirpath))
hbs.registerPartials(partialPath)


app.get('/weather',(req,res)=>{
    if(!req.query.address)
    {
        return res.send({'error':'Address required'})
    }

    geocode(req.query.address,(error,response)=>{

        if(error)
        {
            return res.send(error)
        }

        forecast(response.latitude,response.longitude,(error,forecastData)=>{
            if(error)
            {
                return res.send(error)
            }

            res.send({
                forecast: forecastData,
                location:response.location,
                address: req.query.address
            })

            /*res.render('index',{
                'title':'Weather App',
                'name':'Index Page',
                forecast: forecastData,
                location:response.location,
                address: req.query.address
            })*/
        })
        

        

    })
})

app.get('', (req, res) => {
    res.render('index',{
        'title':'Weather App',
        'name':'Index Page'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        'title':'Weather App',
        'name':'About Page'
    })
})

app.get('*',(req,res)=>{
    res.render('error',{
        'title':'Weather App',
        'name':'404 page'
    })
})

app.listen(3000,()=>{
    console.log('Server lis listening 3000 port')
})