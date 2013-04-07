requirejs.config({
	baseUrl: 'scripts/Libs',
	paths: {
		CssTool: '../CssTool'
	}
});

requirejs(['CssTool','CssTool/Metrics/All'],
	function (CssTool, metrics) {
		var cssTool = new CssTool(metrics);
		cssTool.runReport(cssString);
	}
);