export type HandlerSettings = Partial<{
	code: string;
	instance: string;
	client_id: string;
	client_secret: string;
}>;

export type ExtensionSettings = Partial<{
	automatic_redirects: boolean;
	handlers: { [key: string]: HandlerSettings };
}>;
