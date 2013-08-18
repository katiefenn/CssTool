define(
    'metrics/IdentifiersPerSelector',
    [],

    function() {
        function IdentifiersPerSelector() {
            this.totalIdentifiers = 0;
            this.totalSelectors = 0;
        }

        IdentifiersPerSelector.prototype.measure = function(selectorData) {
            this.totalSelectors += selectorData.selectors.length;

            _.each(selectorData.selectors, function(selector){
                _.each(selector, function(identifier) {
                    if(identifier != ' ') {
                        this.totalIdentifiers += 1;
                    }
                }, this);
            }, this);

            return {
                'identifiers-per-selector': this.totalIdentifiers / this.totalSelectors
            };
        };

        return IdentifiersPerSelector;
    }
);