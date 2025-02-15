/* @jsxImportSource npm:hono/jsx */
import { Hono } from "hono";

const app = new Hono();

const courses = (await fetch(
	"https://zhcet-scheme-json-server.vercel.app/even/",
).then((r) => r.json())) as Subject[];

type Subject = {
	id: string;
	course_name: string;
	date: string;
	time: string;
};

app.get("/", async (c) => {
	const enroll = c.req.query("enroll") ?? "GP4519";

	const studentInfo = await fetch(
		`https://rayyan-student.web.val.run?enroll=${enroll.toUpperCase()}`,
	).then((r) => r.json());
	const courseCodes = studentInfo.subjects.map((i: { code: string }) => i.code);

	const myScheme = courses
		.filter((i) => courseCodes.includes(i.id))
		.sort((a, b) => (a.date > b.date ? 1 : -1) + +(a.time > b.time));

	return c.html(
		<html>
			<head>
				<link rel="stylesheet" href="https://unpkg.com/@picocss/pico" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>My ZHCET Scheme</title>
			</head>
			<body>
				<main class="container" style="position:relative;height:100vh;">
					<hgroup>
						<h1>My Scheme</h1>
						<h2>ZHCET Exam Scheme</h2>
					</hgroup>

					<label for="enrollment">Enter your enrollment number</label>
					{/* biome-ignore lint/a11y/noRedundantRoles: <explanation> */}
					{/* biome-ignore lint/a11y/useSemanticElements: <explanation> */}
					<fieldset role="group">
						<input type="search" name="enrollment" placeholder="e.g, GP4847" />
						<button
							type="submit"
							onclick="window.location.href += ('?enroll=' + document.querySelector('input').value) "
						>
							Search
						</button>
					</fieldset>

					<table style={{ display: enroll === "GP4519" ? "none" : "table" }}>
						<caption style="font-size:xx-large;font-weight:bolder;margin-block:2rem">
							Scheme
						</caption>
						<thead>
							<tr>
								<th>Code</th>
								<th>Name</th>
								<th>Date</th>
								<th>Time</th>
							</tr>
						</thead>
						<tbody>
							{myScheme?.map?.((i: Subject, n: number) => (
								<tr key={i.id}>
									<td>{i.id}</td>
									<td>{i.course_name}</td>
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



Deno.serve(app.fetch)
