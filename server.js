const express = require("express");

const app = express();

app.get("/", (req, res) => {
	res.send("this is working...");
});

app.listen(3000, () => {
	console.log("app is running on port 3000");
});

/*
/ --> GET response = this is working
/signin --> POST(to hide password) response = success/fail
/register --> POST response = user object
/profile/:userId --> GET response = user
/image --> PUT response = updated user
*/
