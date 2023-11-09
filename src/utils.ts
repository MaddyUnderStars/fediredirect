import { MastodonApplication, MastodonSearchResults, RedirectSettings } from "./types/mastodon";

const MASTODON_REDIRECT_URI = "urn:ietf:wg:oauth:2.0:oob";

export const createMastodonApp = async (instance: URL) => {
	const data = new FormData();
	data.append("client_name", "FediRedirect");
	data.append("redirect_uris", MASTODON_REDIRECT_URI);
	data.append("scopes", "read:search");
	data.append("website", "https://github.com/MaddyUnderStars/fediredirect");
	const res = await fetch(`${instance.origin}/api/v1/apps`, {
		method: "POST",
		body: data,
	});

	const json = await res.json();

	return json as MastodonApplication;
}

export const makeMastodonAuthUrl = (instance: URL, app: MastodonApplication) => {
	const ret = new URL(instance);
	ret.pathname = "/oauth/authorize";
	ret.searchParams.append("client_id", app.client_id);
	ret.searchParams.append("scope", "read:search");
	ret.searchParams.append("redirect_uri", MASTODON_REDIRECT_URI);
	ret.searchParams.append("response_type", "code");
	return ret;
}

/** Finds a remote post on your mastodon instance */
export const findRemoteMastodonPost = async (url: URL) => {
	const opts = (await browser.storage.local.get()).mastodon as RedirectSettings;
	const requrl = new URL(opts.instance);
	requrl.pathname = "/api/v2/search";
	requrl.searchParams.append("q", url.toString());
	requrl.searchParams.append("resolve", "true");
	requrl.searchParams.append("limit", "1");
	
	const res = await fetch(requrl, {
		credentials: "include",
		mode: "no-cors",
		headers: {
			Authorization: `Bearer ${opts.code}`,
		},
	});
	const json = await res.json() as MastodonSearchResults;
	console.log(json);

	const status = json.statuses[0];
	return `${new URL(opts.instance).origin}/@${status.account.username}@${url.hostname}/${status.id}`;
}

//thanks tusky
const mastodonUrlRegexes = [
	/^\/@[^\/]+$/i,	// /@User
	/^\/@[^\/]+\/\d+$/i,	// /@User/43456787654678
	/^\/users\/[^\/]+\/statuses\/\d+$/i,	// /users/User/statuses/43456787654678
	/^\/users\/\w+$/i,	// /users/User
	/^\/user\/[^\/]+\/comment\/\d+$/i,	// /user/User/comment/123456
	/^\/user\/\w+$/i, // /user/User
	/^\/notice\/[a-zA-Z0-9]+$/i, // /notice/9sBHWIlwwGZi5QGlHc
	/^\/objects\/[-a-f0-9]+$/i,	// /objects/d4643c42-3ae0-4b73-b8b0-c725f5819207
	/^\/notes\/[a-z0-9]+$/i,
	/^\/display\/[-a-f0-9]+$/i, // /display/d4643c42-3ae0-4b73-b8b0-c725f5819207
	/^\/profile\/\w+$/i,
	/^\/p\/\w+\/\\d+$/i,
	/^\/@[^\/]+\/statuses\/[a-zA-Z0-9]+$/i,
	/^\/o\/[a-f0-9]+$/i,
]
export const looksLikeMastodon = (url: URL) => {
	return !!mastodonUrlRegexes.find(x => x.test(url.pathname));
}

export const validateUrl = (url: string | undefined | null) => {
	if (!url) return undefined;
	try {
		return new URL(url);
	}
	catch (e) {
		return undefined;
	}
}