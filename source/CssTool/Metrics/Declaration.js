define(
	'CssTool/Metrics/Declaration',
	[
		'CssTool/Metrics/TotalUniqueColours',
	],
	function(
		TotalUniqueColours
	) {
		return [
			new TotalUniqueColours
		];
	}
);