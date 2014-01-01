define(
	'specs/SelectorParser',
	['SelectorParser', 'underscore', 'fixtures/all'],
	function(SelectorParser, _, fixtures) {
		return describe('The selector parser', function () {
			beforeEach(function() {
				selectorParser = new SelectorParser();

				this.addMatchers({
					toHaveProperty: function(expected) {
						return _.has(this.actual, expected);
					},
					toBeObject: function() {
						return _.isObject(this.actual);
					},
					toBeEmpty: function() {
						return _.isEmpty(this.actual);
					},
					toBeOfLength: function(expected) {
						return this.actual.length == expected;
					}
				});
			});

			afterEach(function() {
				delete selectorParser;
			});

			it('returns information on the type of node parsed', function() {
				expect(selectorParser.parse('#my-form').type).toBe('selector');
			});

			it('returns collections of identifiers for a selector', function() {
				expect(selectorParser.parse('#my-form')).toHaveProperty('identifiers');
			});

			it('returns a collection of (n) items for a rule of (n) identifiers', function() {
				expect(selectorParser.parse('#my-form').identifiers).toBeOfLength(1);
				expect(selectorParser.parse('#my-form #username.error').identifiers).toBeOfLength(3);
				expect(selectorParser.parse('#my-form input[name=username]').identifiers).toBeOfLength(3);
			});
		});
	}
);