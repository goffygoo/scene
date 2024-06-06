import express from "express";
import cors from "cors";
import _db from "./util/db.js";
import router from "./routes/index.js";
import initServices from "./service/init.js";

const run = async () => {
	const app = express();
	const PORT = process.env.PORT || 5000;

	app.use(express.json({ limit: "1mb", extended: true }));
	app.use(express.urlencoded({ limit: "1mb", extended: true }));
	app.use(cors());

	await initServices();

	app.use("/api", router);

	app.listen(PORT, () => {
		console.log(`Server starting in port: ${PORT}`);
	});
}

run();