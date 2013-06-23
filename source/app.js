require.config({
    baseUrl: 'scripts/libs',
    shim: {
        underscore: {
            exports: '_'
        }
    },
    paths: {
        CssTool: '../CssTool',
        jquery: "../libs/jquery/jquery-1.9.1.min",
        tokenizer: "../libs/CssParser/tokenizer",
        parser: "../libs/CssParser/parser",
        underscore: '../libs/underscore-min'
    }
});

requirejs(['CssTool','metrics/All', 'ReportWriterConsole'],
    function (CssTool, metrics, ReportWriterConsole) {
        var stylesheets = jQuery("link[rel='stylesheet']"),
            stylesheetData = [];

        if (typeof stylesheetArray != 'undefined') {
            var cssTool = new CssTool(metrics);
            cssTool.runReport(stylesheetArray);
        } else {

            stylesheets.each(function () {
                jQuery.get(jQuery(this).attr('href'), function (data) {
                    stylesheetData.push(data);
                });
            });

            setTimeout(function () {
                var cssTool = new CssTool(metrics, {'reportWriter': new ReportWriterConsole()});
                cssTool.runReport(stylesheetData);
            }, 5000);
        }
    }
);

/*
javascript: (function () {   
    var jsCode = document.createElement('script'),
        requirePath = 'http://localhost/~kas/CssTool/source/libs/require.js/require.js',
        scriptPath = 'http://localhost/~kas/CssTool/build/app.js';
    jsCode.setAttribute('src', requirePath);
    jsCode.setAttribute('data-main', scriptPath);
  document.body.appendChild(jsCode);   
 }());
 */