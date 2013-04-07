define(
	'CssTool/Metrics/All',
	['CssTool/Metrics/Selector', 'CssTool/Metrics/Declaration'],

	function(selectorMetrics, declarationMetrics) {
		return {
			selector: selectorMetrics,
			declaration: declarationMetrics
		}
	}
);