import { MastodonApplication } from "../types/mastodon";

type Application = MastodonApplication;	// TODO;

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
}

export const getHandlersForUrl = (url: URL) => {
	return handlers.filter(x => x.urlLooksValid(url));
}

import mastodon from "./mastodon";
const handlers = [
	mastodon
] as Handler[];
export default handlers;