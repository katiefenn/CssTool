define(
    'ReportWriterChrome',
    ['jquery'],

    function (jQuery) {
        function ReportWriterChrome() {

        }

        ReportWriterChrome.prototype.writeReport = function(data) {
            var resultTable = jQuery('#result-table');

            _.each(data, function(result, resultName){
                var resultRow = jQuery('<tr><th class="metric-name"></th><td class="metric-result"></td></tr>');
                resultRow.find('.metric-name').text(resultName);
                resultRow.find('.metric-result').text(result);

                resultTable.append(resultRow);                
            }, this);
        };

        return ReportWriterChrome;
    }
);