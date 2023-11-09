import { RedirectSettings } from "../types/mastodon";
import { createMastodonApp, makeMastodonAuthUrl, validateUrl } from "../utils";

document.getElementById("mastodon")!.addEventListener("submit", async (event) => {
	event.preventDefault();

	const opts = (await browser.storage.local.get()).mastodon as RedirectSettings;

	const data = new FormData(event.target as HTMLFormElement);

	const instance = validateUrl(data.get("instance")?.toString());
	const code = data.get("code")?.toString();
	if (!instance) return;

	if (code) {
		await browser.storage.local.set({
			mastodon: {
				...opts,
				code,
				instance: instance.toString(),
			}
		});

		return;
	}

	const app = await createMastodonApp(instance);

	await browser.storage.local.set({
		mastodon: {
			...opts,
			instance: instance.toString(),
			client_id: app.client_id,
			client_secret: app.client_secret,
		} as RedirectSettings
	})

	browser.tabs.create({
		url: makeMastodonAuthUrl(instance, app).toString(),
	})
})