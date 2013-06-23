define(
	'ReportWriterConsole',
	[],

	function () {
		function ReportWriterConsole() {

		}

		ReportWriterConsole.prototype.writeReport = function(results) {
			console.log(results);
		};

		return ReportWriterConsole;
	}
);