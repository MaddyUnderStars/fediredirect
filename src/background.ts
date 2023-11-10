import { getHandlersForUrl } from "./lib/index";
import { RedirectSettings } from "./types/mastodon";
import { validateUrl } from "./utils";

const handler = async () => {
	const tab = (
		await browser.tabs.query({ active: true, currentWindow: true })
	)[0];
	const url = validateUrl(tab.url);
	if (!url) return;

	const handlers = getHandlersForUrl(url);
	if (!handlers.length) return;

	// todo: find which software the current tab is running, i.e. mastodon etc

	const handler = handlers[0];

	const opts = (await browser.storage.local.get())[
		handler.type
	] as RedirectSettings;
	if (new URL(opts.instance).origin == url.origin) return;

	const post = await handler.findRemote(url);

	browser.tabs.update(tab.id, {
		url: post.toString(),
	});
};

// browser.tabs.onCreated.addListener(handler);
// browser.tabs.onUpdated.addListener(handler);

browser.webNavigation.onBeforeNavigate.addListener(handler);
