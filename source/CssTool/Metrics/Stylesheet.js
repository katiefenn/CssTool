define(
	'CssTool/Metrics/Stylesheet',
	[
		'CssTool/Metrics/TotalStylesheets',
	],
	function(
		TotalStylesheets
	) {
		return [
			new TotalStylesheets
		];
	}
);