import handlers from "../lib/index";
import { RedirectSettings } from "../types/mastodon";
import { validateUrl } from "../utils";

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

	await browser.storage.local.set({
		[handler.type]: {
			code: undefined,
			instance: instance.toString(),
			client_id: app.client_id,
			client_secret: app.client_secret,
		} as RedirectSettings,
	});

	currentlyHandling = handler.type;
	dialog.showModal();

	await browser.tabs.create({
		url: handler.makeAuthUrl(instance, app).toString(),
	});
};

const forms = document.querySelectorAll(
	".handler form",
) as NodeListOf<HTMLFormElement>;
[...forms].forEach(async (x) => {
	x.addEventListener("submit", handler);

	const opts = (await browser.storage.local.get())[
		x.getAttribute("data-type")!
	] as RedirectSettings;

	if (opts.instance)
		(x.elements.namedItem("url") as HTMLInputElement).value = opts.instance;
});

document
	.querySelector("#code_dialog form")!
	.addEventListener("submit", async (event) => {
		event.preventDefault();

		const opts = (await browser.storage.local.get())[
			currentlyHandling
		] as RedirectSettings;

		const data = new FormData(event.target as HTMLFormElement);
		await browser.storage.local.set({
			[currentlyHandling]: {
				...opts,
				code: data.get("code"),
			} as RedirectSettings,
		});

		dialog.close();
	});
