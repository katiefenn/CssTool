define(
	'CssTool/Metrics/TotalUniqueColours',
	[],

	function() {
		function TotalUniqueColours() {
			this.uniqueColours = [];
		}

		TotalUniqueColours.prototype.measure = function(selectorData) {
			selectorData.values.forEach(function(value) {
				if(value.typeGroup == 'color') {
					if(this.uniqueColours.indexOf(value.value) === -1) {
						this.uniqueColours.push(value.value);
					}
				}
			}, this);
			return {
				'total-unique-colours': this.uniqueColours.length
			};
		};

		return TotalUniqueColours;
	}
);