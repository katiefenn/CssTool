define(
	'SelectorParser',
	['underscore', 'backbone'],
	function(_, Backbone) {
		var SelectorParser = Backbone.Model.extend({
			parse: function(selector) {
				return parseRule(selector);
			}
		});

		var parseRule = function(selector) {
			return {
				identifiers: getIdentifiers(selector),
				type: 'selector'
			};
		};

		var getIdentifiers = function(selector) {
			var identifiers = [],
				segments = selector.split(/[ \+>]|~^=/g);

			_.each(segments, function(segment) {
				identifiers = identifiers.concat(segment.match(/[#\.:]?[\w\-\*]+|\[[\w=\-~'"\|]+\]|:{2}[\w-]+/g));
			});

			return identifiers;
		};

		return SelectorParser;
	}
);