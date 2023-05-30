/*********************************************************************************
*  WEB322 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ______Alex Lin________________ Student ID: __128779220____________ Date: __2023/5/30______________
*
*  Online (Cyclic) URL: 
*
********************************************************************************/ 

const express = require('express')
const store_service = require('./store-service')
const app = express()
const port = process.env.PORT || 8080

app.use(express.static('public')); 
app.set('view engine', 'ejs');

app.get('/', (req, res) => {

  res.redirect("/about")
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + "/views/about.html")
  });

app.get('/shop', (req, res) => {
  store_service.getPublishedItems().then((data)=>{
    res.send(data)
  }).catch((err)=>{
    return {'message': err}
  })
});

app.get('/items', (req, res) => {
  store_service.getAllItems().then((data)=>{
    res.send(data)
  }).catch((err)=>{
    return {'message': err}
  })
});

app.get('/categories', (req, res) => {
    store_service.getCategories().then((data)=>{
      res.send(data)
    }).catch((err)=>{
      return {'message': err}
    })
  });


  app.get('*', function(req, res){
    res.send('Page not found, check URL', 404);
  });



function onHTTPstart(){
  console.log("server started on port: " + port)
}

store_service.initialize().then(function(){
  app.listen(port,onHTTPstart);
}).catch(function(err){
  console.log("unable to start" + err)
})


app.use((req,res)=>{
  res.status(404).send("Page does not exist")
})

