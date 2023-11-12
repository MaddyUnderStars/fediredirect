import { doRedirect } from "./lib/index";
import { getSettings } from "./utils";

browser.webNavigation.onCommitted.addListener(async () => {
	const settings = await getSettings();
	if (!settings.automatic_redirects) return;
	await doRedirect();
});
