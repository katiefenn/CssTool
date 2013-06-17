require.config({
	baseUrl: 'scripts/Libs',
	paths: {
		CssTool: '../CssTool',
		jquery: "../libs/jquery/jquery-1.9.1.min",
		tokenizer: "../libs/CssParser/tokenizer",
		parser: "../libs/CssParser/parser"
	}
});

requirejs(['CssTool','CssTool/Metrics/All','jquery'],
	function (CssTool, metrics) {
//		var stylesheets = jQuery("link[rel='stylesheet']")
//			stylesheetData = [];

		console.log(chrome.devtools.inspectedPage)

		// stylesheets.each(function () {
		//     jQuery.get(jQuery(this).attr('href'), function (data) {
		//         stylesheetData.push(data);
		//     });
		// });

		// setTimeout(function () {
		// 	var cssTool = new CssTool(metrics);
		// 	cssTool.runReport(stylesheetData);
		// }, 5000);
	}
);