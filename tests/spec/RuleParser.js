define(
	'specs/RuleParser',
	['RuleParser', 'underscore', 'fixtures/all'],
	function(RuleParser, _, fixtures) {
		return describe('The rule parser', function () {
			beforeEach(function() {
				ruleParser = new RuleParser();

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
				delete ruleParser;
			});

			it('returns collections of selectors and declarations for a rule', function() {
				expect(ruleParser.parse(fixtures.simpleDeclaration)).toHaveProperty('selectors');
				expect(ruleParser.parse(fixtures.simpleDeclaration)).toHaveProperty('declarations');
			});

			it('returns a collection of (n) items of selectors for a rule of (n) selectors', function() {
				expect(ruleParser.parse(fixtures.simpleDeclaration).selectors).toBeOfLength(1);
				expect(ruleParser.parse(fixtures.complexDeclaration).selectors).toBeOfLength(5);
			});

			it('returns a collection of (n) items of declarations for a rule of (n) declarations', function() {
				expect(ruleParser.parse(fixtures.simpleDeclaration).declarations).toBeOfLength(1);
				expect(ruleParser.parse(fixtures.complexDeclaration).declarations).toBeOfLength(2);
			});
		});
	}
);