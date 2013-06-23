define(
	'metrics/All',
	['metrics/Selector', 'metrics/Declaration', 'metrics/Stylesheet'],

	function(selectorMetrics, declarationMetrics, stylesheetMetrics) {
		return {
			selector: selectorMetrics,
			declaration: declarationMetrics,
			stylesheet: stylesheetMetrics
		}
	}
);