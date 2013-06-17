define(
	'CssTool/Metrics/All',
	['CssTool/Metrics/Selector', 'CssTool/Metrics/Declaration', 'CssTool/Metrics/Stylesheet'],

	function(selectorMetrics, declarationMetrics, stylesheetMetrics) {
		return {
			selector: selectorMetrics,
			declaration: declarationMetrics,
			stylesheet: stylesheetMetrics
		}
	}
);