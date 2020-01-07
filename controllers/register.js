const handleRegister = (req, res, database, bcrypt, saltRounds) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		return res.status(400).json("incorrect form submission");
	}
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
};

module.exports = {
	handleRegister
};
