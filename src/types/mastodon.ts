export type MastodonApplication = {
	id: string;
	name: string;
	website: string | null;
	redirect_uri: string;
	client_id: string;
	client_secret: string;
	vapid_key: string;
};

export type MastodonStatus = {
	id: string;
	url: string;

	account: MastodonAccount;
};

export type MastodonHashtag = {};

export type MastodonAccount = {
	id: string;
	url: string;
	username: string;
};

export type MastodonSearchResults = {
	accounts: MastodonAccount[];
	statuses: MastodonStatus[];
	hashtags: MastodonHashtag[];
};
