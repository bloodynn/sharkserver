const express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser');


const app = express()
const port = 3000

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly:false,
    expires:false
}
}))

/*variable globale pour l'input
* à l'avenir, ce sera une variable de session
*/
//global.input = [];

const ON_WAIT = "waiting"
const ON_PLAY = "playing"

global.game = {
  state : ON_WAIT,
  players: 0
};

/*endpoint enregistrement du joueur*/
app.post('/session/player',(request,response) => {
  
  request.session.name = response.body.name;
  if (game.player1 !== null){
    game.player1 = response.body.name;
    request.session.playerNumber = 1;
  }
  else{
    game.player2 = response.body.name;
    request.session.playerNumber = 2;
  }
  response.set({"Access-Control-Allow-Origin": "*"})
  response.send("Joueur numero:",request.session.playerNumber);
})

/*endpoit de la demande d'état de la partie*/
app.get('/session/state',(request,response) => {
  response.set({"Access-Control-Allow-Origin": "*"});
  response.send(game.state);
})

/*endpoit de la demande de la partie*/
app.get('/session/state',(request,response) => {
  response.set({"Access-Control-Allow-Origin": "*"});
  response.send(input);
})

/* endpoint de réception de la direction */
app.post('/session/inputs',(request,response) => {
  if(game.players < 2){
    if(!request.session.playerNumber){
      console.log("player",request.session.playerNumber)
      game.players++;
      request.session.playerNumber = game.players;
      console.log("here comes a new challenger")
      console.log(request.session)
    }
    const MongoClient = require('mongodb').MongoClient;
    input = (async() =>{
    const game = await MongoClient.connect('mongodb://localhost:27017/sharkgamedb',{ useNewUrlParser: true });
      const myDb = game.db('sharkgamedb');
      try{
        const result = await myDb.collection('sharkgamedb').update({'player':request.session.playerNumber},{$set:{'input':request.body}})
      }
      finally{
        game.close();
      }
    })().catch(err => console.error(err));
    //input[request.session.playerNumber-1]=request.body;
    request.session.save()
    response.set('Access-Control-Allow-Credentials', 'true');
    response.set({"Access-Control-Allow-Origin":  request.headers.origin})
    response.send("reussi")
    console.log("post:",request.body)
  }
  else{
    request.session.save()
    response.set('Access-Control-Allow-Credentials', 'true');
    response.set({"Access-Control-Allow-Origin": request.headers.origin})
    response.send("plus d'espace joueur disponibles")
  }
})

/* endpoint de la demande de la direction */
app.get('/session/inputs',(request,response) => {
   const MongoClient = require('mongodb').MongoClient;
   input = (async() =>{
    const game = await MongoClient.connect('mongodb://localhost:27017/sharkgamedb',{ useNewUrlParser: true });
      const myDb = game.db('sharkgamedb');
      try{

        const input = await myDb.collection('sharkgamedb').find().toArray(function(err, result){
        });
        console.log(input);
      }
      finally{
        game.close();
      }
  })().catch(err => console.error('error',err)); 
  const res = {
    inputs: input,
    fishRandom : Math.random()
  }
  // input ={};
  console.log("get:",res);
  /*permet les tests en local avec des serveurs en local*/
  response.set('Access-Control-Allow-Credentials', 'true');
  response.set({"Access-Control-Allow-Origin": request.headers.origin});
  response.send(res);

})

app.get('/albums',(request, response) => {
  const MongoClient = require('mongodb').MongoClient;
  result = (async() =>{
    const game = await MongoClient.connect('mongodb://localhost:27017/sharkgamedb',{ useNewUrlParser: true });
      const myDb = game.db('sharkgamedb');
      try{
        const result = await myDb.collection('sharkgamedb').find().toArray(function(err, result){
        });
      }
      finally{
        game.close();
      }
  })().catch(err => console.error(err)); 
/*permet les tests en local avec des serveurs en local*/
response.set('Access-Control-Allow-Credentials', 'true');
response.set({"Access-Control-Allow-Origin": request.headers.origin});
response.send(result);
})


app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
})