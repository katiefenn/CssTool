define(
	'DataAdaptor',
	['NodeAdaptorSelector', 'NodeAdaptorDeclaration','tokenizer', 'parser'],

	function (NodeAdaptorSelector, NodeAdaptorDeclaration, tokenizer, parser) {

		function DataAdaptor() {
			this.catalogItems = [];
		}

		DataAdaptor.prototype.process = function(cssString) {
			var tokens = tokenizer.tokenize(cssString),
				data = parser.parse(tokens);

			for (rule in data.value) {
				if (data.value.hasOwnProperty(rule)) {
					this.processRule(data.value[rule]);
				}
			}

			return this.catalogItems;
		};

		DataAdaptor.prototype.processRule = function(data) {
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

		DataAdaptor.prototype.processDeclaration = function(data) {
			var declarationAdaptor = new NodeAdaptorDeclaration();
			this.catalogItems.push(declarationAdaptor.process(data));
		};

		DataAdaptor.prototype.processSelector = function(data) {
			var selectorAdaptor = new NodeAdaptorSelector();
			this.catalogItems.push(selectorAdaptor.process(data));
		};

		return DataAdaptor;
	}
);