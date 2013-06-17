define(
	'CssTool/Metrics/TotalSelectors',
	[],

	function() {
		function TotalSelectors () {
			this.totalSelectors = 0;
		}

		TotalSelectors.prototype.measure = function(selectorData) {
			this.totalSelectors += selectorData.selectors.length;

			return {
				'total-selectors': this.totalSelectors
			};
		};

		return TotalSelectors;
	}
);