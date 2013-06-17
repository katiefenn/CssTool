define(
	'CssTool/Metrics/IdentifiersPerSelector',
	[],

	function() {
		function IdentifiersPerSelector() {
			this.totalIdentifiers = 0;
			this.totalSelectors = 0;
		}

		IdentifiersPerSelector.prototype.measure = function(selectorData) {
			this.totalSelectors += selectorData.selectors.length;

			for(selectorIndex in selectorData.selectors) {
				this.totalIdentifiers += selectorData.selectors[selectorIndex].length;
			}

			return {
				'identifiers-per-selector': this.totalIdentifiers / this.totalSelectors
			};
		};

		return IdentifiersPerSelector;
	}
);