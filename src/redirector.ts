import { RedirectSettings } from "./types/mastodon";
import { findRemoteMastodonPost, looksLikeMastodon, validateUrl } from "./utils";

(async () => {
	const url = validateUrl(window.location.href);
	if (!url) return;

	if (!looksLikeMastodon(url))
		return;

	const opts = (await browser.storage.local.get()).mastodon as RedirectSettings;
	if (new URL(opts.instance).origin == url.origin) return;

	const post = await findRemoteMastodonPost(url);

	window.location.href = post;
})();