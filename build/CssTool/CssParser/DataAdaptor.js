define(
	'CssTool/CssParser/DataAdaptor',
	['./NodeAdaptor/Selector', './NodeAdaptor/Declaration','tokenizer', 'parser'],

	function (CssParserNodeAdaptorSelector, CssParserNodeAdaptorDeclaration, tokenizer, parser) {

		function CssParserDataAdaptor() {
			this.catalogItems = [];
		}

		CssParserDataAdaptor.prototype.process = function(cssString) {
			var tokens = tokenizer.tokenize(cssString),
				data = parser.parse(tokens);

			for (rule in data.value) {
				if (data.value.hasOwnProperty(rule)) {
					this.processRule(data.value[rule]);
				}
			}

			return this.catalogItems;
		};

		CssParserDataAdaptor.prototype.processRule = function(data) {
			if (Object.prototype.toString.call(data.value) == '[object Array]') {
				for (property in data.value) {
					if (data.value.hasOwnProperty(property)) {
						this.processDeclaration(data.value[property]);
					}
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
			this.catalogItems.push(declarationAdaptor.process(data));
		};

		CssParserDataAdaptor.prototype.processSelector = function(data) {
			var selectorAdaptor = new CssParserNodeAdaptorSelector();
			this.catalogItems.push(selectorAdaptor.process(data));
		};

		return CssParserDataAdaptor;
	}
);