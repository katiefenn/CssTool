define(
	'CssTool/CssParser/DataAdaptor',
	['./NodeAdaptor/Selector', './NodeAdaptor/Declaration'],

	function (CssParserNodeAdaptorSelector, CssParserNodeAdaptorDeclaration) {

		function CssParserDataAdaptor() {
			this.catalogItems = [];
		}

		CssParserDataAdaptor.prototype.process = function(cssString) {
			var tokens = tokenize(cssString),
				data = parse(tokens),
				rules = Iterator(data.value);
			for (rule in rules) {
				this.processRule(rule[1]);
			}

			return this.catalogItems;
		};

		CssParserDataAdaptor.prototype.processRule = function(data) {
			if (Object.prototype.toString.call(data.value) == '[object Array]') {
				var properties = Iterator(data.value);
				for (property in properties) {
					this.processDeclaration(property[1]);
				}
			}

			if (typeof data.selector != 'undefined') {
				this.processSelector(data.selector);
			}

			var item = {
				'type': 'rule',
				'string': data.toString()
			}

			//this.catalogItems.push(item);
		};

		CssParserDataAdaptor.prototype.processDeclaration = function(data) {
			var declarationAdaptor = new CssParserNodeAdaptorDeclaration();
			declarationAdaptor.process(data);
		};

		CssParserDataAdaptor.prototype.processSelector = function(data) {
			var selectorAdaptor = new CssParserNodeAdaptorSelector();
			this.catalogItems.push(selectorAdaptor.process(data));
		};

		return CssParserDataAdaptor;
	}
);