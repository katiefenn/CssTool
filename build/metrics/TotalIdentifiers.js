define(
    'metrics/TotalIdentifiers',
    [],

    function () {

        function TotalIdentifiers () {
            this.totalIdentifiers = 0;
        }

        TotalIdentifiers.prototype.measure = function(selectorData) {
            _.each(selectorData.selectors, function(selector){
                _.each(selector, function(identifier) {
                    if(identifier != " ") {
                        this.totalIdentifiers += 1;
                    }
                }, this);
            }, this);

            return {
                'total-identifiers': this.totalIdentifiers
            };
        };

        return TotalIdentifiers;
    }
);