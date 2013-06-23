define(
    'metrics/TotalIdentifiers',
    [],

    function () {

        function TotalIdentifiers () {
            this.totalIdentifiers = 0;
        }

        TotalIdentifiers.prototype.measure = function(selectorData) {
            _.each(selectorData, function(selector){
                this.totalIdentifiers += selector.length;
            }, this);

            return {
                'total-identifiers': this.totalIdentifiers
            };
        };

        return TotalIdentifiers;
    }
);