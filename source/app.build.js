({
    appDir: ".",
    baseUrl: ".",
    dir: "../build",
    modules: [
        {
            name: "CssTool"
        }
    ],
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: 'Backbone'
        }      
    },
    paths: {
        CssTool: 'CssTool',
        jquery: "libs/jquery/jquery-1.9.1.min",
        tokenizer: "libs/CssParser/tokenizer",
        parser: "libs/CssParser/parser",
        underscore: 'libs/underscore-min',
        backbone: 'libs/backbone-min'
    }
})
