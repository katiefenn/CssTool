define(
	'RuleParser',
	['underscore', 'backbone'],
	function(_, Backbone) {
		var RuleParser = Backbone.Model.extend({
			parse: function(rule) {
				return parseRule(rule);
			}
		});

		var parseRule = function(rule) {
			var selectors = getSelectors(getSelectorBlock(rule));

			return {
				selectors: getSelectors(getSelectorBlock(rule)),
				declarations: getDeclarations((getDeclarationBlock(rule)))
			}
		}

		var getSelectorBlock = function(rule) {
			var pattern = /(.+) \{/g,
				results = pattern.exec(rule);

			return results[1];
		}

		var getSelectors = function(selectorBlock) {
			var untrimmedSelectors = selectorBlock.split(','),
				trimmedSelectors = untrimmedSelectors.map(function(untrimmed) {
					return untrimmed.trim();
				});

			return trimmedSelectors;
		}

		var getDeclarationBlock = function(rule) {
			var pattern = /\{(.+)\}/g;

			return pattern.exec(rule)[1];
		}

		var getDeclarations = function(declarationBlock) {
			var untrimmedDeclarations = _.compact(declarationBlock.split(';')),
				trimmedDeclarations = untrimmedDeclarations.map(function(untrimmed) {
					return untrimmed.trim();
				});

			return trimmedDeclarations;
		}

		return RuleParser;
	}
);