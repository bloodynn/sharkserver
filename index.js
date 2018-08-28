const express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser');
const app = express()
const port = 3000

const ON_WAIT = "waiting"

const ON_PLAY = "playing"
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(session({
  secret: 'keyboard cat'
}))

/*variable globale pour l'input
* à l'avenir, ce sera une variable de session
*/
global.input = [];

global.game = {
  state : ON_WAIT,
  players: 0
};

/*endpoint enregistrement du joueur*/
app.post('/session/player',(request,response) => {
  
  required.session.name = response.body.name;
  if (game.player1 !== null){
    game.player1 = response.body.name;
    required.session.playerNumber = 1;
  }
  else{
    game.player2 = response.body.name;
    required.session.playerNumber = 2;
  }
  response.set({"Access-Control-Allow-Origin": "*"})
  response.send("Joueur numero:",required.session.playerNumber);
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
  if(players <= 2){
    if(!required.session.playerNumber){
      game.players++;
      required.session.playerNumber = players;
    }
    input[required.session.playerNumber-1]=request.body;
    response.set({"Access-Control-Allow-Origin": "*"})
    response.send("reussi")
    console.log("post:",request.body)
  }
  else{
    response.set({"Access-Control-Allow-Origin": "*"})
    response.send("plus d'espace joueur disponibles")
  }
  
  

})

/* endpoint de la demande de la direction */
app.get('/session/inputs',(request,response) => {
  const res = input;
  // input ={};
  console.log("get:",res);
  /*permet les tests en local avec des serveurs en local*/
  response.set({"Access-Control-Allow-Origin": "*"});
  response.send(res);

})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
})