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

			it('returns a collection of (n) items for a selector of (n) identifiers', function() {
				expect(selectorParser.parse('#my-form').identifiers).toBeOfLength(1);
				expect(selectorParser.parse('#my-form #username.error').identifiers).toBeOfLength(3);
				expect(selectorParser.parse('#my-form input[name=username]').identifiers).toBeOfLength(3);
			});

			it('correctly parses universal identifiers in a selector', function() {
				expect(selectorParser.parse('body .list *:first-child').identifiers).toBeOfLength(4);
			});

			it('correctly parses type identifiers in a selector', function() {
				expect(selectorParser.parse('body form input').identifiers).toBeOfLength(3);
			});

			it('correctly parses class identifiers in a selector', function() {
				expect(selectorParser.parse('.login-form .checkbox.error').identifiers).toBeOfLength(3);
			});

			it('correctly parses id identifiers in a selector', function() {
				expect(selectorParser.parse('#login-page #form#login-form input#password.error').identifiers).toBeOfLength(6);
			});

			it('correctly parses attribute identifiers in a selector', function() {
				expect(selectorParser.parse('form[name=login-form]').identifiers).toBeOfLength(2);
				expect(selectorParser.parse('a[rel][]').identifiers).toBeOfLength(2);
				expect(selectorParser.parse('a[rel~="copyright"]').identifiers).toBeOfLength(2);
				expect(selectorParser.parse('a[hreflang|="en"]').identifiers).toBeOfLength(2);
				expect(selectorParser.parse('a[hreflang=fr]').identifiers).toBeOfLength(2);
			});

			it('correctly parses pseudo-class identifiers in a selector', function() {
				expect(selectorParser.parse('a:first-child').identifiers).toBeOfLength(2);
			});

			it('correctly parses pseudo-element identifiers in a selector', function() {
				expect(selectorParser.parse('p::first-line').identifiers).toBeOfLength(2);
			})
		});
	}
);