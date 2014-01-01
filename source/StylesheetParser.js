define(
	'StylesheetParser',
	['backbone', 'RuleParser'],
	function(Backbone, RuleParser) {
		var StylesheetParser = Backbone.Model.extend({
			parse: function(stylesheet) {
				if(stylesheet && stylesheet.length) {
					return parseStylesheet(stripFormatting(stylesheet));
				}

				else return {};
			}
		});

		var parseStylesheet = function(stylesheet) {
			var ruleParser = new RuleParser(),
				children = [];

			_.each(getRules(stylesheet), function(rule) {
				children.push(ruleParser.parse(rule));
			});

			return {
				children: children,
				type: 'stylesheet'
			};
		}

		var getRules = function(string) {
			var pattern = /[\w]*[\s]\{[\w\s\:\n;\-#\.]*}/g;
			return string.match(pattern);
		}

		var stripFormatting = function(string) {
			return stripNewlines(trimWhitespace(string));
		}

		var trimWhitespace = function(string) {
			return string.replace(/[ ]+/g, ' ');
		}

		var stripNewlines = function(string) {
			return string.replace(/\n/g, '');
		}

		return StylesheetParser;
	}
);