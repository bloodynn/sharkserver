const express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser');
const app = express()
const port = 3000
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(session({
  secret: 'keyboard cat'
}))

let inputList = [];

app.get('/albums',(request, response) => {
  const MongoClient = require('mongodb').MongoClient;
  (async() =>{
    const albums = await MongoClient.connect('mongodb://localhost:27017/myAlbums',{ useNewUrlParser: true });
      const myDb = albums.db('myAlbums');
      try{
        const result = await myDb.collection('myAlbums').find().toArray(function(err, result){
          response.send(result);
        });
      }
      finally{
        albums.close();
      }
  })().catch(err => console.error(err)); 
})

app.post('/session/inputs',(request,response) => {

  console.log(request.body)
  if(inputList.length === 0){
    this.inputList=[]
  }
  this.inputList.push(request.body.input)
  response.set({"Access-Control-Allow-Origin": "*"})
  response.send("reussi")

})

app.get('/session/inputs',(request,response) => {
  const res = this.inputList;
  console.log("get:",res)
  this.inputList = [];
  response.set({"Access-Control-Allow-Origin": "*"})
  response.send(res)

})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})