const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

const database = knex({
	client: "pg",
	connection: {
		host: "127.0.0.1",
		user: "macbookpro",
		password: "",
		database: "face-detective"
	}
});

database
	.select("*")
	.from("users")
	.then(data => {
		console.log(data);
	});

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const saltRounds = 10;

const db = {
	users: [
		{
			id: "1",
			name: "John",
			password: "cookies",
			email: "john@gmail.com",
			entries: 0,
			joined: new Date()
		},
		{
			id: "2",
			name: "Jane",
			password: "apples",
			email: "jane@gmail.com",
			entries: 0,
			joined: new Date()
		}
	]
};

// Root Route
app.get("/", (req, res) => {
	res.send(db.users);
});

// Signin Route
app.post("/signin", (req, res) => {
	// Load hash from your password DB.
	bcrypt.compare(
		"cookies",
		"$2b$10$ZjTgA/oegIotqkXF7wmAL.8plU6cmSgHJiZGz40iLzyrH8r.Mjuqy",
		function(err, res) {
			// res == true
			console.log("first guess", res);
		}
	);

	if (
		req.body.email === db.users[0].email &&
		req.body.password === db.users[0].password
	) {
		res.json(db.users[0]);
	} else {
		res.status(400).json("error logging in");
	}
	res.json("signin");
});

// Register Route
app.post("/register", (req, res) => {
	const { name, email, password } = req.body;
	database("users")
		.returning("*")
		.insert({
			email: email,
			name: name,
			joined: new Date()
		})
		.then(user => {
			res.json(user[0]);
		})
		.catch(err => res.status(400).json("unable to register"));
});

// Profile
app.get("/profile/:id", (req, res) => {
	const { id } = req.params;
	database
		.select("*")
		.from("users")
		.where({ id })
		.then(user => {
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json("Not Found");
			}
		})
		.catch(err => res.status(400).json("error getting user"));
});

app.post("/image", (req, res) => {
	const { id } = req.body;
	let found = false;
	db.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});
	if (!found) {
		res.status(400).json("not found");
	}
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
