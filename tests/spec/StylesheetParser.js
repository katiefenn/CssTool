define(
	'specs/StylesheetParser',
	['StylesheetParser', 'underscore', 'fixtures/all'],
	function(StylesheetParser, _, fixtures) {
		return describe('The stylesheet parser', function () {
			beforeEach(function() {
				stylesheetParser = new StylesheetParser();

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
				delete stylesheetParser;
			});

			it('returns an empty object when called without a parameter', function() {
				expect(stylesheetParser.parse()).toEqual({});
			});

			it('returns a non-empty object when called with a CSS string parameter', function () {
				expect(stylesheetParser.parse(fixtures.simpleDeclarations)).toBeObject();
				expect(stylesheetParser.parse(fixtures.simpleDeclarations)).not.toBeEmpty();
			});

			it('returns information on the type of node parsed', function() {
				expect(stylesheetParser.parse(fixtures.simpleDeclarations).type).toBe('stylesheet');
			});

			it('returns (n) items of child delcarations for a stylesheet of (n) declarations', function() {
				expect(stylesheetParser.parse(fixtures.simpleDeclarations)).toHaveProperty('children');
				expect(stylesheetParser.parse(fixtures.simpleDeclarations).children.length).toBe(2);
				expect(stylesheetParser.parse(fixtures.multipleDeclarations)).toHaveProperty('children');
				expect(stylesheetParser.parse(fixtures.multipleDeclarations).children.length).toBe(4);
			});
		});
	}
);