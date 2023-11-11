import handlers from "../lib/index";
import { getSettings, setSettings, validateUrl } from "../utils";

let currentlyHandling: string;
const dialog = document.getElementById("code_dialog") as HTMLDialogElement;

const handler = async (event: SubmitEvent) => {
	event.preventDefault();

	const type = (event.target as HTMLElement).getAttribute("data-type");
	const handler = handlers.find((x) => x.type == type);
	if (!handler) return alert("you broke it");

	const data = new FormData(event.target as HTMLFormElement);

	const instance = validateUrl(data.get("url")?.toString());
	if (!instance) return;

	const app = await handler.createApp(instance);

	await setSettings({
		handlers: {
			[handler.type]: {
				code: undefined,
				instance: instance.toString(),
				client_id: app.client_id,
				client_secret: app.client_secret,
			},
		},
	});

	currentlyHandling = handler.type;
	dialog.showModal();

	await browser.tabs.create({
		url: handler.makeAuthUrl(instance, app).toString(),
	});
};

const handlerforms = document.querySelectorAll(
	".handler form",
) as NodeListOf<HTMLFormElement>;
[...handlerforms].forEach(async (x) => {
	x.addEventListener("submit", handler);

	const opts = (await getSettings())?.handlers?.[
		x.getAttribute("data-type")!
	];

	if (opts?.instance)
		(x.elements.namedItem("url") as HTMLInputElement).value = opts.instance;
});

document
	.querySelector("#code_dialog form")!
	.addEventListener("submit", async (event) => {
		event.preventDefault();

		const opts = (await getSettings())?.handlers?.[currentlyHandling];

		const data = new FormData(event.target as HTMLFormElement);
		await setSettings({
			handlers: {
				[currentlyHandling]: {
					code: data.get("code")?.toString(),
				},
			},
		});

		dialog.close();
	});

const settings = document.querySelectorAll(
	"#settings input",
) as NodeListOf<HTMLInputElement>;
[...settings].forEach(async (x) => {
	const key = x.getAttribute("name");
	if (!key) return alert("you forgot to set the input name");

	(x as HTMLInputElement).addEventListener("change", async (event) => {
		const target = event.target as HTMLInputElement;
		let value: string | boolean = target.value;
		if (target.getAttribute("type") == "checkbox") value = target.checked;
		await setSettings({ [key]: value });
	});

	const settings = await getSettings();
	const value = settings[key as keyof typeof settings]; // silly
	if (x.getAttribute("type") == "checkbox") x.checked = value as boolean;
	else x.value = value as any as string;
});
