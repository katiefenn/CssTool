define(
	'CssTool',
	['CssParser/DataAdaptor', 'Report', 'ReportWriter/Web'],

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

		CssTool.prototype.runReport = function (stylesheets) {
			var catalogData = [];

			if (Object.prototype.toString.call(stylesheets) === '[object Array]') {
				stylesheets.forEach(function(stylesheet) {
					catalogData.push(this.settings.dataAdaptor.process(stylesheet));
				}, this);
				
				var report = new Report(catalogData, this.metrics);

				console.log(report.run());
			}
		}

		return CssTool;
	}
);