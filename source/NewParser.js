define(
	'NewParser',
	['backbone'],
	function(Backbone) {
		var NewParser = Backbone.Model.extend({
			parse: function(stylesheet) {
				if(stylesheet && stylesheet.length) {
					return parseStylesheet(stripFormatting(stylesheet));
				}

				else return {};
			}
		});

		var parseStylesheet = function(stylesheet) {
			return {
				children: parseDeclarations(stylesheet),
				type: 'stylesheet'
			};
		}

		var parseDeclarations = function(string) {
			var pattern = /[\w]*[\s]\{[\w\s:\n;-]*}/g;
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

		return NewParser;
	}
);