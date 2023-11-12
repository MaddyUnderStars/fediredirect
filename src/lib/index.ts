import { MastodonApplication } from "../types/mastodon";
import { getSettings, validateUrl } from "../utils";

type Application = MastodonApplication; // TODO;

export type Handler = {
	type: string;

	/** Creates an oauth application on the instance */
	createApp: <T extends Application>(instance: URL) => Promise<T>;

	/** Generates the oauth authorize url for our application */
	makeAuthUrl: <T extends Application>(instance: URL, app: T) => URL;

	/** Search for a remote post/profile/etc on our instance */
	findRemote: (url: URL) => Promise<URL>;

	/** Check whether a URL looks like it belongs to this service */
	urlLooksValid: (url: URL) => boolean;
};

export const getHandlersForUrl = (url: URL) => {
	return handlers.filter((x) => x.urlLooksValid(url));
};

export const doRedirect = async (handler?: Handler) => {
	const tab = (
		await browser.tabs.query({ active: true, currentWindow: true })
	)[0];
	const url = validateUrl(tab.url);
	if (!url) return;

	if (!handler) {
		const handlers = getHandlersForUrl(url);
		if (!handlers.length) return;

		// todo: find which software the current tab is running, i.e. mastodon etc
		// TODO: instead of filtering by what the URL looks like, use the above to just grab the handler ourselves

		handler = handlers[0];
	}

	const opts = await getSettings();
	const handleropts = opts.handlers?.[handler.type];
	if (!handleropts?.instance || !handleropts.code) return;
	if (new URL(handleropts.instance).origin == url.origin) return;

	console.log(url);

	const post = await handler.findRemote(url);

	browser.tabs.update(tab.id, {
		url: post.toString(),
	});
};

import mastodon from "./mastodon";
const handlers = [mastodon] as Handler[];
export default handlers;
