import handlers, { doRedirect } from "../lib";
import { getSettings } from "../utils";

const notice = document.getElementById("notice");
const buttons = document.getElementById("redirect_buttons");

(async () => {
	const settings = await getSettings();
	console.log(settings);
	if (!Object.keys(settings.handlers || {}).length) {
		notice!.style.display = "block";
		buttons!.style.display = "none";
		return;
	}

	for (const name in settings.handlers) {
		const handler = handlers.find((x) => x.type == name);
		if (!handler) continue;
		const button = document.createElement("button");
		button.innerHTML = name;
		buttons!.appendChild(button);

		button.addEventListener("click", () => doRedirect(handler));
	}
})();

document.getElementById("settings")!.addEventListener("click", (event) => {
	browser.runtime.openOptionsPage();
});
