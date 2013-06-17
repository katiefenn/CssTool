require.config({
	baseUrl: 'scripts/Libs',
	paths: {
		CssTool: '../CssTool',
		jquery: "../libs/jquery/jquery-1.9.1.min",
		tokenizer: "../libs/CssParser/tokenizer",
		parser: "../libs/CssParser/parser"
	}
});

requirejs(['CssTool','metrics/All','jquery'],
	function (CssTool, metrics) {
		var stylesheets = jQuery("link[rel='stylesheet']")
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
				var cssTool = new CssTool(metrics);
				cssTool.runReport(stylesheetData);
			}, 5000);
		}
	}
);

/*
javascript: (function () {   
    var jsCode = document.createElement('script');   
    jsCode.setAttribute('src', 'http://localhost/~kas/CssTool/source/libs/require.js/require.js');
    jsCode.setAttribute('data-main', 'http://localhost/~kas/CssTool/build/app.js');
  document.body.appendChild(jsCode);   
 }());
 */