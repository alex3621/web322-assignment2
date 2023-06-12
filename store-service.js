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

module.exports.addItem = (itemData)=>{
    return new Promise((resolve,reject)=>{
        if(!itemData.published)
        {
            itemData.published=false;
        }else{
            itemData.published=true;
        }
        itemData.id=items.length+1;
        items.push(itemData);
        resolve(itemData);
    })
};

module.exports.getItemsByCategory = (category)=>{
    result=[];
return new Promise((resolve,reject)=>{
    for(let i=0;i<items.length;i++)
    {
        if(items[i].category==category)
        {
            result.push(items[i]);
        }
    }
    if(result.length==0)
    {
        reject("no results returned");
    }else{
        resolve(result);
    }
})
};


module.exports.getItemsByMinDate = (minDateStr)=>{
    result=[];
    return new Promise((resolve,reject)=>{
        for(let i=0;i<items.length;i++)
        {
            if(new Date(items[i].postDate) >= new Date(minDateStr))
            {
                result.push(items[i]);
            }
        }
        if(result.length==0)
        {
            reject("no results returned");
        }else{
            resolve(result);
        }

    })  
};

module.exports.getItemById = (id)=>{
    return new Promise((resolve,reject)=>{
        for(let i=0;i<items.length;i++)
        {
            if(items[i].id==id)
            {
                resolve(items[i]);
            }
        }
        reject("no result returned");
    })
} 