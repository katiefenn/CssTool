require.config({
    baseUrl: '../source/',
    paths: {
        jquery: 'libs/jquery/jquery-1.9.1.min',
        jasmine: '../tests/lib/jasmine-1.3.0/jasmine',
        'jasmine-html': '../tests/lib/jasmine-1.3.0/jasmine-html',
        underscore: 'libs/underscore-min',
        backbone: 'libs/backbone-min',
        specs: "../tests/spec",
        fixtures: "../tests/fixtures",
        CssTool: 'CssTool',
        tokenizer: "libs/CssParser/tokenizer",
        parser: "libs/CssParser/parser",
    },
    shim: {
        jasmine: {
            exports: 'jasmine'
        },
        'jasmine-html': {
            deps: ['jasmine'],
            exports: 'jasmine'
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["underscore"],
            exports: 'Backbone'
        },
        specs: {
            deps: ['jasmine', 'jasmine-html']
        }
    }
});

requirejs(['jquery', 'jasmine-html', 'NewParser'],
    function ($, jasmine, ResourceReader) {
        var jasmineEnv = jasmine.getEnv();
        jasmineEnv.updateInterval = 1000;

        var htmlReporter = new jasmine.HtmlReporter();

        jasmineEnv.addReporter(htmlReporter);

        jasmineEnv.specFilter = function (spec) {
            return htmlReporter.specFilter(spec);
        };

        var specs = [];

        specs.push('specs/NewParser');

        $(function(){
            require(specs, function(){
              jasmineEnv.execute();
            });
        });
    }
);