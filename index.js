const axios = require('axios');
const express = require('express');
let app = new express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var PORT = 4040
app.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});

// REST API = RESTFUL

// request
// -method : GET,POST,PUT,DELETE
// -inputs 
// route
// headers 

// response 
// data
// response type : xml, (json),
// status code 404 = not found 200 success 500 server error
// headers 

app.get('/', (req, res) => {
  res.send('hello from main page');
});

const names = ["omar","huthifa","yahya","hatem","hatem"]

// CRUD operation : create , retrive (findAll,findOne) update (updateOne,updateAll) delete(deleteOne,deleteAll)
// 
app.get('/names/create', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>
        </head>
        <body>
            Create new name
            <form method="post" action="/names">
            <input type="text" name="name" />
            <input type="submit" value="create" />
            </form>
        </body>
        </html>
    `);
});

app.get('/names', (req, res) => {
    const name = req.query.name;
    if(name)
    return res.send(names.filter(n=>n === name));
    res.send(names);
});

app.post('/names', (req, res) => {
    const newName = req.body.name
    if(!newName)
    return res.status(400).send("you have to enter your name");
    names.push(newName)
    res.send(names)
});

// app.put('/names', (req, res) => {
//     const newName = req.body.name
//     if(!newName)
//     return res.status(400).send("you have to enter your name");
//     names.push(newName)
//     res.send(names)
// });

app.put('/names', (req, res) => {
    // const updatedName = req.body.name
    names.forEach((value,index)=>names[index] = `${value} updated`)
    res.send(names)
});

app.put('/names/:id', (req, res) => {
    const updatedName = req.body.name
    const id = req.params.id
    names[id] = updatedName
    res.send(names)
});

app.delete('/names/:id', (req, res) => {
    const id = req.params.id
    names.splice(id,1)
    res.send(names)
});


app.get('/names/:id', (req, res) => {
    const id = parseInt(req.params.id,10)
    console.log(id)
    console.log(typeof id)


    if(Number.isNaN(id))
    return res.status(400).send("you have to enter a number");
    const name = names[id]

    if(!name)
    return res.status(404).send("resource not found");

    // throw Error('error') // force 500 server error status code 

    res.send(name);
});


// =================================================================
// =================================================================
// Products
// =================================================================
// =================================================================
// =================================================================

const products = [
    { id:1,name:'iphone 5s',price:100,images:["image1","image2"]},
    { id:2,name:'oneplus 8t',price:333,images:null}
]
// example of json parsing products[0].images


app.get('/secure_data', (req, res) => {

    // Authorization
    const authorization = req.headers.authorization

    if(!authorization){

        return res.status(401).send("you are not authorized")

    }else{

        if(authorization == 'correctData'){

            // check if user exist in database 
            // if not return meaningfull error message
            return res.send("you are authorized")

        }else{
            return res.status(401).send("you are not authorized")

        }

    }


});

app.get('/products', (req, res) => {
    // const name = req.query.name;
    // if(name)
    // return res.send(names.filter(n=>n === name));
    res.send(products);
});

app.get('/products/:id', (req, res) => {
    const id = req.params.id;
    // if(name)
    // return res.send(names.filter(n=>n === name));
    res.send(products.filter(p=>p.id == id));
});

app.post('/products', (req, res) => {
    const newProduct = req.body;
    // if(name)
    // return res.send(names.filter(n=>n === name));
    products.push(newProduct)
    res.send(products);
});

app.put('/products/:id', (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    const productToUpdateIndex = products.findIndex(p => p.id == id)

    const oldId = products[productToUpdateIndex].id
    products[productToUpdateIndex] = updatedData
    products[productToUpdateIndex].id = oldId
    res.json(products);
});

app.delete('/products/:id', (req, res) => {
    const id = req.params.id;
    const productToUpdateIndex = products.findIndex(p => p.id == id)
    const deletedProducts = products.splice(productToUpdateIndex, 1)
    // // if products wasn't const
    // products = products.filter(p => p.id != id)

    // res.send(products)

    res.send(deletedProducts)
    // res.send(products)
});


axios.get("http://localhost:4040/products")
.then(res => console.log(res.data[0].images))
.catch(err => console.log(err));

// axios.post("http://localhost:4040/products",{name:'data'})
// .then(res => console.log(res.data[0].images))
// .catch(err => console.log(err));

app.get('*', (req, res) => {
  res.status(404).send("route not found");
});