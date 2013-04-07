define(
	'CssTool/Metrics/SelectorsPerRule',
	[],

	function () {
		function SelectorsPerRule() {
			this.totalSelectors = 0;
			this.totalRules = 0;
		}

		SelectorsPerRule.prototype.measure = function(selectorData) {
			this.totalRules++;
			this.totalSelectors += selectorData.selectors.length;

			return {
				'selectors-per-rule': this.totalSelectors / this.totalRules
			};
		};

		return SelectorsPerRule;
	}
);