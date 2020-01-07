const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const database = knex({
	client: "pg",
	connection: {
		host: "127.0.0.1",
		user: "macbookpro",
		password: "",
		database: "face-detective"
	}
});

const app = express();

// Middleware
app.use(express.json()); // bodyParser
app.use(cors());

const saltRounds = 10;

// Root Route
app.get("/", (req, res) => {
	res.send(db.users);
});

// Signin Route
app.post("/signin", (req, res) => {
	signin.handleSignin(req, res, database, bcrypt);
});

// Register Route
app.post("/register", (req, res) => {
	register.handleRegister(req, res, database, bcrypt, saltRounds);
});

// Profile Route
app.get("/profile/:id", (req, res) => {
	profile.getProfile(req, res, database);
});

// Image Entry Route
app.post("/image", (req, res) => {
	image.handleImage(req, res, database);
});

app.listen(3000, () => {
	console.log("app is running on port 3000");
});
