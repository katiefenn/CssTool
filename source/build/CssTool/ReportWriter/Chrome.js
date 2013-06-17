define(
	'CssTool/ReportWriter/Chrome',
	[],

	function () {
		function ReportWriterChrome() {

		}

		ReportWriterChrome.prototype.writeReport = function(data) {
			var resultTable = $('#result-table');

			for(var index = 0; index < data.length; index++) {
				if(data.hasOwnProperty(index)) {
					var resultRow = $('<tr><th class="metric-name"></th><td class="result-value"></td></tr>');

					resultRow.find('.metric-name').text(index);
					resultRow.find('.result-value').text(data[index]);

					resultTable.append(resultRow);
				}
			}
		};

		return ReportWriterChrome;
	}
);