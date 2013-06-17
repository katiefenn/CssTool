define(
	'metrics/TopSelectorSpecificitySelector',
	[],

	function () {
		function TopSelectorSpecificitySelector() {
			this.topSelectorSpecificity = 0;
			this.topSelectorSpecificitySelector = "";
		}

		TopSelectorSpecificitySelector.prototype.measure = function(selectorData) {
			for(selectorIndex in selectorData.selectors) {
				var selector = selectorData.selectors[selectorIndex],
					specificity = 0,
					selectorString = "";

				for(identifierIndex in selector) {
					if(selector.hasOwnProperty(identifierIndex)) {
						selectorString += selector[identifierIndex];
						var identifier = selector[identifierIndex],
							idIdentifiers = this.countIdIdentifiers(identifier),
							classIdentifiers = this.countClassIdentifiers(identifier),
							attributeIdentifiers = this.countAttributeIdentifiers(identifier),
							pseudoClassIdentifiers = this.countPseudoClassIdentifiers(identifier),
							typeIdentifiers = this.countTypeIdentifiers(identifier),
							pseudoElementIdentifiers = this.countPseudoElementIdentifiers(identifier);
							
						specificity += Number(
							String(idIdentifiers) + 
							String(classIdentifiers + attributeIdentifiers + pseudoClassIdentifiers) + 
							String(typeIdentifiers + pseudoElementIdentifiers));
					}
				}

				if(specificity > this.topSelectorSpecificity) {
					this.topSelectorSpecificity = specificity;
					this.topSelectorSpecificitySelector = selectorString;
				}
			}


			return {
				'top-selector-specificity-selector': this.topSelectorSpecificitySelector
			};
		};		

		TopSelectorSpecificitySelector.prototype.countIdIdentifiers = function(identifier) {
			var regex = /#/;

			if (matches = regex.exec(identifier)) {
				return matches.length;
			}

			return 0;
		};

		TopSelectorSpecificitySelector.prototype.countClassIdentifiers = function(identifier) {
			var regex = /\./;

			if (matches = regex.exec(identifier)) {
				return matches.length;
			}

			return 0;
		};

		TopSelectorSpecificitySelector.prototype.countAttributeIdentifiers = function(identifier) {
			var regex = /\[/;

			if (matches = regex.exec(identifier)) {
				return matches.length;
			}

			return 0;
		};

		TopSelectorSpecificitySelector.prototype.countPseudoClassIdentifiers = function(identifier) {
			var regex = /:[^:]/;

			if (matches = regex.exec(identifier)) {
				return matches.length;
			}

			return 0;
		};

		TopSelectorSpecificitySelector.prototype.countTypeIdentifiers = function(identifier) {
			var regex = /^[a-zA-Z_]/;

			if (regex.exec(identifier)) {
				return 1
			}

			return 0;
		};

		TopSelectorSpecificitySelector.prototype.countPseudoElementIdentifiers = function(identifier) {
			var regex = /::/;

			if (matches = regex.exec(identifier)) {
				return matches.length;
			}

			return 0;
		};

		return TopSelectorSpecificitySelector;
	}
);