({
    appDir: ".",
    baseUrl: ".",
    dir: "build",
    modules: [
        {
            name: "app"
        },
        {
            name: "app-chrome"
        }
    ],
	paths: {
		CssTool: 'CssTool',
		jquery: "Libs/jquery/jquery-1.9.1.min",
		tokenizer: "Libs/CssParser/tokenizer",
		parser: "Libs/CssParser/parser"
	}
})