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

requirejs(['CssTool','metrics/All', 'ReportWriterChrome'],
    function (CssTool, metrics, ReportWriterChrome) {
        var stylesheets = [];
        chrome.devtools.inspectedWindow.getResources(function(resources){
            _.each(resources, function(resource){
                if(resource.url.indexOf('.css') != -1) {
                    resource.getContent(function(content) {
                        stylesheets.push(content);
                    });
                }
            });
        });

        setTimeout(function () {
            var cssTool = new CssTool(metrics, {'reportWriter': new ReportWriterChrome()});
            cssTool.runReport(stylesheets);
        }, 5000);
    }
);