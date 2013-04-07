define(
	'CssTool/Report',
	[],

	function () {

		function Report(catalogData, metrics) {
			this.catalog = catalogData;
			this.results = {};
			this.metrics = metrics;
		}

		Report.prototype.run = function() {
			this.catalog.forEach(function(catalogItem) {
				if(catalogItem.type == 'selector') {
					for(metric in this.metrics.selector) {
						if(this.metrics.selector.hasOwnProperty(metric)) {
							jQuery.extend(this.results, this.metrics.selector[metric].measure(catalogItem));
						}
					}
				}
			}, this);

			return this.results;
		};

		return Report;
	}
);