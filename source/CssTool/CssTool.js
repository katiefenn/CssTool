define(
	'CssTool',
	['CssTool/Config/Config', 'CssTool/CssParser/DataAdaptor', 'CssTool/Report'],

	function(config, CssParserDataAdaptor, Report) {
		function CssTool() {
			var defaultOptions = {
				'dataAdaptor': new CssParserDataAdaptor,
				'reportWriter': new ReportWriterWeb(),
				'metrics': {}
				'runFromSource': 0
			};

			this.settings = jQuery.extend(defaultOptions, config);
		}

		CssTool.prototype.runReport = function (string) {
			if (typeof string != undefined) {
				var catalogData = this.settings.dataAdaptor.process(string),
					report = new Report(catalogData, settings.metrics);

				report.run(cssString);
			}
		}
	}
});