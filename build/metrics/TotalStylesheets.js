define(
    'metrics/TotalStylesheets',
    [],

    function() {
        function TotalStylesheets () {
            this.totalStylesheets = 0;
        }

        TotalStylesheets.prototype.measure = function(stylesheetData) {
            this.totalStylesheets++;

            return {
                'total-stylesheets': this.totalStylesheets
            };
        };

        return TotalStylesheets;
    }
);