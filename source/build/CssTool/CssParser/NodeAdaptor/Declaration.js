define(
	'CssTool/CssParser/NodeAdaptor/Declaration',
	[],

	function() {

		function CssParserNodeAdaptorDeclaration() {
			this.data = {};
			this.node = {
				'type': 'declaration',
				'property': '',
				'values': []
			};
		}

		CssParserNodeAdaptorDeclaration.prototype.process = function(data) {
			this.data = data;

			this.node.property = this.data.name;
			
			this.data.value.forEach(function(value) {
				this.processValue(value);
			}, this);

			return this.node;
		};

		CssParserNodeAdaptorDeclaration.prototype.processValue = function(value) {
			if(value.tokenType == 'HASH') {
				this.node.values.push(this.processHash(value));
			}
			else if(value.tokenType == 'PERCENTAGE') {
				this.node.values.push(this.processPercentage(value));
			}
			else if(value.tokenType == 'DIMENSION') {
				this.node.values.push(this.processPixel(value));
			}
			else if(value.tokenType == 'URL') {
				this.node.values.push(this.processUrl(value))
			}
			else if(value.tokenType == 'IDENT') {
				this.node.values.push(this.processKeyword(value));
			}
			else if (value.tokenType == 'NUMBER') {
				this.node.values.push(this.processNumber(value));
			}
			else if (value.tokenType == 'STRING') {
				this.node.values.push(this.processString(value));
			}
		};

		CssParserNodeAdaptorDeclaration.prototype.processHash = function(value) {
			return {'value': value.value, 'string': '#' + value.value, 'typeGroup': 'color', 'type': 'rgb', 'format': 'hexadecimal'};
		};

		CssParserNodeAdaptorDeclaration.prototype.processPercentage = function(value) {
			return {'value': value.value, 'string': value.value + '%', 'typeGroup': 'numeric', 'type': 'percentage'};
		};

		CssParserNodeAdaptorDeclaration.prototype.processPixel = function(value) {
			return {'value': value.num, 'string': value.num + 'px', 'typeGroup': 'length', 'type': 'pixels'};
		};

		CssParserNodeAdaptorDeclaration.prototype.processUrl = function(value) {
			return {'value': value.value, 'string': 'url(' + value.value + ')', 'typeGroup': 'textual', 'type': 'url'};
		};

		CssParserNodeAdaptorDeclaration.prototype.processKeyword = function(value) {
			return {'value': value.value, 'string': value.value, 'typeGroup': 'textual', 'type': 'keyword'};
		};

		CssParserNodeAdaptorDeclaration.prototype.processNumber = function(value) {
			return {'value': value.value, 'string': value.value, 'typeGroup': 'numeric', 'type': 'number'};
		};

		CssParserNodeAdaptorDeclaration.prototype.processString = function(value) {
			return {'value': value.value, 'string': value.value, 'typeGroup': 'textual', 'type': 'string'};
		};

		return CssParserNodeAdaptorDeclaration;
	}
);