/*********************************************************************************
*  WEB322 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ______Alex Lin________________ Student ID: __128779220____________ Date: __2023/6/10___________
*
*  Online (Cyclic) URL: https://combative-hen-costume.cyclic.app
*
********************************************************************************/ 

const express = require('express')
const store_service = require('./store-service')
const app = express()
const port = process.env.PORT || 8080
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = multer(); // no { storage: storage } 

cloudinary.config({ 
  cloud_name: 'dbwcihww1', 
  api_key: '384368237456848', 
  api_secret: 'VIC5H8t5Iciyq_J_1HZEWeXnqQI' 
});


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
    res.json(data)
  }).catch((err)=>{
    res.json(err);
  })
});

app.get('/items', (req, res) => {
  const cat = req.query.category;
  const mDate = req.query.minDate;
  if(cat)
  {
    store_service.getItemsByCategory(cat).then((data)=>{
      res.json(data)
    }).catch((err)=>{
      res.json(err);
    })
  }else if(mDate)
  {
    store_service.getItemsByMinDate(mDate).then((data)=>{
      res.json(data)
    }).catch((err)=>{
      res.json(err);
    })
  }else{
    store_service.getAllItems().then((data)=>{
      res.json(data)
    }).catch((err)=>{
      res.json(err);
    })
  }
});

app.get('/items/add', (req, res) => {
  console.log("test");
    res.sendFile(__dirname + "/views/addItem.html")
  });

app.get('/items/:value', (req, res) => {
  const value = parseInt(req.params.value, 10);
  store_service.getItemById(value).then((data)=>{
    res.json(data)
  }).catch((err)=>{
    res.json(err);
  })
});

app.get('/categories', (req, res) => {
    store_service.getCategories().then((data)=>{
      res.json(data)
    }).catch((err)=>{
      res.json(err);
    })
  });



  app.post('/items/add',upload.single("featureImage"),(req,res)=>{
    if(req.file){
      let streamUpload = (req) => {
          return new Promise((resolve, reject) => {
              let stream = cloudinary.uploader.upload_stream(
                  (error, result) => {
                      if (result) {
                          resolve(result);
                      } else {
                          reject(error);
                      }
                  }
              );
  
              streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
      };
  
      async function upload(req) {
          let result = await streamUpload(req);
          console.log(result);
          return result;
      }
  
      upload(req).then((uploaded)=>{
          processItem(uploaded.url);
      });
  }else{
      processItem("");
  }
   
  function processItem(imageUrl){
      req.body.featureImage = imageUrl;
  
      // TODO: Process the req.body and add it as a new Item before redirecting to /items
      store_service.addItem(req.body);
      res.redirect('/items')
  } 
  
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
