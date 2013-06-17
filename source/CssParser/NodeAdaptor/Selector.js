define(
	'CssParser/NodeAdaptor/Selector',
	[],
	function () {

		function CssParserNodeAdaptorSelector() {
			this.node = {
				'selectors': [],
				'type': 'selector'
			};
			this.data = {};
			this.dataIndex = 0;
			this.identifierIndex = 0;
			this.selectorIndex = 0;
		}

		CssParserNodeAdaptorSelector.prototype.process = function(data) {
			this.data = data;

			while (!this.endOfTokens()) {
				this.processToken(this.getNextToken());
			}

			return this.node;
		};

		CssParserNodeAdaptorSelector.prototype.processToken = function(token) {
			if (token.tokenType == 'DELIM' && token.value == '.') {
				this.addToCurrentIdentifier('.');
			} else if (token.tokenType == ':') {
				this.addToCurrentIdentifier(':');
			} else if (token.tokenType == 'HASH') {
				this.addToCurrentIdentifier('#' +  token.value);
			} else if (token.tokenType == 'IDENT') {
				this.addToCurrentIdentifier(token.value);
			} else if (token.tokenType == 'WHITESPACE') {
				this.identifierIndex++;
				this.addToCurrentIdentifier(' ');
				this.identifierIndex++;
			} else if (token.tokenType == 'DELIM' && token.value == ',') {
				return;		
			}

			if (this.nextTokenIsDelimiter()) {
				this.selectorIndex++;
			}
		};

		CssParserNodeAdaptorSelector.prototype.addToCurrentIdentifier = function(token) {
			if (typeof this.node.selectors[this.selectorIndex] == 'undefined') {
				this.node.selectors[this.selectorIndex] = [];
				this.identifierIndex = 0;
			}
			if (typeof this.node.selectors[this.selectorIndex][this.identifierIndex] == 'undefined') {
				this.node.selectors[this.selectorIndex][this.identifierIndex] = token;
			} else {
				this.node.selectors[this.selectorIndex][this.identifierIndex] += token;
			}
		};

		CssParserNodeAdaptorSelector.prototype.endOfTokens = function() {
			return this.dataIndex == this.data.length - 1;
		};

		CssParserNodeAdaptorSelector.prototype.getNextToken = function() {
			var currentToken = this.data[this.dataIndex];
			this.dataIndex++;
			return currentToken;
		};

		CssParserNodeAdaptorSelector.prototype.nextTokenIsWhitespace = function() {
			return !this.endOfTokens() && this.data[this.dataIndex].tokenType == 'WHITESPACE';
		};

		CssParserNodeAdaptorSelector.prototype.nextTokenIsDelimiter = function() {
			return !this.endOfTokens() 
				&& this.data[this.dataIndex].tokenType == 'DELIM'
				&& this.data[this.dataIndex].value == ',';
		};

		return CssParserNodeAdaptorSelector;
	}
);