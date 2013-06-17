define(
	'metrics/Selector',
	[
		'metrics/IdentifiersPerSelector', 'metrics/TotalSelectors',
		'metrics/TotalIdentifiers', 'metrics/SelectorsPerRule',
		'metrics/SpecificityPerSelector', 'metrics/TopSelectorSpecificity',
		'metrics/TopSelectorSpecificitySelector'

	],
	function(
		IdentifiersPerSelector, TotalSelectors, TotalIdentifiers, SelectorsPerRule,
		SpecificityPerSelector, TopSelectorSpecificity, TopSelectorSpecificitySelector
	) {
		return [
			new IdentifiersPerSelector,
			new TotalSelectors,
			new TotalIdentifiers,
			new SelectorsPerRule,
			new SpecificityPerSelector,
			new TopSelectorSpecificity,
			new TopSelectorSpecificitySelector
		];
	}
);