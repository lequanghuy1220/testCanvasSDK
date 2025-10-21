require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
 
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
 
app.get("/", (req, res) => {
  res.send("Salesforce Canvas Demo is running.");
});
 
// Canvas entry point
app.post("/canvas", (req, res) => {
  try {
    const signedRequest = req.body.signed_request;
    const [encodedSig, payload] = signedRequest.split(".");
 
    // Decode and verify
    const decoded = jwt.verify(signedRequest, process.env.CANVAS_CONSUMER_SECRET, {
      algorithms: ["HS256"],
    });
 
    const context = decoded.context;
    const oauth = decoded.client;
    const user = decoded.context.user;
 
    res.render("index", { context, user, oauth });
  } catch (err) {
    res.render("error", { message: err.message });
  }
});
 
// Heroku port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Canvas Demo running on port ${PORT}`));