import { doRedirect } from "./lib/index";

browser.webNavigation.onCommitted.addListener(() => doRedirect());
