define(
	'CssTool',
	['CssTool/CssParser/DataAdaptor', 'CssTool/Report', 'CssTool/ReportWriter/Web'],

	function(CssParserDataAdaptor, Report, ReportWriterWeb) {
		function CssTool(metrics, reportWriter) {
			var defaultOptions = {
				'dataAdaptor': new CssParserDataAdaptor,
				'reportWriter': new ReportWriterWeb,
				'runFromSource': 0
			};

			this.metrics = metrics;
			this.settings = jQuery.extend(defaultOptions, {});
		}

		CssTool.prototype.runReport = function (string) {
			if (typeof string != undefined) {
				var catalogData = this.settings.dataAdaptor.process(string),
					report = new Report(catalogData, this.metrics);

				console.log(report.run(cssString));
			}
		}

		return CssTool;
	}
);