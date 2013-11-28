({
    baseUrl: ".",
    name: "almond",
    include: "CssTool",
    wrap: {
        startFile: 'start.frag',
        endFile:'end.frag'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["underscore"],
            exports: 'Backbone'
        }      
    },
    paths: {
        CssTool: 'CssTool',
        tokenizer: "libs/CssParser/tokenizer",
        parser: "libs/CssParser/parser",
        underscore: 'libs/underscore-min',
        backbone: 'libs/backbone-min',
        almond: 'libs/almond'
    }
})
