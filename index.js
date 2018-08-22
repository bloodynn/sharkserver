const express = require('express')
const app = express()
const port = 3000

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

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})