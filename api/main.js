const fs = require('fs');
const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'login.html'));

});


app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.post('/login',(req,res) => {
  const username=req.body.login.username;
  const password=req.body.login.password;

  if(username==="admin"&&password==="test123"){
    res.send(JSON.stringify({success:true}));
    res.sendStatus(200);


  }
  else{
    res.send(JSON.stringify({success:false}));
    res.sendStatus(401);
  }
});

app.post('/search',(req,res) => {
 const search=req.body.search;

});

app.post('/submit_recipe',(req,res) => {
const recipe=req.body.recipe;
const ingredients=recipe.ingredients;
console.log(ingredients);
  
});

app.get('/create_recipe',(req,res) => {
    res.sendFile(path.join(__dirname,'create_recipe.html'));
});

app.get('/admin',(req,res) => {
  res.sendFile(path.join(__dirname,'admin.html'));
});

app.get('/navbar.js',(req,res) => {
  res.sendFile(path.join(__dirname,'navbar.js'));
});

const port=1000;
app.listen(port, () => {
  console.log('Server listening on port${}'+port);
});
