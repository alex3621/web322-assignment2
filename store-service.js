const fs = require("fs"); 

items =[];
categories = [];

module.exports.initialize = ()=>{
return new Promise((resolve,reject)=>{
    fs.readFile('./data/items.json', 'utf8', (err, data) => {
        if (err){
            reject(err);
        }else{
            items = JSON.parse(data);
            fs.readFile('./data/categories.json','utf8',(err,data)=>{
                if(err)
                {
                    reject(err)
                }else{
                    categories = JSON.parse(data);
                    resolve();
                }
            })
        }
   });
   })
};  

module.exports.getAllItems = () =>{
    return new Promise((resolve,reject)=>{
        if(items.length==0)
        {
            reject('items array is empty')
        }else{
            resolve(items)
        }
    })
};

module.exports.getPublishedItems= () =>{
    return new Promise((resolve,reject)=>{
        let pubItems = [];
        for (let i=0;i<items.length;i++)
        {
            if(items[i].published==true)
            {
                pubItems.push(items[i]);
            }
        }
        if(pubItems.length==0)
        {
            reject("no published items");
        }else{
            resolve(pubItems);
        }
    });
}

module.exports.getCategories= () =>{
    return new Promise((resolve,reject)=>{
        if(categories.length==0)
        {
            reject('categories array is empty')
        }else{
            resolve(categories)
        }
    })
};

