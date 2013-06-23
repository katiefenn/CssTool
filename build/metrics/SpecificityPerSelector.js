define(
	'metrics/SpecificityPerSelector',
	[],

	function() {

		function SpecificityPerSelector() {
			this.totalSpecificity = 0;
			this.totalSelectors = 0;
		}

		SpecificityPerSelector.prototype.measure = function(selectorData) {
			this.totalSelectors += selectorData.selectors.length;

			_.each(selectorData, function(selector){
				_.each(selector, function(identifier){
					idIdentifiers = this.countIdIdentifiers(identifier),
					classIdentifiers = this.countClassIdentifiers(identifier),
					attributeIdentifiers = this.countAttributeIdentifiers(identifier),
					pseudoClassIdentifiers = this.countPseudoClassIdentifiers(identifier),
					typeIdentifiers = this.countTypeIdentifiers(identifier),
					pseudoElementIdentifiers = this.countPseudoElementIdentifiers(identifier);

					this.totalSpecificity += Number(
						String(idIdentifiers) + 
						String(classIdentifiers + attributeIdentifiers + pseudoClassIdentifiers) + 
						String(typeIdentifiers + pseudoElementIdentifiers));					
				}, this);
			}, this);

			return {
				'specificity-per-selector': this.totalSpecificity / this.totalSelectors
			};
		};

		SpecificityPerSelector.prototype.countIdIdentifiers = function(identifier) {
			var regex = /#/;

			if (matches = regex.exec(identifier)) {
				return matches.length;
			}

			return 0;
		};

		SpecificityPerSelector.prototype.countClassIdentifiers = function(identifier) {
			var regex = /\./;

			if (matches = regex.exec(identifier)) {
				return matches.length;
			}

			return 0;
		};

		SpecificityPerSelector.prototype.countAttributeIdentifiers = function(identifier) {
			var regex = /\[/;

			if (matches = regex.exec(identifier)) {
				return matches.length;
			}

			return 0;
		};

		SpecificityPerSelector.prototype.countPseudoClassIdentifiers = function(identifier) {
			var regex = /:[^:]/;

			if (matches = regex.exec(identifier)) {
				return matches.length;
			}

			return 0;
		};

		SpecificityPerSelector.prototype.countTypeIdentifiers = function(identifier) {
			var regex = /^[a-zA-Z_]/;

			if (regex.exec(identifier)) {
				return 1
			}

			return 0;
		};

		SpecificityPerSelector.prototype.countPseudoElementIdentifiers = function(identifier) {
			var regex = /::/;

			if (matches = regex.exec(identifier)) {
				return matches.length;
			}

			return 0;
		};

		return SpecificityPerSelector;
	}
);