define(
	'Report',
	['underscore'],

	function (_) {

		function Report(catalogData, metrics) {
			this.catalog = catalogData;
			this.results = {};
			this.metrics = metrics;
		}

		Report.prototype.run = function() {
			this.catalog.forEach(function(stylesheet) {
				this.runMetricsOnStylesheet(stylesheet, this.metrics.stylesheet);

				_.each(stylesheet, function(rulePart){
					if(rulePart.type == 'selector') {
						this.runMetricsOnCatalogItem(rulePart, this.metrics.selector);
					}
					else if(rulePart.type == 'declaration') {
						this.runMetricsOnCatalogItem(rulePart, this.metrics.declaration);
					}
				}, this);
			}, this);

			return this.results;
		};

		Report.prototype.runMetricsOnStylesheet = function(catalogItem, metrics) {
			_.each(metrics, function(metric){
				_.extend(this.results, metric.measure(catalogItem));
			}, this);
		};

		Report.prototype.runMetricsOnCatalogItem = function(catalogItem, metrics) {
			_.each(metrics, function(metric){
				_.extend(this.results, metric.measure(catalogItem));
			}, this);
		};

		return Report;
	}
);