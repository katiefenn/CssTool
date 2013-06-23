define(
    'metrics/TopSelectorSpecificitySelector',
    [],

    function () {
        function TopSelectorSpecificitySelector() {
            this.topSelectorSpecificity = 0;
            this.topSelectorSpecificitySelector = "";
        }

        TopSelectorSpecificitySelector.prototype.measure = function(selectorData) {
            _.each(selectorData.selectors, function(selector){
                var specificity = 0,
                    selectorString = "";

                _.each(selector, function(identifier){
                    selectorString += identifier;
                    var idIdentifiers = this.countIdIdentifiers(identifier),
                        classIdentifiers = this.countClassIdentifiers(identifier),
                        attributeIdentifiers = this.countAttributeIdentifiers(identifier),
                        pseudoClassIdentifiers = this.countPseudoClassIdentifiers(identifier),
                        typeIdentifiers = this.countTypeIdentifiers(identifier),
                        pseudoElementIdentifiers = this.countPseudoElementIdentifiers(identifier);
                        
                    specificity += Number(
                        String(idIdentifiers) + 
                        String(classIdentifiers + attributeIdentifiers + pseudoClassIdentifiers) + 
                        String(typeIdentifiers + pseudoElementIdentifiers));
                }, this);
                
                if(specificity > this.topSelectorSpecificity) {
                    this.topSelectorSpecificity = specificity;
                    this.topSelectorSpecificitySelector = selectorString;
                }
            }, this);


            return {
                'top-selector-specificity-selector': this.topSelectorSpecificitySelector
            };
        };        

       TopSelectorSpecificitySelector.prototype.countIdIdentifiers = function(identifier) {
            var regex = /#/,
                matches = regex.exec(identifier);

            if (matches) {
                return matches.length;
            }

            return 0;
        };

        TopSelectorSpecificitySelector.prototype.countClassIdentifiers = function(identifier) {
            var regex = /\./,
                matches = regex.exec(identifier);

            if (matches) {
                return matches.length;
            }

            return 0;
        };

        TopSelectorSpecificitySelector.prototype.countAttributeIdentifiers = function(identifier) {
            var regex = /\[/,
                matches = regex.exec(identifier);

            if (matches) {
                return matches.length;
            }

            return 0;
        };

        TopSelectorSpecificitySelector.prototype.countPseudoClassIdentifiers = function(identifier) {
            var regex = /:[^:]/,
                matches = regex.exec(identifier);

            if (matches) {
                return matches.length;
            }

            return 0;
        };

        TopSelectorSpecificitySelector.prototype.countTypeIdentifiers = function(identifier) {
            var regex = /^[a-zA-Z_]/;

            if (regex.exec(identifier)) {
                return 1;
            }

            return 0;
        };

        TopSelectorSpecificitySelector.prototype.countPseudoElementIdentifiers = function(identifier) {
            var regex = /::/,
                matches = regex.exec(identifier);

            if (matches) {
                return matches.length;
            }

            return 0;
        };

        return TopSelectorSpecificitySelector;
    }
);