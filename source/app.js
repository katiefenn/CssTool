require.config({
    baseUrl: 'source',
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
});

requirejs(['CssTool', 'jquery'],
    function (CssTool, metrics, jQuery) {
        var stylesheets = jQuery("link[rel='stylesheet']"),
            stylesheetData = [];

        if (typeof stylesheetArray != 'undefined') {
            var cssTool = new CssTool({metrics: metrics});
            cssTool.runReport(stylesheetArray);
        } else {

            stylesheets.each(function () {
                jQuery.get(jQuery(this).attr('href'), function (data) {
                    stylesheetData.push(data);
                });
            });

            setTimeout(function () {
                var cssTool = new CssTool();
                console.log(cssTool.runReport(stylesheetData));
            }, 5000);
        }
    }
);

/*
javascript: (function () {   
    var jsCode = document.createElement('script'),
        requirePath = 'http://localhost/~kas/ChromeExtension/source/libs/CssTool/CssTool.js';
        //scriptPath = 'http://localhost/~kas/CssTool/build/CssTool.js';
    jsCode.setAttribute('src', requirePath);
    //jsCode.setAttribute('data-main', scriptPath);
  document.body.appendChild(jsCode);   
 }());
requirejs(['CssTool', 'jquery'],
    function (CssTool, jQuery) {
        var stylesheets = jQuery("link[rel='stylesheet']"),
            stylesheetData = [];

        if (typeof stylesheetArray != 'undefined') {
            var cssTool = new CssTool({metrics: metrics});
            cssTool.runReport(stylesheetArray);
        } else {

            stylesheets.each(function () {
                jQuery.get(jQuery(this).attr('href'), function (data) {
                    stylesheetData.push(data);
                });
            });

            setTimeout(function () {
                var cssTool = new CssTool();
                console.log(cssTool.runReport(stylesheetData));
            }, 5000);
        }
    }
);
 */