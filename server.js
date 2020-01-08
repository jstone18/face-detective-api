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
		host: process.env.DATABASE_URL,
		ssl: true
	}
});

const app = express();

// Middleware
app.use(express.json()); // bodyParser
app.use(cors());

const saltRounds = 10;

// Root Route
app.get("/", (req, res) => {
	res.send("it is working!");
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

// Clarifai API Route
app.post("/imageurl", (req, res) => {
	image.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT}`);
});
