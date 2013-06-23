define(
	'metrics/UniqueColours',
	[],

	function() {
		function UniqueColours() {
			this.uniqueColours = [];
		}

		UniqueColours.prototype.measure = function(selectorData) {
			selectorData.values.forEach(function(value) {
				if(value.typeGroup == 'color') {
					var hash = getLongHashForm(value.value.toLowerCase());
					if(this.uniqueColours.indexOf(hash) === -1) {
						this.uniqueColours.push(hash);
					}
				}
			}, this);
			return {
				'unique-colours': this.uniqueColours.sort().join(', ')
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

		return UniqueColours;
	}
);