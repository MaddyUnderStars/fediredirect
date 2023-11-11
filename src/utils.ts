import merge from "deepmerge";
import { ExtensionSettings } from "./types";

export const validateUrl = (url: string | undefined | null) => {
	if (!url) return undefined;
	try {
		return new URL(url);
	} catch (e) {
		return undefined;
	}
};

export const getSettings = async (): Promise<ExtensionSettings> => {
	return await browser.storage.local.get();
};

export const setSettings = async (settings: Partial<ExtensionSettings>) => {
	const old = await getSettings();
	await browser.storage.local.set(merge(old, settings));
};
