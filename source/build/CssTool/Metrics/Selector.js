define(
	'CssTool/Metrics/Selector',
	[
		'CssTool/Metrics/IdentifiersPerSelector', 'CssTool/Metrics/TotalSelectors',
		'CssTool/Metrics/TotalIdentifiers', 'CssTool/Metrics/SelectorsPerRule',
		'CssTool/Metrics/SpecificityPerSelector', 'CssTool/Metrics/TopSelectorSpecificity',
		'CssTool/Metrics/TopSelectorSpecificitySelector'

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