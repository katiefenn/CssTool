define(
	'DataAdaptor',
	['NodeAdaptorSelector', 'NodeAdaptorDeclaration','tokenizer', 'parser', 'underscore'],

	function (NodeAdaptorSelector, NodeAdaptorDeclaration, tokenizer, parser, _) {

		function DataAdaptor() {
			this.catalogItems = [];
		}

		DataAdaptor.prototype.process = function(cssString) {
			var tokens = tokenizer.tokenize(cssString),
				data = parser.parse(tokens);

			_.each(data.value, function(rule){
				this.processRule(rule);
			}, this);

			return this.catalogItems;
		};

		DataAdaptor.prototype.processRule = function(data) {
			if (_.isArray(data.value)) {
				_.each(data.value, function(property){
					this.processDeclaration(property);
				}, this);
			}

			if (_.has(data, 'selector')) {
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