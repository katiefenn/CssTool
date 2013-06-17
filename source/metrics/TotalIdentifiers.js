define(
	'metrics/TotalIdentifiers',
	[],

	function () {

		function TotalIdentifiers () {
			this.totalIdentifiers = 0;
		}

		TotalIdentifiers.prototype.measure = function(selectorData) {
			for(selectorIndex in selectorData.selectors) {
				this.totalIdentifiers += selectorData.selectors[selectorIndex].length;
			}

			return {
				'total-identifiers': this.totalIdentifiers
			}
		};

		return TotalIdentifiers;
	}
);