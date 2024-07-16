import 'dotenv/config';
import express from "express";
import cors from "cors";
import _db from "./util/db.js";
import router from "./routes/index.js";
import webhooks from "./routes/webhooks/index.js";
import initServices from "./service/init.js";
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import https from "https";
import fs from "fs";

initializeApp({ credential: applicationDefault() });

const run = async () => {
	const app = express();
	const PORT = process.env.PORT || 5000;

	app.use("/webhooks", webhooks);

	app.use(express.json({ limit: "1mb", extended: true }));
	app.use(express.urlencoded({ limit: "1mb", extended: true }));
	app.use(cors());

	await initServices();

	app.get("/", (_, res) => res.sendStatus(200));
	app.use("/api", router);

	if (process.env.NODE_ENV === 'production') {
		const httpsOptions = {
			key: fs.readFileSync('cert/baljeetkode.private.key'),
			cert: fs.readFileSync('cert/baljeetkode.certificate.crt'),
			ca: fs.readFileSync('cert/baljeetkode.ca.crt'),
		};
		https.createServer(httpsOptions, app).listen(PORT);
		console.log(`Server starting in port: ${PORT}`);
	} else {
		app.listen(PORT, () => {
			console.log(`Server starting in port: ${PORT}`);
		});
	}
}

run();