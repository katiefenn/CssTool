define(
	'CssTool/Metrics/TopSelectorSpecificity',
	[],

	function () {
		function TopSelectorSpecificity() {
			this.topSelectorSpecificity = 0;
		}

		TopSelectorSpecificity.prototype.measure = function(selectorData) {
			for(selectorIndex in selectorData.selectors) {
				var selector = selectorData.selectors[selectorIndex],
					specificity = 0;

				for(identifierIndex in selector) {
					if(selector.hasOwnProperty(identifierIndex)) {
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
				}
			}


			return {
				'top-selector-specificity': this.topSelectorSpecificity
			};
		};		

		TopSelectorSpecificity.prototype.countIdIdentifiers = function(identifier) {
			var regex = /#/;

			if (matches = regex.exec(identifier)) {
				return matches.length;
			}

			return 0;
		};

		TopSelectorSpecificity.prototype.countClassIdentifiers = function(identifier) {
			var regex = /\./;

			if (matches = regex.exec(identifier)) {
				return matches.length;
			}

			return 0;
		};

		TopSelectorSpecificity.prototype.countAttributeIdentifiers = function(identifier) {
			var regex = /\[/;

			if (matches = regex.exec(identifier)) {
				return matches.length;
			}

			return 0;
		};

		TopSelectorSpecificity.prototype.countPseudoClassIdentifiers = function(identifier) {
			var regex = /:[^:]/;

			if (matches = regex.exec(identifier)) {
				return matches.length;
			}

			return 0;
		};

		TopSelectorSpecificity.prototype.countTypeIdentifiers = function(identifier) {
			var regex = /^[a-zA-Z_]/;

			if (regex.exec(identifier)) {
				return 1
			}

			return 0;
		};

		TopSelectorSpecificity.prototype.countPseudoElementIdentifiers = function(identifier) {
			var regex = /::/;

			if (matches = regex.exec(identifier)) {
				return matches.length;
			}

			return 0;
		};

		return TopSelectorSpecificity;
	}
);