const Clarifai = require("clarifai");

const app = new Clarifai.App({
	apiKey: "468af070835d428b83af1f0e3f3671b6"
});

const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json("unable to work with api"));
};

const handleImage = (req, res, database) => {
	const { id } = req.body;
	database("users")
		.where("id", "=", id)
		.increment("entries", 1)
		.returning("entries")
		.then(entries => {
			res.json(entries[0]);
		})
		.catch(err => res.status(400).json("unable to process entry"));
};

module.exports = {
	handleImage,
	handleApiCall
};
