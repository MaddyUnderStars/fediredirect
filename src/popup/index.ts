import { findRemoteMastodonPost, validateUrl } from "../utils";

document.getElementById("mastodon")?.addEventListener("click", async (event) => {
	event.preventDefault();

	const tab = (await browser.tabs.query({ active: true, currentWindow: true, }))[0];
	const url = validateUrl(tab.url);
	if (!url) return;

	const post = await findRemoteMastodonPost(url);

	browser.tabs.update(undefined, {
		url: post,
	})
})