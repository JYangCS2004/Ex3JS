const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let test = "solver -d data/ wbowwowyo rowgggyyo bbbrrwgog yrobbbrww gggyoobyb rrygywrry";
const start = "solver -d data/ ";

app.post("/solve", (req, res) => {
  const json = req.body;
  const command = start + json.algo;

  exec(command, (error, stdout, stderr) => {
    let leftB = stdout.replaceAll("(", "");
    let rightB = leftB.replaceAll(")", "");

    //console.log(rightB);
    res.json({ solution : rightB });
  });
});


app.listen(port, () => {
  console.log('Server running on port ' + port);
});