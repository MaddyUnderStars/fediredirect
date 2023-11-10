export const validateUrl = (url: string | undefined | null) => {
	if (!url) return undefined;
	try {
		return new URL(url);
	}
	catch (e) {
		return undefined;
	}
}