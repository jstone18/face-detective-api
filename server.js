const express = require("express");

const app = express();

app.use(express.json());

const db = {
	users: [
		{
			id: "1",
			name: "John",
			email: "john@gmail.com",
			password: "foobar123",
			entries: 0,
			joined: new Date()
		},
		{
			id: "2",
			name: "Jane",
			email: "jane@gmail.com",
			password: "foobaz123",
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
	if (
		req.body.email === db.users[0].email &&
		req.body.password === db.users[0].password
	) {
		res.json("success");
	} else {
		res.status(400).json("error logging in");
	}
	res.json("signin");
});

// Register Route
app.post("/register", (req, res) => {
	const { name, email, password } = req.body;
	db.users.push({
		id: "3",
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	});
	res.json(db.users[db.users.length - 1]);
});

// Profile
app.get("/profile/:id", (req, res) => {
	const { id } = req.params;
	let found = false;
	db.users.forEach(user => {
		if (user.id === id) {
			found = true;
			return res.json(user);
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
