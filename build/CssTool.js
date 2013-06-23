define(
	'CssTool',
	['DataAdaptor', 'Report', 'ReportWriterConsole'],

	function(DataAdaptor, Report, ReportWriterConsole) {
		function CssTool(metrics, options) {
			var defaults = {
				'dataAdaptor': new DataAdaptor,
				'reportWriter': new ReportWriterConsole,
				'runFromSource': 0
			};

			if(_.isUndefined(options)) {
				options = {};
			}

			this.metrics = metrics;
			this.settings = defaults;
			_.extend(this.settings, options);
		}

		CssTool.prototype.runReport = function (stylesheets) {
			var catalogData = [];

			if (Object.prototype.toString.call(stylesheets) === '[object Array]') {
				stylesheets.forEach(function(stylesheet) {
					catalogData.push(this.settings.dataAdaptor.process(stylesheet));
				}, this);
				
				var report = new Report(catalogData, this.metrics);
				this.settings.reportWriter.writeReport(report.run());
			}
		}

		return CssTool;
	}
);