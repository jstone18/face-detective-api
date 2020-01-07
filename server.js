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

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const saltRounds = 10;

// Root Route
app.get("/", (req, res) => {
	res.send(db.users);
});

// Signin Route
app.post("/signin", (req, res) => {
	database
		.select("email", "hash")
		.from("login")
		.where("email", "=", req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			console.log(isValid);
			if (isValid) {
				return database
					.select("*")
					.from("users")
					.where("email", "=", req.body.email)
					.then(user => {
						res.json(user[0]);
					})
					.catch(err => res.status(400).json("unable to get user"));
			} else {
				res.status(400).json("wrong email and password combination");
			}
		})
		.catch(err => {
			res.status(400).json("wrong crendentials");
		});
});

// Register Route
app.post("/register", (req, res) => {
	const { name, email, password } = req.body;
	const hash = bcrypt.hashSync(password, saltRounds);
	database
		// Create a transaction for more than 2 commits at once to db
		.transaction(trx => {
			// use trx object instead of 'database' object to perform operations
			trx
				// insert into 'login' db
				.insert({
					hash: hash,
					email: email
				})
				.into("login")
				// return email
				.returning("email")
				.then(loginEmail => {
					// use loginEMail to return another trx transaction object
					return (
						trx("users")
							.returning("*")
							// insert into users db
							.insert({
								email: loginEmail[0],
								name: name,
								joined: new Date()
							})
							.then(user => {
								// respond with json
								res.json(user[0]);
							})
					);
				})
				// commit to db or catch any errors and rollback
				.then(trx.commit)
				.catch(trx.rollback);
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
	database("users")
		.where("id", "=", id)
		.increment("entries", 1)
		.returning("entries")
		.then(entries => {
			res.json(entries[0]);
		})
		.catch(err => res.status(400).json("unable to process entry"));
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
