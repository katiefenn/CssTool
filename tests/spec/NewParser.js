define(
	'specs/NewParser',
	['NewParser', 'underscore', 'fixtures/all'],
	function(NewParser, _, fixtures) {
		return describe('The parser', function () {
			beforeEach(function() {
				newParser = new NewParser();

				this.addMatchers({
					toHaveProperty: function(expected) {
						return _.has(this.actual, expected);
					},
					toBeObject: function() {
						return _.isObject(this.actual);
					},
					toBeEmpty: function() {
						return _.isEmpty(this.actual);
					}
				});
			});

			afterEach(function() {
				delete newParser;
			});

			it('returns an empty object when called without a parameter', function() {
				expect(newParser.parse()).toEqual({});
			});

			it('returns a non-empty object when called with a CSS string parameter', function () {
				expect(newParser.parse(fixtures.simpleDeclarations)).toBeObject();
				expect(newParser.parse(fixtures.simpleDeclarations)).not.toBeEmpty();
			});

			it('returns data of child declarations of a stylesheet with declarations', function() {
				expect(newParser.parse(fixtures.simpleDeclarations)).toHaveProperty('children');
				expect(newParser.parse(fixtures.simpleDeclarations).children.length).toBeGreaterThan(0);
			});
		});
	}
);