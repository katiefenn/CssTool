define(
	'CssTool/Metrics/Declaration',
	[
		'CssTool/Metrics/TotalUniqueColours', 'CssTool/Metrics/UniqueColours'
	],
	function(
		TotalUniqueColours, UniqueColours
	) {
		return [
			new TotalUniqueColours,
			new UniqueColours
		];
	}
);