define(
	'metrics/TotalUniqueColours',
	[],

	function() {
		function TotalUniqueColours() {
			this.uniqueColours = [];
		}

		TotalUniqueColours.prototype.measure = function(selectorData) {
			_.each(selectorData.values, function(value){
				if(value.typeGroup == 'color') {
					var hash = getLongHashForm(value.value.toLowerCase());

					if(this.uniqueColours.indexOf(hash) === -1) {
						this.uniqueColours.push(hash);
					}
				}				
			}, this);

			return {
				'total-unique-colours': this.uniqueColours.length
			};
		};

		function getLongHashForm(string) {
			if(string.length == 3) {
				var r = string.substring(0, 1),
					g = string.substring(1, 2),
					b = string.substring(2);

				return r + r + g + g + b + b;
			}

			return string;
		}

		return TotalUniqueColours;
	}
);