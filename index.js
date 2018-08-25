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

/*variable globale pour l'input
* à l'avenir, ce sera une variable de session
*/
global.input = null;

/* endpoint de réception de la direction */
app.post('/session/inputs',(request,response) => {
  console.log(request.body)
  input=request.body;
  /*permet les tests en local avec des serveurs en local*/
  response.set({"Access-Control-Allow-Origin": "*"})
  response.send("reussi")

})

/* endpoint de la demande de la direction */
app.get('/session/inputs',(request,response) => {
  const res = input;
  input ={};
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