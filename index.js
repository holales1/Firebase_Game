const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./permissionsGame.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fir-game-c98b7.firebaseio.com"
  });

const db = admin.firestore();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({origin:true}));



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//Routes
app.get('/hello-world',(req,res)=>{
    return res.status(200).send('Hello World!');
});

//Create
app.post('/api/create',(req,res)=>{
    (async ()=> {
      try
      {
          await db.collection('games').doc('/'+req.body.id+'/')
          .create({
            name:req.body.name,
            description:req.body.description,
            genre:req.body.genre,
            dlc:req.body.dlc,
            price:req.body.price
          })
          return res.status(200).send();
      }catch(error){
        console.log(error);
        return res.status(500).send(error);
      }
    })();
  });

  //Read
app.get('/api/read/:id',(req,res)=>{
    (async ()=> {
      try
      {
          const document= db.collection('games').doc(req.params.id);
          let product = await document.get();
          let response = product.data();
  
          return res.status(200).send(response);
      }catch(error){
        console.log(error);
        return res.status(500).send(error);
      }
    })();
  });


  app.get('/api/read',(req,res)=>{
    (async ()=> {
      try
      {
          let query= db.collection('games');
          let response=[];
  
          await query.get().then(querySnapshot=>{
            let docs =querySnapshot.docs;
            for (let doc of docs)
            {
              const selectedItem={
                id:doc.id,
                name:doc.data().name,
                description:doc.data().description,
                genre:doc.data().genre,
                dlc:doc.data().dlc,
                price:doc.data().price
              };
              response.push(selectedItem);
            }
            return response;
          });
          return res.status(200).send(response);
      }catch(error){
        console.log(error);
        return res.status(500).send(error);
      }
    })();
  });

  //Update
app.put('/api/update/:id',(req,res)=>{
    (async ()=> {
      try
      {
          const document=db.collection('games').doc(req.params.id);
          await document.update({
            name:req.body.name,
            description:req.body.description,
            genre:req.body.genre,
            dlc:req.body.dlc,
            price:req.body.price
          })
          return res.status(200).send();
      }catch(error){
        console.log(error);
        return res.status(500).send(error);
      }
    })();
  });

  //Delete
app.delete('/api/delete/:id',(req,res)=>{
    (async ()=> {
      try
      {
          const document=db.collection('games').doc(req.params.id);
          await document.delete();
          return res.status(200).send();
      }catch(error){
        console.log(error);
        return res.status(500).send(error);
      }
    })();
  });
exports.app=functions.https.onRequest(app);