({
    appDir: ".",
    baseUrl: ".",
    dir: "../build",
    modules: [
        {
            name: "app"
        },
        {
            name: "app-chrome"
        }
    ],
    shim: {
        underscore: {
            exports: '_'
        }        
    },
	paths: {
		CssTool: 'CssTool',
		jquery: "libs/jquery/jquery-1.9.1.min",
		tokenizer: "libs/CssParser/tokenizer",
		parser: "libs/CssParser/parser",
        underscore: 'libs/underscore-min'
	}
})