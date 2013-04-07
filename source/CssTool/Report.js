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
			for(catalogItemIndex in this.catalog) {
				var metricIterator = Iterator(this.metrics.selector);
				if(this.catalog[catalogItemIndex].type == 'selector') {
					for(metric in metricIterator) {
						jQuery.extend(this.results, metric[1].measure(this.catalog[catalogItemIndex]));
					}
				}
			}

			return this.results;
		};

		return Report;
	}
);