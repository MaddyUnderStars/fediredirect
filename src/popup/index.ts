import { getHandlersForUrl } from "../lib/index";
import { validateUrl } from "../utils";

document
	.getElementById("mastodon")
	?.addEventListener("click", async (event) => {
		event.preventDefault();

		const tab = (
			await browser.tabs.query({ active: true, currentWindow: true })
		)[0];
		const url = validateUrl(tab.url);
		if (!url) return;

		// TODO: find which software the current tab runs
		// TODO: instead of filtering by what the URL looks like, use the above to just grab the handler ourselves

		const handlers = getHandlersForUrl(url);
		if (!handlers.length) return;

		const handler = handlers[0];

		const post = await handler.findRemote(url);

		browser.tabs.update(undefined, {
			url: post.toString(),
		});
	});
