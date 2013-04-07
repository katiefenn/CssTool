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
					this.runMetricsOnCatalogItem(catalogItem, this.metrics.selector);
				}
				else if(catalogItem.type == 'declaration') {
					this.runMetricsOnCatalogItem(catalogItem, this.metrics.declaration);
				}
			}, this);

			return this.results;
		};

		Report.prototype.runMetricsOnCatalogItem = function(catalogItem, metrics) {
			for(metric in metrics) {
				if(metrics.hasOwnProperty(metric)) {
					jQuery.extend(this.results, metrics[metric].measure(catalogItem));
				}
			}
		};

		return Report;
	}
);