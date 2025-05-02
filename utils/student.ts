import { pdfText } from "jsr:@pdf/pdftext";

export const parseRegistrationCard = (dataArr: string[], enroll?: string) => {
	const subs = dataArr
		.map((s) =>
			s.match(
				/^(\d{1,2})\s?([A-Z]{2,3})\s?([A-Z]{3}\d{4})\s?([A-z\s\&\-,\.\(\)]+)\s?([a-d])\s?(\d+\.\d+)$/,
			),
		)
		.filter((i) => i !== null);

	const [course, branch] = dataArr[2].split(": ");
	const [_class, sno] = dataArr[4].split(": ")[1].split("-");

	const faculty = dataArr[3].match(/Faculty Number\: ([A-Z0-9]{10})/)?.[1];
	const enrollment =
		enroll || dataArr[3].match(/Enrolment Number\: ([A-Z0-9]{6})/)?.[1];
	const hall = dataArr[3].match(/Hall\: ([A-Z]{2})/)?.[1];

	console.log(
		`${subs.length} Subjects parsed in regsteration card of ${enrollment}`,
	);
	return {
		subjects: subs.map((s) => ({
			serial: s[1],
			category: s[2],

			code: s[3],
			subject: s[4],
			mode: s[5],
			credits: +s[6],
		})),
		college: dataArr[0],
		course,
		branch,
		name: dataArr[5].split(": ")[1],
		class: _class,
		serial: sno,
		faculty,
		enrollment,
		hall,
	};
};

export default async function (enroll: string) {
	if (!/[A-z]{2}\d{4}/.test(enroll))
		throw new Error("Invalid enrollment number");
	const sem = new Date().getMonth() > 6 ? "odd" : "even";
	const file = await fetch(
		`https://ctengg.amu.ac.in/web/reg_record_${sem}.php`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				fac: enroll.toUpperCase(),
				submit: "Download",
			}),
		},
	).then((r) => r.arrayBuffer());

	const data = await pdfText(file);
	const dataArr = data[0].split("\n");
	console.log(dataArr);

	return parseRegistrationCard(dataArr);
}

export type StudentInfo = Awaited<ReturnType<typeof parseRegistrationCard>>;
