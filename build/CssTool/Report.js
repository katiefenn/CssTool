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
			this.catalog.forEach(function(stylesheet) {
				this.runMetricsOnStylesheet(stylesheet, this.metrics.stylesheet);

				stylesheet.forEach(function(rulePart) {
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
			for(metric in metrics) {
				if(metrics.hasOwnProperty(metric)) {
					jQuery.extend(this.results, metrics[metric].measure(catalogItem));
				}
			}
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