const express = require("express");
const path = require("path");
const db = require("./database.js");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

//Body-parser here:
app.use(bodyParser.json());

//Serving static files here; also connected to React files;
app.use("/", express.static(path.join(__dirname, "../client/dist")));

//Routes
//Routes-get route
app.get("/spending", (req, res) => {
  db.findSpending
    //   .then(resultArray => console.log({ results: resultArray }));
    .then(resultArray => res.status(200).send({ results: resultArray }))
    .catch(err => {
      res.status(500).send("internal error occurred");
    });
});
//Routes-post route
app.post("/spending", (req, res) => {
  let query = req.body;
  db.insertOneSpending(query)
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).send("an error occurred"));
});

//TODO: implement the update route
//Routes-update route
// app.put("/spending", (req, res)=>{

// })

//Routes-delete route
app.delete("/spending", (req, res) => {
  let query = req.body;
  db.removeOne(query).then(result => res.send(result));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
