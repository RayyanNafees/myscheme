import { Hono } from "hono";
import courses from "./courses.json" with { type: "json" };
import getInfoFromCard from "./student.ts";

const app = new Hono();

app.get("/", async (c) => {
	const enroll = c.req.query("enroll") ?? "";

	const studentInfo = !enroll ? { subjects: [] } : await getInfoFromCard(enroll.toUpperCase());

	const myScheme = !enroll ? [] : studentInfo.subjects
		.filter((i) => courses.find((j) => j.id === i.code))
		.map((i) => ({
			code: i.code,
			name: i.subject,
			date: courses.find((j) => j.id === i.code)?.date as string,
			time: courses.find((j) => j.id === i.code)?.time as string,
		}))
		.sort((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1));

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
					{/* biome-ignore lint/a11y/useSemanticElements: <explanation> */}
					<a role="button" href="https://forms.gle/32u5JZ9Jmv1FD43v7" class="secondary p-0 float-right -mt-12">Report Issue</a>

					<form
						action="/"
						onload="localStorage.getItem('enroll') && window.location.href += '?enroll=' + localStorage.getItem('enroll')"
					>
						<label for="enroll">Enter your enrollment number</label>
						{/* biome-ignore lint/a11y/noRedundantRoles: <explanation> */}
						{/* biome-ignore lint/a11y/useSemanticElements: <explanation> */}
						<fieldset role="group">
							<input type="search" name="enroll" id="enroll" placeholder="e.g, GP4847" onchange="localStorage.setItem('enroll', this.value)" value={enroll} />
							<button
								type="submit"
							// onclick="window.location.href += ('?enroll=' + document.querySelector('input').value) "
							>
								Search
							</button>
						</fieldset>
					</form>

					<table style={{ display: !enroll ? "none" : "table" }}>
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
				{enroll && <form action="https://ctengg.amu.ac.in/web/reg_record.php" method="post" target="_blank" >
					<input type="hidden" name="fac" value={enroll} />
					<input type="hidden" name="sem" value={new Date().getMonth() > 6 ? "odd" : "even"} />
					<input type="hidden" name="submit" value="Download" />
					<button type="submit" class="mb-10">Download Registeration Card</button>
				</form>}
			</body>
		</html>,
	);
});

Deno.serve(app.fetch);
