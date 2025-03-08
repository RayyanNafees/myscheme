import { Hono } from "hono";
import courses from "./courses.json" with { type: "json" };
import getInfoFromCard from "./student.ts";

const app = new Hono();

app.get("/", async (c) => {
	const enroll = c.req.query("enroll") ?? "GP4519";

	const studentInfo = await getInfoFromCard(enroll.toUpperCase());

	const myScheme = studentInfo.subjects
		.filter((i) => courses.find((j) => j.id === i.code))
		.map((i) => ({
			code: i.code,
			name: i.subject,
			date: courses.find((j) => j.id === i.code)?.date as string,
			time: courses.find((j) => j.id === i.code)?.time as string,
		}))
		.sort(
			(a, b) =>
				(new Date(a.date) > new Date(b.date) ? 1 : -1) ,
		);

		console.log({myScheme});

	return c.html(
		<html lang="en">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="stylesheet" href="https://unpkg.com/@picocss/pico" />
				<script src="https://unpkg.com/@unocss/runtime" />
				<title>My ZHCET Scheme</title>
			</head>
			<body>
				<main class="container">
					<hgroup>
						<h1>My Scheme</h1>
						<h2>ZHCET Exam Scheme</h2>
					</hgroup>

					<form action="/">
						<label for="enrollment">Enter your enrollment number</label>
						{/* biome-ignore lint/a11y/noRedundantRoles: <explanation> */}
						{/* biome-ignore lint/a11y/useSemanticElements: <explanation> */}
						<fieldset role="group">
							<input
								type="search"
								name="enrollment"
								placeholder="e.g, GP4847"
							/>
							<button
								type="submit"
							// onclick="window.location.href += ('?enroll=' + document.querySelector('input').value) "
							>
								Search
							</button>
						</fieldset>
					</form>

					<table >
						<caption class="text-2xl font-bold my-10">Scheme</caption>
						<thead>
							<tr>
								<th>Code</th>
								<th>Name</th>
								<th>Date</th>
								<th>Time</th>
							</tr>
						</thead>
						<tbody>
							{myScheme?.map?.((i) => (
								<tr key={i.code}>
									<td>{i.code}</td>
									<td>{i.name}</td>
									<td>{i.date}</td>
									<td>{i.time}</td>
								</tr>
							))}
						</tbody>
					</table>
					<br />
					<br />
					<footer style="position:fixed;bottom:0; width:100%;text-align:center; background-color:#13171f; padding:0.5rem">
						<small>
							Built with 🔥 by{" "}
							<a href="https://rayyano.vercel.app">
								<i>Diggaj</i>
							</a>
						</small>
					</footer>
				</main>
			</body>
		</html>,
	);
});

Deno.serve(app.fetch);
