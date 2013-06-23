
define(
    'NodeAdaptorSelector',
    [],
    function () {

        function NodeAdaptorSelector() {
            this.node = {
                'selectors': [],
                'type': 'selector'
            };
            this.data = {};
            this.dataIndex = 0;
            this.identifierIndex = 0;
            this.selectorIndex = 0;
        }

        NodeAdaptorSelector.prototype.process = function(data) {
            this.data = data;

            while (!this.endOfTokens()) {
                this.processToken(this.getNextToken());
            }

            return this.node;
        };

        NodeAdaptorSelector.prototype.processToken = function(token) {
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

        NodeAdaptorSelector.prototype.addToCurrentIdentifier = function(token) {
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

        NodeAdaptorSelector.prototype.endOfTokens = function() {
            return this.dataIndex == this.data.length - 1;
        };

        NodeAdaptorSelector.prototype.getNextToken = function() {
            var currentToken = this.data[this.dataIndex];
            this.dataIndex++;
            return currentToken;
        };

        NodeAdaptorSelector.prototype.nextTokenIsWhitespace = function() {
            return !this.endOfTokens() && this.data[this.dataIndex].tokenType == 'WHITESPACE';
        };

        NodeAdaptorSelector.prototype.nextTokenIsDelimiter = function() {
            return !this.endOfTokens() &&
                this.data[this.dataIndex].tokenType == 'DELIM' &&
                this.data[this.dataIndex].value == ',';
        };

        return NodeAdaptorSelector;
    }
);
define(
    'NodeAdaptorDeclaration',
    [],

    function() {

        function NodeAdaptorDeclaration() {
            this.data = {};
            this.node = {
                'type': 'declaration',
                'property': '',
                'values': []
            };
        }

        NodeAdaptorDeclaration.prototype.process = function(data) {
            this.data = data;

            this.node.property = this.data.name;

            _.each(this.data.value, function(value){
                this.processValue(value);
            }, this);

            return this.node;
        };

        NodeAdaptorDeclaration.prototype.processValue = function(value) {
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
                this.node.values.push(this.processUrl(value));
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

        NodeAdaptorDeclaration.prototype.processHash = function(value) {
            return {'value': value.value, 'string': '#' + value.value, 'typeGroup': 'color', 'type': 'rgb', 'format': 'hexadecimal'};
        };

        NodeAdaptorDeclaration.prototype.processPercentage = function(value) {
            return {'value': value.value, 'string': value.value + '%', 'typeGroup': 'numeric', 'type': 'percentage'};
        };

        NodeAdaptorDeclaration.prototype.processPixel = function(value) {
            return {'value': value.num, 'string': value.num + 'px', 'typeGroup': 'length', 'type': 'pixels'};
        };

        NodeAdaptorDeclaration.prototype.processUrl = function(value) {
            return {'value': value.value, 'string': 'url(' + value.value + ')', 'typeGroup': 'textual', 'type': 'url'};
        };

        NodeAdaptorDeclaration.prototype.processKeyword = function(value) {
            return {'value': value.value, 'string': value.value, 'typeGroup': 'textual', 'type': 'keyword'};
        };

        NodeAdaptorDeclaration.prototype.processNumber = function(value) {
            return {'value': value.value, 'string': value.value, 'typeGroup': 'numeric', 'type': 'number'};
        };

        NodeAdaptorDeclaration.prototype.processString = function(value) {
            return {'value': value.value, 'string': value.value, 'typeGroup': 'textual', 'type': 'string'};
        };

        return NodeAdaptorDeclaration;
    }
);
(function (root, factory) {
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
    // Rhino, and plain browser loading.
    if (typeof define === 'function' && define.amd) {
        define('tokenizer',['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory(root);
    }
}(this, function (exports) {

var between = function (num, first, last) { return num >= first && num <= last; }
function digit(code) { return between(code, 0x30,0x39); }
function hexdigit(code) { return digit(code) || between(code, 0x41,0x46) || between(code, 0x61,0x66); }
function uppercaseletter(code) { return between(code, 0x41,0x5a); }
function lowercaseletter(code) { return between(code, 0x61,0x7a); }
function letter(code) { return uppercaseletter(code) || lowercaseletter(code); }
function nonascii(code) { return code >= 0xa0; }
function namestartchar(code) { return letter(code) || nonascii(code) || code == 0x5f; }
function namechar(code) { return namestartchar(code) || digit(code) || code == 0x2d; }
function nonprintable(code) { return between(code, 0,8) || between(code, 0xe,0x1f) || between(code, 0x7f,0x9f); }
function newline(code) { return code == 0xa || code == 0xc; }
function whitespace(code) { return newline(code) || code == 9 || code == 0x20; }
function badescape(code) { return newline(code) || isNaN(code); }

// Note: I'm not yet acting smart enough to actually handle astral characters.
var maximumallowedcodepoint = 0x10ffff;

function tokenize(str, options) {
	if(options == undefined) options = {transformFunctionWhitespace:false, scientificNotation:false};
	var i = -1;
	var tokens = [];
	var state = "data";
	var code;
	var currtoken;

	// Line number information.
	var line = 0;
	var column = 0;
	// The only use of lastLineLength is in reconsume().
	var lastLineLength = 0;
	var incrLineno = function() {
		line += 1;
		lastLineLength = column;
		column = 0;
	};
	var locStart = {line:line, column:column};

	var next = function(num) { if(num === undefined) num = 1; return str.charCodeAt(i+num); };
	var consume = function(num) {
		if(num === undefined)
			num = 1;
		i += num;
		code = str.charCodeAt(i);
		if (newline(code)) incrLineno();
		else column += num;
		//console.log('Consume '+i+' '+String.fromCharCode(code) + ' 0x' + code.toString(16));
		return true;
	};
	var reconsume = function() {
		i -= 1;
		if (newline(code)) {
			line -= 1;
			column = lastLineLength;
		} else {
			column -= 1;
		}
		locStart.line = line;
		locStart.column = column;
		return true;
	};
	var eof = function() { return i >= str.length; };
	var donothing = function() {};
	var emit = function(token) {
		if(token) {
			token.finish();
		} else {
			token = currtoken.finish();
		}
		if (options.loc === true) {
			token.loc = {};
			token.loc.start = {line:locStart.line, column:locStart.column};
			locStart = {line: line, column: column};
			token.loc.end = locStart;
		}
		tokens.push(token);
		//console.log('Emitting ' + token);
		currtoken = undefined;
		return true;
	};
	var create = function(token) { currtoken = token; return true; };
	var parseerror = function() { console.log("Parse error at index " + i + ", processing codepoint 0x" + code.toString(16) + " in state " + state + ".");return true; };
	var catchfire = function(msg) { console.log("MAJOR SPEC ERROR: " + msg); return true;}
	var switchto = function(newstate) {
		state = newstate;
		//console.log('Switching to ' + state);
		return true;
	};
	var consumeEscape = function() {
		// Assume the the current character is the \
		consume();
		if(hexdigit(code)) {
			// Consume 1-6 hex digits
			var digits = [];
			for(var total = 0; total < 6; total++) {
				if(hexdigit(code)) {
					digits.push(code);
					consume();
				} else { break; }
			}
			var value = parseInt(digits.map(String.fromCharCode).join(''), 16);
			if( value > maximumallowedcodepoint ) value = 0xfffd;
			// If the current char is whitespace, cool, we'll just eat it.
			// Otherwise, put it back.
			if(!whitespace(code)) reconsume();
			return value;
		} else {
			return code;
		}
	};

	for(;;) {
		if(i > str.length*2) return "I'm infinite-looping!";
		consume();
		switch(state) {
		case "data":
			if(whitespace(code)) {
				emit(new WhitespaceToken);
				while(whitespace(next())) consume();
			}
			else if(code == 0x22) switchto("double-quote-string");
			else if(code == 0x23) switchto("hash");
			else if(code == 0x27) switchto("single-quote-string");
			else if(code == 0x28) emit(new OpenParenToken);
			else if(code == 0x29) emit(new CloseParenToken);
			else if(code == 0x2b) {
				if(digit(next()) || (next() == 0x2e && digit(next(2)))) switchto("number") && reconsume();
				else emit(new DelimToken(code));
			}
			else if(code == 0x2d) {
				if(next(1) == 0x2d && next(2) == 0x3e) consume(2) && emit(new CDCToken);
				else if(digit(next()) || (next(1) == 0x2e && digit(next(2)))) switchto("number") && reconsume();
				else switchto('ident') && reconsume();
			}
			else if(code == 0x2e) {
				if(digit(next())) switchto("number") && reconsume();
				else emit(new DelimToken(code));
			}
			else if(code == 0x2f) {
				if(next() == 0x2a) consume() && switchto("comment");
				else emit(new DelimToken(code));
			}
			else if(code == 0x3a) emit(new ColonToken);
			else if(code == 0x3b) emit(new SemicolonToken);
			else if(code == 0x3c) {
				if(next(1) == 0x21 && next(2) == 0x2d && next(3) == 0x2d) consume(3) && emit(new CDOToken);
				else emit(new DelimToken(code));
			}
			else if(code == 0x40) switchto("at-keyword");
			else if(code == 0x5b) emit(new OpenSquareToken);
			else if(code == 0x5c) {
				if(badescape(next())) parseerror() && emit(new DelimToken(code));
				else switchto('ident') && reconsume();
			}
			else if(code == 0x5d) emit(new CloseSquareToken);
			else if(code == 0x7b) emit(new OpenCurlyToken);
			else if(code == 0x7d) emit(new CloseCurlyToken);
			else if(digit(code)) switchto("number") && reconsume();
			else if(code == 0x55 || code == 0x75) {
				if(next(1) == 0x2b && hexdigit(next(2))) consume() && switchto("unicode-range");
				else switchto('ident') && reconsume();
			}
			else if(namestartchar(code)) switchto('ident') && reconsume();
			else if(eof()) { emit(new EOFToken); return tokens; }
			else emit(new DelimToken(code));
			break;

		case "double-quote-string":
			if(currtoken == undefined) create(new StringToken);

			if(code == 0x22) emit() && switchto("data");
			else if(eof()) parseerror() && emit() && switchto("data") && reconsume();
			else if(newline(code)) parseerror() && emit(new BadStringToken) && switchto("data") && reconsume();
			else if(code == 0x5c) {
				if(badescape(next())) parseerror() && emit(new BadStringToken) && switchto("data");
				else if(newline(next())) consume();
				else currtoken.append(consumeEscape());
			}
			else currtoken.append(code);
			break;

		case "single-quote-string":
			if(currtoken == undefined) create(new StringToken);

			if(code == 0x27) emit() && switchto("data");
			else if(eof()) parseerror() && emit() && switchto("data");
			else if(newline(code)) parseerror() && emit(new BadStringToken) && switchto("data") && reconsume();
			else if(code == 0x5c) {
				if(badescape(next())) parseerror() && emit(new BadStringToken) && switchto("data");
				else if(newline(next())) consume();
				else currtoken.append(consumeEscape());
			}
			else currtoken.append(code);
			break;

		case "hash":
			if(namechar(code)) create(new HashToken(code)) && switchto("hash-rest");
			else if(code == 0x5c) {
				if(badescape(next())) parseerror() && emit(new DelimToken(0x23)) && switchto("data") && reconsume();
				else create(new HashToken(consumeEscape())) && switchto('hash-rest');
			}
			else emit(new DelimToken(0x23)) && switchto('data') && reconsume();
			break;

		case "hash-rest":
			if(namechar(code)) currtoken.append(code);
			else if(code == 0x5c) {
				if(badescape(next())) parseerror() && emit() && switchto("data") && reconsume();
				else currtoken.append(consumeEscape());
			}
			else emit() && switchto('data') && reconsume();
			break;

		case "comment":
			if(code == 0x2a) {
				if(next() == 0x2f) consume() && switchto('data');
				else donothing();
			}
			else if(eof()) parseerror() && switchto('data') && reconsume();
			else donothing();
			break;

		case "at-keyword":
			if(code == 0x2d) {
				if(namestartchar(next())) create(new AtKeywordToken(0x2d)) && switchto('at-keyword-rest');
				else if(next(1) == 0x5c && !badescape(next(2))) create(new AtKeywordtoken(0x2d)) && switchto('at-keyword-rest');
				else parseerror() && emit(new DelimToken(0x40)) && switchto('data') && reconsume();
			}
			else if(namestartchar(code)) create(new AtKeywordToken(code)) && switchto('at-keyword-rest');
			else if(code == 0x5c) {
				if(badescape(next())) parseerror() && emit(new DelimToken(0x23)) && switchto("data") && reconsume();
				else create(new AtKeywordToken(consumeEscape())) && switchto('at-keyword-rest');
			}
			else emit(new DelimToken(0x40)) && switchto('data') && reconsume();
			break;

		case "at-keyword-rest":
			if(namechar(code)) currtoken.append(code);
			else if(code == 0x5c) {
				if(badescape(next())) parseerror() && emit() && switchto("data") && reconsume();
				else currtoken.append(consumeEscape());
			}
			else emit() && switchto('data') && reconsume();
			break;

		case "ident":
			if(code == 0x2d) {
				if(namestartchar(next())) create(new IdentifierToken(code)) && switchto('ident-rest');
				else if(next(1) == 0x5c && !badescape(next(2))) create(new IdentifierToken(code)) && switchto('ident-rest');
				else emit(new DelimToken(0x2d)) && switchto('data');
			}
			else if(namestartchar(code)) create(new IdentifierToken(code)) && switchto('ident-rest');
			else if(code == 0x5c) {
				if(badescape(next())) parseerror() && switchto("data") && reconsume();
				else create(new IdentifierToken(consumeEscape())) && switchto('ident-rest');
			}
			else catchfire("Hit the generic 'else' clause in ident state.") && switchto('data') && reconsume();
			break;

		case "ident-rest":
			if(namechar(code)) currtoken.append(code);
			else if(code == 0x5c) {
				if(badescape(next())) parseerror() && emit() && switchto("data") && reconsume();
				else currtoken.append(consumeEscape());
			}
			else if(code == 0x28) {
				if(currtoken.ASCIImatch('url')) switchto('url');
				else emit(new FunctionToken(currtoken)) && switchto('data');
			} 
			else if(whitespace(code) && options.transformFunctionWhitespace) switchto('transform-function-whitespace') && reconsume();
			else emit() && switchto('data') && reconsume();
			break;

		case "transform-function-whitespace":
			if(whitespace(next())) donothing();
			else if(code == 0x28) emit(new FunctionToken(currtoken)) && switchto('data');
			else emit() && switchto('data') && reconsume();
			break;

		case "number":
			create(new NumberToken());

			if(code == 0x2d) {
				if(digit(next())) consume() && currtoken.append([0x2d,code]) && switchto('number-rest');
				else if(next(1) == 0x2e && digit(next(2))) consume(2) && currtoken.append([0x2d,0x2e,code]) && switchto('number-fraction');
				else switchto('data') && reconsume();
			}
			else if(code == 0x2b) {
				if(digit(next())) consume() && currtoken.append([0x2b,code]) && switchto('number-rest');
				else if(next(1) == 0x2e && digit(next(2))) consume(2) && currtoken.append([0x2b,0x2e,code]) && switchto('number-fraction');
				else switchto('data') && reconsume();
			}
			else if(digit(code)) currtoken.append(code) && switchto('number-rest');
			else if(code == 0x2e) {
				if(digit(next())) consume() && currtoken.append([0x2e,code]) && switchto('number-fraction');
				else switchto('data') && reconsume();
			}
			else switchto('data') && reconsume();
			break;

		case "number-rest":
			if(digit(code)) currtoken.append(code);
			else if(code == 0x2e) {
				if(digit(next())) consume() && currtoken.append([0x2e,code]) && switchto('number-fraction');
				else emit() && switchto('data') && reconsume();
			}
			else if(code == 0x25) emit(new PercentageToken(currtoken)) && switchto('data');
			else if(code == 0x45 || code == 0x65) {
				if(digit(next())) consume() && currtoken.append([0x25,code]) && switchto('sci-notation');
				else if((next(1) == 0x2b || next(1) == 0x2d) && digit(next(2))) currtoken.append([0x25,next(1),next(2)]) && consume(2) && switchto('sci-notation');
				else create(new DimensionToken(currtoken,code)) && switchto('dimension');
			}
			else if(code == 0x2d) {
				if(namestartchar(next())) consume() && create(new DimensionToken(currtoken,[0x2d,code])) && switchto('dimension');
				else if(next(1) == 0x5c && badescape(next(2))) parseerror() && emit() && switchto('data') && reconsume();
				else if(next(1) == 0x5c) consume() && create(new DimensionToken(currtoken, [0x2d,consumeEscape()])) && switchto('dimension');
				else emit() && switchto('data') && reconsume();
			}
			else if(namestartchar(code)) create(new DimensionToken(currtoken, code)) && switchto('dimension');
			else if(code == 0x5c) {
				if(badescape(next)) parseerror() && emit() && switchto('data') && reconsume();
				else create(new DimensionToken(currtoken,consumeEscape)) && switchto('dimension');
			}
			else emit() && switchto('data') && reconsume();
			break;

		case "number-fraction":
			currtoken.type = "number";

			if(digit(code)) currtoken.append(code);
			else if(code == 0x25) emit(new PercentageToken(currtoken)) && switchto('data');
			else if(code == 0x45 || code == 0x65) {
				if(digit(next())) consume() && currtoken.append([0x65,code]) && switchto('sci-notation');
				else if((next(1) == 0x2b || next(1) == 0x2d) && digit(next(2))) currtoken.append([0x65,next(1),next(2)]) && consume(2) && switchto('sci-notation');
				else create(new DimensionToken(currtoken,code)) && switchto('dimension');
			}
			else if(code == 0x2d) {
				if(namestartchar(next())) consume() && create(new DimensionToken(currtoken,[0x2d,code])) && switchto('dimension');
				else if(next(1) == 0x5c && badescape(next(2))) parseerror() && emit() && switchto('data') && reconsume();
				else if(next(1) == 0x5c) consume() && create(new DimensionToken(currtoken, [0x2d,consumeEscape()])) && switchto('dimension');
				else emit() && switchto('data') && reconsume();
			}
			else if(namestartchar(code)) create(new DimensionToken(currtoken, code)) && switchto('dimension');
			else if(code == 0x5c) {
				if(badescape(next)) parseerror() && emit() && switchto('data') && reconsume();
				else create(new DimensionToken(currtoken,consumeEscape())) && switchto('dimension');
			}
			else emit() && switchto('data') && reconsume();
			break;

		case "dimension":
			if(namechar(code)) currtoken.append(code);
			else if(code == 0x5c) {
				if(badescape(next())) parseerror() && emit() && switchto('data') && reconsume();
				else currtoken.append(consumeEscape());
			}
			else emit() && switchto('data') && reconsume();
			break;

		case "sci-notation":
			currtoken.type = "number";

			if(digit(code)) currtoken.append(code);
			else emit() && switchto('data') && reconsume();
			break;

		case "url":
			if(eof()) parseerror() && emit(new BadURLToken) && switchto('data');
			else if(code == 0x22) switchto('url-double-quote');
			else if(code == 0x27) switchto('url-single-quote');
			else if(code == 0x29) emit(new URLToken) && switchto('data');
			else if(whitespace(code)) donothing();
			else switchto('url-unquoted') && reconsume();
			break;

		case "url-double-quote":
			if(! (currtoken instanceof URLToken)) create(new URLToken);

			if(eof()) parseerror() && emit(new BadURLToken) && switchto('data');
			else if(code == 0x22) switchto('url-end');
			else if(newline(code)) parseerror() && switchto('bad-url');
			else if(code == 0x5c) {
				if(newline(next())) consume();
				else if(badescape(next())) parseerror() && emit(new BadURLToken) && switchto('data') && reconsume();
				else currtoken.append(consumeEscape());
			}
			else currtoken.append(code);
			break;

		case "url-single-quote":
			if(! (currtoken instanceof URLToken)) create(new URLToken);

			if(eof()) parseerror() && emit(new BadURLToken) && switchto('data');
			else if(code == 0x27) switchto('url-end');
			else if(newline(code)) parseerror() && switchto('bad-url');
			else if(code == 0x5c) {
				if(newline(next())) consume();
				else if(badescape(next())) parseerror() && emit(new BadURLToken) && switchto('data') && reconsume();
				else currtoken.append(consumeEscape());
			}
			else currtoken.append(code);
			break;

		case "url-end":
			if(eof()) parseerror() && emit(new BadURLToken) && switchto('data');
			else if(whitespace(code)) donothing();
			else if(code == 0x29) emit() && switchto('data');
			else parseerror() && switchto('bad-url') && reconsume();
			break;

		case "url-unquoted":
			if(! (currtoken instanceof URLToken)) create(new URLToken);

			if(eof()) parseerror() && emit(new BadURLToken) && switchto('data');
			else if(whitespace(code)) switchto('url-end');
			else if(code == 0x29) emit() && switchto('data');
			else if(code == 0x22 || code == 0x27 || code == 0x28 || nonprintable(code)) parseerror() && switchto('bad-url');
			else if(code == 0x5c) {
				if(badescape(next())) parseerror() && switchto('bad-url');
				else currtoken.append(consumeEscape());
			}
			else currtoken.append(code);
			break;

		case "bad-url":
			if(eof()) parseerror() && emit(new BadURLToken) && switchto('data');
			else if(code == 0x29) emit(new BadURLToken) && switchto('data');
			else if(code == 0x5c) {
				if(badescape(next())) donothing();
				else consumeEscape();
			}
			else donothing();
			break;

		case "unicode-range":
			// We already know that the current code is a hexdigit.

			var start = [code], end = [code];

			for(var total = 1; total < 6; total++) {
				if(hexdigit(next())) {
					consume();
					start.push(code);
					end.push(code);
				}
				else break;
			}

			if(next() == 0x3f) {
				for(;total < 6; total++) {
					if(next() == 0x3f) {
						consume();
						start.push("0".charCodeAt(0));
						end.push("f".charCodeAt(0));
					}
					else break;
				}
				emit(new UnicodeRangeToken(start,end)) && switchto('data');
			}
			else if(next(1) == 0x2d && hexdigit(next(2))) {
				consume();
				consume();
				end = [code];
				for(var total = 1; total < 6; total++) {
					if(hexdigit(next())) {
						consume();
						end.push(code);
					}
					else break;
				}
				emit(new UnicodeRangeToken(start,end)) && switchto('data');
			}
			else emit(new UnicodeRangeToken(start)) && switchto('data');
			break;

		default:
			catchfire("Unknown state '" + state + "'");
		}
	}
}

function stringFromCodeArray(arr) {
	return String.fromCharCode.apply(null,arr.filter(function(e){return e;}));
}

function CSSParserToken(options) { return this; }
CSSParserToken.prototype.finish = function() { return this; }
CSSParserToken.prototype.toString = function() { return this.tokenType; }
CSSParserToken.prototype.toJSON = function() { return this.toString(); }

function BadStringToken() { return this; }
BadStringToken.prototype = new CSSParserToken;
BadStringToken.prototype.tokenType = "BADSTRING";

function BadURLToken() { return this; }
BadURLToken.prototype = new CSSParserToken;
BadURLToken.prototype.tokenType = "BADURL";

function WhitespaceToken() { return this; }
WhitespaceToken.prototype = new CSSParserToken;
WhitespaceToken.prototype.tokenType = "WHITESPACE";
WhitespaceToken.prototype.toString = function() { return "WS"; }

function CDOToken() { return this; }
CDOToken.prototype = new CSSParserToken;
CDOToken.prototype.tokenType = "CDO";

function CDCToken() { return this; }
CDCToken.prototype = new CSSParserToken;
CDCToken.prototype.tokenType = "CDC";

function ColonToken() { return this; }
ColonToken.prototype = new CSSParserToken;
ColonToken.prototype.tokenType = ":";

function SemicolonToken() { return this; }
SemicolonToken.prototype = new CSSParserToken;
SemicolonToken.prototype.tokenType = ";";

function OpenCurlyToken() { return this; }
OpenCurlyToken.prototype = new CSSParserToken;
OpenCurlyToken.prototype.tokenType = "{";

function CloseCurlyToken() { return this; }
CloseCurlyToken.prototype = new CSSParserToken;
CloseCurlyToken.prototype.tokenType = "}";

function OpenSquareToken() { return this; }
OpenSquareToken.prototype = new CSSParserToken;
OpenSquareToken.prototype.tokenType = "[";

function CloseSquareToken() { return this; }
CloseSquareToken.prototype = new CSSParserToken;
CloseSquareToken.prototype.tokenType = "]";

function OpenParenToken() { return this; }
OpenParenToken.prototype = new CSSParserToken;
OpenParenToken.prototype.tokenType = "(";

function CloseParenToken() { return this; }
CloseParenToken.prototype = new CSSParserToken;
CloseParenToken.prototype.tokenType = ")";

function EOFToken() { return this; }
EOFToken.prototype = new CSSParserToken;
EOFToken.prototype.tokenType = "EOF";

function DelimToken(code) {
	this.value = String.fromCharCode(code);
	return this;
}
DelimToken.prototype = new CSSParserToken;
DelimToken.prototype.tokenType = "DELIM";
DelimToken.prototype.toString = function() { return "DELIM("+this.value+")"; }

function StringValuedToken() { return this; }
StringValuedToken.prototype = new CSSParserToken;
StringValuedToken.prototype.append = function(val) {
	if(val instanceof Array) {
		for(var i = 0; i < val.length; i++) {
			this.value.push(val[i]);
		}
	} else {
		this.value.push(val);
	}
	return true;
}
StringValuedToken.prototype.finish = function() {
	this.value = this.valueAsString();
	return this;
}
StringValuedToken.prototype.ASCIImatch = function(str) {
	return this.valueAsString().toLowerCase() == str.toLowerCase();
}
StringValuedToken.prototype.valueAsString = function() {
	if(typeof this.value == 'string') return this.value;
	return stringFromCodeArray(this.value);
}
StringValuedToken.prototype.valueAsCodes = function() {
	if(typeof this.value == 'string') {
		var ret = [];
		for(var i = 0; i < this.value.length; i++)
			ret.push(this.value.charCodeAt(i));
		return ret;
	}
	return this.value.filter(function(e){return e;});
}

function IdentifierToken(val) {
	this.value = [];
	this.append(val);
}
IdentifierToken.prototype = new StringValuedToken;
IdentifierToken.prototype.tokenType = "IDENT";
IdentifierToken.prototype.toString = function() { return "IDENT("+this.value+")"; }

function FunctionToken(val) {
	// These are always constructed by passing an IdentifierToken
	this.value = val.finish().value;
}
FunctionToken.prototype = new StringValuedToken;
FunctionToken.prototype.tokenType = "FUNCTION";
FunctionToken.prototype.toString = function() { return "FUNCTION("+this.value+")"; }

function AtKeywordToken(val) {
	this.value = [];
	this.append(val);
}
AtKeywordToken.prototype = new StringValuedToken;
AtKeywordToken.prototype.tokenType = "AT-KEYWORD";
AtKeywordToken.prototype.toString = function() { return "AT("+this.value+")"; }

function HashToken(val) {
	this.value = [];
	this.append(val);
}
HashToken.prototype = new StringValuedToken;
HashToken.prototype.tokenType = "HASH";
HashToken.prototype.toString = function() { return "HASH("+this.value+")"; }

function StringToken(val) {
	this.value = [];
	this.append(val);
}
StringToken.prototype = new StringValuedToken;
StringToken.prototype.tokenType = "STRING";
StringToken.prototype.toString = function() { return "\""+this.value+"\""; }

function URLToken(val) {
	this.value = [];
	this.append(val);
}
URLToken.prototype = new StringValuedToken;
URLToken.prototype.tokenType = "URL";
URLToken.prototype.toString = function() { return "URL("+this.value+")"; }

function NumberToken(val) {
	this.value = [];
	this.append(val);
	this.type = "integer";
}
NumberToken.prototype = new StringValuedToken;
NumberToken.prototype.tokenType = "NUMBER";
NumberToken.prototype.toString = function() {
	if(this.type == "integer")
		return "INT("+this.value+")";
	return "NUMBER("+this.value+")";
}
NumberToken.prototype.finish = function() {
	this.repr = this.valueAsString();
	this.value = this.repr * 1;
	if(Math.abs(this.value) % 1 != 0) this.type = "number";
	return this;
}

function PercentageToken(val) {
	// These are always created by passing a NumberToken as val
	val.finish();
	this.value = val.value;
	this.repr = val.repr;
}
PercentageToken.prototype = new CSSParserToken;
PercentageToken.prototype.tokenType = "PERCENTAGE";
PercentageToken.prototype.toString = function() { return "PERCENTAGE("+this.value+")"; }

function DimensionToken(val,unit) {
	// These are always created by passing a NumberToken as the val
	val.finish();
	this.num = val.value;
	this.unit = [];
	this.repr = val.repr;
	this.append(unit);
}
DimensionToken.prototype = new CSSParserToken;
DimensionToken.prototype.tokenType = "DIMENSION";
DimensionToken.prototype.toString = function() { return "DIM("+this.num+","+this.unit+")"; }
DimensionToken.prototype.append = function(val) {
	if(val instanceof Array) {
		for(var i = 0; i < val.length; i++) {
			this.unit.push(val[i]);
		}
	} else {
		this.unit.push(val);
	}
	return true;
}
DimensionToken.prototype.finish = function() {
	this.unit = stringFromCodeArray(this.unit);
	this.repr += this.unit;
	return this;
}

function UnicodeRangeToken(start,end) {
	// start and end are array of char codes, completely finished
	start = parseInt(stringFromCodeArray(start),16);
	if(end === undefined) end = start + 1;
	else end = parseInt(stringFromCodeArray(end),16);

	if(start > maximumallowedcodepoint) end = start;
	if(end < start) end = start;
	if(end > maximumallowedcodepoint) end = maximumallowedcodepoint;

	this.start = start;
	this.end = end;
	return this;
}
UnicodeRangeToken.prototype = new CSSParserToken;
UnicodeRangeToken.prototype.tokenType = "UNICODE-RANGE";
UnicodeRangeToken.prototype.toString = function() {
	if(this.start+1 == this.end)
		return "UNICODE-RANGE("+this.start.toString(16).toUpperCase()+")";
	if(this.start < this.end)
		return "UNICODE-RANGE("+this.start.toString(16).toUpperCase()+"-"+this.end.toString(16).toUpperCase()+")";
	return "UNICODE-RANGE()";
}
UnicodeRangeToken.prototype.contains = function(code) {
	return code >= this.start && code < this.end;
}


// Exportation.
// TODO: also export the various tokens objects?
exports.tokenize = tokenize;

}));

(function (root, factory) {
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
    // Rhino, and plain browser loading.
    if (typeof define === 'function' && define.amd) {
        define('parser',['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory(root);
    }
}(this, function (exports) {

function parse(tokens) {
	var mode = 'top-level';
	var i = -1;
	var token;

	var stylesheet = new Stylesheet;
	var stack = [stylesheet];
	var rule = stack[0];

	var consume = function(advance) {
		if(advance === undefined) advance = 1;
		i += advance;
		if(i < tokens.length)
			token = tokens[i];
		else
			token = new EOFToken;
		return true;
	};
	var reprocess = function() {
		i--;
		return true;
	}
	var next = function() {
		return tokens[i+1];
	};
	var switchto = function(newmode) {
		if(newmode === undefined) {
			if(rule.fillType !== '')
				mode = rule.fillType;
			else if(rule.type == 'STYLESHEET')
				mode = 'top-level'
			else { console.log("Unknown rule-type while switching to current rule's content mode: ",rule); mode = ''; }
		} else {
			mode = newmode;
		}
		return true;
	}
	var push = function(newRule) {
		rule = newRule;
		stack.push(rule);
		return true;
	}
	var parseerror = function(msg) {
		console.log("Parse error at token " + i + ": " + token + ".\n" + msg);
		return true;
	}
	var pop = function() {
		var oldrule = stack.pop();
		if(stack.length == 0) {
			return false;
		}
		rule = stack[stack.length - 1];
		rule.append(oldrule);
		return true;
	}
	var discard = function() {
		stack.pop();
		rule = stack[stack.length - 1];
		return true;
	}
	var finish = function() {
		while(stack.length > 1) {
			pop();
		}
	}

	for(;;) {
		consume();

		switch(mode) {
		case "top-level":
			switch(token.tokenType) {
			case "CDO":
			case "CDC":
			case "WHITESPACE": break;
			case "AT-KEYWORD": push(new AtRule(token.value)) && switchto('at-rule'); break;
			case "{": parseerror("Attempt to open a curly-block at top-level.") && consumeAPrimitive(); break;
			case "EOF": finish(); return stylesheet;
			default: push(new StyleRule) && switchto('selector') && reprocess();
			}
			break;

		case "at-rule":
			switch(token.tokenType) {
			case ";": pop() && switchto(); break;
			case "{":
				if(rule.fillType !== '') switchto(rule.fillType);
				else parseerror("Attempt to open a curly-block in a statement-type at-rule.") && discard() && switchto('next-block') && reprocess();
				break;
			case "EOF": finish(); return stylesheet;
			default: rule.appendPrelude(consumeAPrimitive());
			}
			break;

		case "rule":
			switch(token.tokenType) {
			case "WHITESPACE": break;
			case "}": pop() && switchto(); break;
			case "AT-KEYWORD": push(new AtRule(token.value)) && switchto('at-rule'); break;
			case "EOF": finish(); return stylesheet;
			default: push(new StyleRule) && switchto('selector') && reprocess();
			}
			break;

		case "selector":
			switch(token.tokenType) {
			case "{": switchto('declaration'); break;
			case "EOF": discard() && finish(); return stylesheet;
			default: rule.appendSelector(consumeAPrimitive()); 
			}
			break;

		case "declaration":
			switch(token.tokenType) {
			case "WHITESPACE":
			case ";": break;
			case "}": pop() && switchto(); break;
			case "AT-RULE": push(new AtRule(token.value)) && switchto('at-rule'); break;
			case "IDENT": push(new Declaration(token.value)) && switchto('after-declaration-name'); break;
			case "DELIM": break; // KF Quick fix for browser hacks.
			case "EOF": finish(); return stylesheet;
			default: parseerror() && discard() && switchto('next-declaration');
			}
			break;

		case "after-declaration-name":
			switch(token.tokenType) {
			case "WHITESPACE": break;
			case ":": switchto('declaration-value'); break;
			case ";": parseerror("Incomplete declaration - semicolon after property name.") && discard() && switchto(); break;
			case "EOF": discard() && finish(); return stylesheet;
			default: parseerror("Invalid declaration - additional token after property name") && discard() && switchto('next-declaration');
			}
			break;

		case "declaration-value":
			switch(token.tokenType) {
			case "DELIM":
				if(token.value == "!" && next().tokenType == 'IDENTIFIER' && next().value.toLowerCase() == "important") {
					consume();
					rule.important = true;
					switchto('declaration-end');
				} else {
					rule.append(token);
				}
				break;
			case ";": pop() && switchto(); break;
			case "}": pop() && pop() && switchto(); break;
			case "EOF": finish(); return stylesheet;
			default: rule.append(consumeAPrimitive());
			}
			break;

		case "declaration-end":
			switch(token.tokenType) {
			case "WHITESPACE": break;
			case ";": pop() && switchto(); break;
			case "}": pop() && pop() && switchto(); break;
			case "EOF": finish(); return stylesheet;
			default: parseerror("Invalid declaration - additional token after !important.") && discard() && switchto('next-declaration');
			}
			break;

		case "next-block":
			switch(token.tokenType) {
			case "{": consumeAPrimitive() && switchto(); break;
			case "EOF": finish(); return stylesheet;
			default: consumeAPrimitive(); break;
			}
			break;

		case "next-declaration":
			switch(token.tokenType) {
			case ";": switchto('declaration'); break;
			case "}": switchto('declaration') && reprocess(); break;
			case "EOF": finish(); return stylesheet;
			default: consumeAPrimitive(); break;
			}
			break;

		default:
			// If you hit this, it's because one of the switchto() calls is typo'd.
			console.log('Unknown parsing mode: ' + mode);
			return;
		}
	}

	function consumeAPrimitive() {
		switch(token.tokenType) {
		case "(":
		case "[":
		case "{": return consumeASimpleBlock();
		case "FUNCTION": return consumeAFunc();
		default: return token;
		}
	}

	function consumeASimpleBlock() {
		var endingTokenType = {"(":")", "[":"]", "{":"}"}[token.tokenType];
		var block = new SimpleBlock(token.tokenType);

		for(;;) {
			consume();
			switch(token.tokenType) {
			case "EOF":
			case endingTokenType: return block;
			default: block.append(consumeAPrimitive());
			}
		}
	}

	function consumeAFunc() {
		var func = new Func(token.value);
		var arg = new FuncArg();

		for(;;) {
			consume();
			switch(token.tokenType) {
			case "EOF":
			case ")": func.append(arg); return func;
			case "DELIM":
				if(token.value == ",") {
					func.append(arg);
					arg = new FuncArg();
				} else {
					arg.append(token);
				}
				break;
			default: arg.append(consumeAPrimitive());
			}
		}
	}
}

function CSSParserRule() { return this; }
CSSParserRule.prototype.fillType = '';
CSSParserRule.prototype.toString = function(indent) {
	return JSON.stringify(this.toJSON(),null,indent);
}
CSSParserRule.prototype.append = function(val) {
	this.value.push(val);
	return this;
}

function Stylesheet() {
	this.value = [];
	return this;
}
Stylesheet.prototype = new CSSParserRule;
Stylesheet.prototype.type = "STYLESHEET";
Stylesheet.prototype.toJSON = function() {
	return {type:'stylesheet', value: this.value.map(function(e){return e.toJSON();})};
}

function AtRule(name) {
	this.name = name;
	this.prelude = [];
	this.value = [];
	if(name in AtRule.registry)
		this.fillType = AtRule.registry[name];
	return this;
}
AtRule.prototype = new CSSParserRule;
AtRule.prototype.type = "AT-RULE";
AtRule.prototype.appendPrelude = function(val) {
	this.prelude.push(val);
	return this;
}
AtRule.prototype.toJSON = function() {
	return {type:'at', name:this.name, prelude:this.prelude.map(function(e){return e.toJSON();}), value:this.value.map(function(e){return e.toJSON();})};
}
AtRule.registry = {
	'import': '',
	'media': 'rule',
	'font-face': 'declaration',
	'page': 'declaration',
	'keyframes': 'rule',
	'namespace': '',
	'counter-style': 'declaration',
	'supports': 'rule',
	'document': 'rule',
	'font-feature-values': 'declaration',
	'viewport': '',
	'region-style': 'rule'
};

function StyleRule() {
	this.selector = [];
	this.value = [];
	return this;
}
StyleRule.prototype = new CSSParserRule;
StyleRule.prototype.type = "STYLE-RULE";
StyleRule.prototype.fillType = 'declaration';
StyleRule.prototype.appendSelector = function(val) {
	this.selector.push(val);
	return this;
}
StyleRule.prototype.toJSON = function() {
	return {type:'selector', selector:this.selector.map(function(e){return e.toJSON();}), value:this.value.map(function(e){return e.toJSON();})};
}

function Declaration(name) {
	this.name = name;
	this.value = [];
	return this;
}
Declaration.prototype = new CSSParserRule;
Declaration.prototype.type = "DECLARATION";
Declaration.prototype.toJSON = function() {
	return {type:'declaration', name:this.name, value:this.value.map(function(e){return e.toJSON();})};
}

function Hack(name) {
	this.name = name;
	this.value = [];

	return this;
}
Hack.prototype = new CSSParserRule;
Hack.prototype.type = "HACK";
Hack.prototype.toJSON = function() {
	return {type:'hack', name:this.name, value:this.value.map(function(e){return e.toJSON();})};
}

function SimpleBlock(type) {
	this.name = type;
	this.value = [];
	return this;
}
SimpleBlock.prototype = new CSSParserRule;
SimpleBlock.prototype.type = "BLOCK";
SimpleBlock.prototype.toJSON = function() {
	return {type:'block', name:this.name, value:this.value.map(function(e){return e.toJSON();})};
}

function Func(name) {
	this.name = name;
	this.value = [];
	return this;
}
Func.prototype = new CSSParserRule;
Func.prototype.type = "FUNCTION";
Func.prototype.toJSON = function() {
	return {type:'func', name:this.name, value:this.value.map(function(e){return e.toJSON();})};
}

function FuncArg() {
	this.value = [];
	return this;
}
FuncArg.prototype = new CSSParserRule;
FuncArg.prototype.type = "FUNCTION-ARG";
FuncArg.prototype.toJSON = function() {
	return this.value.map(function(e){return e.toJSON();});
}

// Exportation.
// TODO: also export the various rule objects?
exports.parse = parse;

}));

(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,d=e.filter,g=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,_=Object.keys,j=i.bind,w=function(n){return n instanceof w?n:this instanceof w?(this._wrapped=n,void 0):new w(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=w),exports._=w):n._=w,w.VERSION="1.4.4";var A=w.each=w.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a in n)if(w.has(n,a)&&t.call(e,n[a],a,n)===r)return};w.map=w.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e[e.length]=t.call(r,n,u,i)}),e)};var O="Reduce of empty array with no initial value";w.reduce=w.foldl=w.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=w.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(O);return r},w.reduceRight=w.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=w.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=w.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(O);return r},w.find=w.detect=function(n,t,r){var e;return E(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},w.filter=w.select=function(n,t,r){var e=[];return null==n?e:d&&n.filter===d?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&(e[e.length]=n)}),e)},w.reject=function(n,t,r){return w.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},w.every=w.all=function(n,t,e){t||(t=w.identity);var u=!0;return null==n?u:g&&n.every===g?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var E=w.some=w.any=function(n,t,e){t||(t=w.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};w.contains=w.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:E(n,function(n){return n===t})},w.invoke=function(n,t){var r=o.call(arguments,2),e=w.isFunction(t);return w.map(n,function(n){return(e?t:n[t]).apply(n,r)})},w.pluck=function(n,t){return w.map(n,function(n){return n[t]})},w.where=function(n,t,r){return w.isEmpty(t)?r?null:[]:w[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},w.findWhere=function(n,t){return w.where(n,t,!0)},w.max=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.max.apply(Math,n);if(!t&&w.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>=e.computed&&(e={value:n,computed:a})}),e.value},w.min=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.min.apply(Math,n);if(!t&&w.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;e.computed>a&&(e={value:n,computed:a})}),e.value},w.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=w.random(r++),e[r-1]=e[t],e[t]=n}),e};var k=function(n){return w.isFunction(n)?n:function(t){return t[n]}};w.sortBy=function(n,t,r){var e=k(t);return w.pluck(w.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index<t.index?-1:1}),"value")};var F=function(n,t,r,e){var u={},i=k(t||w.identity);return A(n,function(t,a){var o=i.call(r,t,a,n);e(u,o,t)}),u};w.groupBy=function(n,t,r){return F(n,t,r,function(n,t,r){(w.has(n,t)?n[t]:n[t]=[]).push(r)})},w.countBy=function(n,t,r){return F(n,t,r,function(n,t){w.has(n,t)||(n[t]=0),n[t]++})},w.sortedIndex=function(n,t,r,e){r=null==r?w.identity:k(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;u>r.call(e,n[o])?i=o+1:a=o}return i},w.toArray=function(n){return n?w.isArray(n)?o.call(n):n.length===+n.length?w.map(n,w.identity):w.values(n):[]},w.size=function(n){return null==n?0:n.length===+n.length?n.length:w.keys(n).length},w.first=w.head=w.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},w.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},w.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},w.rest=w.tail=w.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},w.compact=function(n){return w.filter(n,w.identity)};var R=function(n,t,r){return A(n,function(n){w.isArray(n)?t?a.apply(r,n):R(n,t,r):r.push(n)}),r};w.flatten=function(n,t){return R(n,t,[])},w.without=function(n){return w.difference(n,o.call(arguments,1))},w.uniq=w.unique=function(n,t,r,e){w.isFunction(t)&&(e=r,r=t,t=!1);var u=r?w.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:w.contains(a,r))||(a.push(r),i.push(n[e]))}),i},w.union=function(){return w.uniq(c.apply(e,arguments))},w.intersection=function(n){var t=o.call(arguments,1);return w.filter(w.uniq(n),function(n){return w.every(t,function(t){return w.indexOf(t,n)>=0})})},w.difference=function(n){var t=c.apply(e,o.call(arguments,1));return w.filter(n,function(n){return!w.contains(t,n)})},w.zip=function(){for(var n=o.call(arguments),t=w.max(w.pluck(n,"length")),r=Array(t),e=0;t>e;e++)r[e]=w.pluck(n,""+e);return r},w.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},w.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=w.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},w.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},w.range=function(n,t,r){1>=arguments.length&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=Array(e);e>u;)i[u++]=n,n+=r;return i},w.bind=function(n,t){if(n.bind===j&&j)return j.apply(n,o.call(arguments,1));var r=o.call(arguments,2);return function(){return n.apply(t,r.concat(o.call(arguments)))}},w.partial=function(n){var t=o.call(arguments,1);return function(){return n.apply(this,t.concat(o.call(arguments)))}},w.bindAll=function(n){var t=o.call(arguments,1);return 0===t.length&&(t=w.functions(n)),A(t,function(t){n[t]=w.bind(n[t],n)}),n},w.memoize=function(n,t){var r={};return t||(t=w.identity),function(){var e=t.apply(this,arguments);return w.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},w.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},w.defer=function(n){return w.delay.apply(w,[n,1].concat(o.call(arguments,1)))},w.throttle=function(n,t){var r,e,u,i,a=0,o=function(){a=new Date,u=null,i=n.apply(r,e)};return function(){var c=new Date,l=t-(c-a);return r=this,e=arguments,0>=l?(clearTimeout(u),u=null,a=c,i=n.apply(r,e)):u||(u=setTimeout(o,l)),i}},w.debounce=function(n,t,r){var e,u;return function(){var i=this,a=arguments,o=function(){e=null,r||(u=n.apply(i,a))},c=r&&!e;return clearTimeout(e),e=setTimeout(o,t),c&&(u=n.apply(i,a)),u}},w.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},w.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},w.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},w.after=function(n,t){return 0>=n?t():function(){return 1>--n?t.apply(this,arguments):void 0}},w.keys=_||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)w.has(n,r)&&(t[t.length]=r);return t},w.values=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push(n[r]);return t},w.pairs=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push([r,n[r]]);return t},w.invert=function(n){var t={};for(var r in n)w.has(n,r)&&(t[n[r]]=r);return t},w.functions=w.methods=function(n){var t=[];for(var r in n)w.isFunction(n[r])&&t.push(r);return t.sort()},w.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},w.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},w.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)w.contains(r,u)||(t[u]=n[u]);return t},w.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)null==n[r]&&(n[r]=t[r])}),n},w.clone=function(n){return w.isObject(n)?w.isArray(n)?n.slice():w.extend({},n):n},w.tap=function(n,t){return t(n),n};var I=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof w&&(n=n._wrapped),t instanceof w&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==t+"";case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;r.push(n),e.push(t);var a=0,o=!0;if("[object Array]"==u){if(a=n.length,o=a==t.length)for(;a--&&(o=I(n[a],t[a],r,e)););}else{var c=n.constructor,f=t.constructor;if(c!==f&&!(w.isFunction(c)&&c instanceof c&&w.isFunction(f)&&f instanceof f))return!1;for(var s in n)if(w.has(n,s)&&(a++,!(o=w.has(t,s)&&I(n[s],t[s],r,e))))break;if(o){for(s in t)if(w.has(t,s)&&!a--)break;o=!a}}return r.pop(),e.pop(),o};w.isEqual=function(n,t){return I(n,t,[],[])},w.isEmpty=function(n){if(null==n)return!0;if(w.isArray(n)||w.isString(n))return 0===n.length;for(var t in n)if(w.has(n,t))return!1;return!0},w.isElement=function(n){return!(!n||1!==n.nodeType)},w.isArray=x||function(n){return"[object Array]"==l.call(n)},w.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){w["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),w.isArguments(arguments)||(w.isArguments=function(n){return!(!n||!w.has(n,"callee"))}),"function"!=typeof/./&&(w.isFunction=function(n){return"function"==typeof n}),w.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},w.isNaN=function(n){return w.isNumber(n)&&n!=+n},w.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},w.isNull=function(n){return null===n},w.isUndefined=function(n){return n===void 0},w.has=function(n,t){return f.call(n,t)},w.noConflict=function(){return n._=t,this},w.identity=function(n){return n},w.times=function(n,t,r){for(var e=Array(n),u=0;n>u;u++)e[u]=t.call(r,u);return e},w.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var M={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};M.unescape=w.invert(M.escape);var S={escape:RegExp("["+w.keys(M.escape).join("")+"]","g"),unescape:RegExp("("+w.keys(M.unescape).join("|")+")","g")};w.each(["escape","unescape"],function(n){w[n]=function(t){return null==t?"":(""+t).replace(S[n],function(t){return M[n][t]})}}),w.result=function(n,t){if(null==n)return null;var r=n[t];return w.isFunction(r)?r.call(n):r},w.mixin=function(n){A(w.functions(n),function(t){var r=w[t]=n[t];w.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),D.call(this,r.apply(w,n))}})};var N=0;w.uniqueId=function(n){var t=++N+"";return n?n+t:t},w.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var T=/(.)^/,q={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},B=/\\|'|\r|\n|\t|\u2028|\u2029/g;w.template=function(n,t,r){var e;r=w.defaults({},r,w.templateSettings);var u=RegExp([(r.escape||T).source,(r.interpolate||T).source,(r.evaluate||T).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(B,function(n){return"\\"+q[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,w);var c=function(n){return e.call(this,n,w)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},w.chain=function(n){return w(n).chain()};var D=function(n){return this._chain?w(n).chain():n};w.mixin(w),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];w.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],D.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];w.prototype[n]=function(){return D.call(this,t.apply(this._wrapped,arguments))}}),w.extend(w.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);
define("underscore", (function (global) {
    return function () {
        var ret, fn;
        return ret || global._;
    };
}(this)));

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
            };

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
define(
    'Report',
    ['underscore'],

    function (_) {

        function Report(catalogData, metrics) {
            this.catalog = catalogData;
            this.results = {};
            this.metrics = metrics;
        }

        Report.prototype.run = function() {
            this.catalog.forEach(function(stylesheet) {
                this.runMetricsOnStylesheet(stylesheet, this.metrics.stylesheet);

                _.each(stylesheet, function(rulePart){
                    if(rulePart.type == 'selector') {
                        this.runMetricsOnCatalogItem(rulePart, this.metrics.selector);
                    }
                    else if(rulePart.type == 'declaration') {
                        this.runMetricsOnCatalogItem(rulePart, this.metrics.declaration);
                    }
                }, this);
            }, this);

            return this.results;
        };

        Report.prototype.runMetricsOnStylesheet = function(catalogItem, metrics) {
            _.each(metrics, function(metric){
                _.extend(this.results, metric.measure(catalogItem));
            }, this);
        };

        Report.prototype.runMetricsOnCatalogItem = function(catalogItem, metrics) {
            _.each(metrics, function(metric){
                _.extend(this.results, metric.measure(catalogItem));
            }, this);
        };

        return Report;
    }
);
define(
    'ReportWriterConsole',
    [],

    function () {
        function ReportWriterConsole() {

        }

        ReportWriterConsole.prototype.writeReport = function(results) {
            console.log(results);
        };

        return ReportWriterConsole;
    }
);
define(
    'CssTool',
    ['DataAdaptor', 'Report', 'ReportWriterConsole'],

    function(DataAdaptor, Report, ReportWriterConsole) {
        function CssTool(metrics, options) {
            var defaults = {
                'dataAdaptor': new DataAdaptor(),
                'reportWriter': new ReportWriterConsole(),
                'runFromSource': 0
            };

            if(_.isUndefined(options)) {
                options = {};
            }

            this.metrics = metrics;
            this.settings = defaults;
            _.extend(this.settings, options);
        }

        CssTool.prototype.runReport = function (stylesheets) {
            var catalogData = [];

            if (Object.prototype.toString.call(stylesheets) === '[object Array]') {
                stylesheets.forEach(function(stylesheet) {
                    catalogData.push(this.settings.dataAdaptor.process(stylesheet));
                }, this);
                
                var report = new Report(catalogData, this.metrics);
                this.settings.reportWriter.writeReport(report.run());
            }
        };

        return CssTool;
    }
);
define(
    'metrics/IdentifiersPerSelector',
    [],

    function() {
        function IdentifiersPerSelector() {
            this.totalIdentifiers = 0;
            this.totalSelectors = 0;
        }

        IdentifiersPerSelector.prototype.measure = function(selectorData) {
            this.totalSelectors += selectorData.selectors.length;

            _.each(selectorData.selectors, function(selector){
                this.totalIdentifiers += selector.length;
            }, this);

            return {
                'identifiers-per-selector': this.totalIdentifiers / this.totalSelectors
            };
        };

        return IdentifiersPerSelector;
    }
);
define(
    'metrics/TotalSelectors',
    [],

    function() {
        function TotalSelectors () {
            this.totalSelectors = 0;
        }

        TotalSelectors.prototype.measure = function(selectorData) {
            this.totalSelectors += selectorData.selectors.length;

            return {
                'total-selectors': this.totalSelectors
            };
        };

        return TotalSelectors;
    }
);
define(
    'metrics/TotalIdentifiers',
    [],

    function () {

        function TotalIdentifiers () {
            this.totalIdentifiers = 0;
        }

        TotalIdentifiers.prototype.measure = function(selectorData) {
            _.each(selectorData, function(selector){
                this.totalIdentifiers += selector.length;
            }, this);

            return {
                'total-identifiers': this.totalIdentifiers
            };
        };

        return TotalIdentifiers;
    }
);
define(
    'metrics/SelectorsPerRule',
    [],

    function () {
        function SelectorsPerRule() {
            this.totalSelectors = 0;
            this.totalRules = 0;
        }

        SelectorsPerRule.prototype.measure = function(selectorData) {
            this.totalRules++;
            this.totalSelectors += selectorData.selectors.length;

            return {
                'selectors-per-rule': this.totalSelectors / this.totalRules
            };
        };

        return SelectorsPerRule;
    }
);
define(
    'metrics/SpecificityPerSelector',
    [],

    function() {

        function SpecificityPerSelector() {
            this.totalSpecificity = 0;
            this.totalSelectors = 0;
        }

        SpecificityPerSelector.prototype.measure = function(selectorData) {
            this.totalSelectors += selectorData.selectors.length;

            _.each(selectorData, function(selector){
                _.each(selector, function(identifier){
                    var idIdentifiers = this.countIdIdentifiers(identifier),
                    classIdentifiers = this.countClassIdentifiers(identifier),
                    attributeIdentifiers = this.countAttributeIdentifiers(identifier),
                    pseudoClassIdentifiers = this.countPseudoClassIdentifiers(identifier),
                    typeIdentifiers = this.countTypeIdentifiers(identifier),
                    pseudoElementIdentifiers = this.countPseudoElementIdentifiers(identifier);

                    this.totalSpecificity += Number(
                        String(idIdentifiers) + 
                        String(classIdentifiers + attributeIdentifiers + pseudoClassIdentifiers) + 
                        String(typeIdentifiers + pseudoElementIdentifiers));
                }, this);
            }, this);

            return {
                'specificity-per-selector': this.totalSpecificity / this.totalSelectors
            };
        };

       SpecificityPerSelector.prototype.countIdIdentifiers = function(identifier) {
            var regex = /#/,
                matches = regex.exec(identifier);

            if (matches) {
                return matches.length;
            }

            return 0;
        };

        SpecificityPerSelector.prototype.countClassIdentifiers = function(identifier) {
            var regex = /\./,
                matches = regex.exec(identifier);

            if (matches) {
                return matches.length;
            }

            return 0;
        };

        SpecificityPerSelector.prototype.countAttributeIdentifiers = function(identifier) {
            var regex = /\[/,
                matches = regex.exec(identifier);

            if (matches) {
                return matches.length;
            }

            return 0;
        };

        SpecificityPerSelector.prototype.countPseudoClassIdentifiers = function(identifier) {
            var regex = /:[^:]/,
                matches = regex.exec(identifier);

            if (matches) {
                return matches.length;
            }

            return 0;
        };

        SpecificityPerSelector.prototype.countTypeIdentifiers = function(identifier) {
            var regex = /^[a-zA-Z_]/;

            if (regex.exec(identifier)) {
                return 1;
            }

            return 0;
        };

        SpecificityPerSelector.prototype.countPseudoElementIdentifiers = function(identifier) {
            var regex = /::/,
                matches = regex.exec(identifier);

            if (matches) {
                return matches.length;
            }

            return 0;
        };
        
        return SpecificityPerSelector;
    }
);
define(
    'metrics/TopSelectorSpecificity',
    [],

    function () {
        function TopSelectorSpecificity() {
            this.topSelectorSpecificity = 0;
        }

        TopSelectorSpecificity.prototype.measure = function(selectorData) {
            _.each(selectorData.selectors, function(selector){
                var specificity = 0;
                _.each(selector, function(identifier){
                    var idIdentifiers = this.countIdIdentifiers(identifier),
                        classIdentifiers = this.countClassIdentifiers(identifier),
                        attributeIdentifiers = this.countAttributeIdentifiers(identifier),
                        pseudoClassIdentifiers = this.countPseudoClassIdentifiers(identifier),
                        typeIdentifiers = this.countTypeIdentifiers(identifier),
                        pseudoElementIdentifiers = this.countPseudoElementIdentifiers(identifier);

                    specificity += Number(
                        String(idIdentifiers) + 
                        String(classIdentifiers + attributeIdentifiers + pseudoClassIdentifiers) + 
                        String(typeIdentifiers + pseudoElementIdentifiers));

                }, this);

                if(specificity > this.topSelectorSpecificity) {
                    this.topSelectorSpecificity = specificity;
                }
            }, this);

            return {
                'top-selector-specificity': this.topSelectorSpecificity
            };
        };        

        TopSelectorSpecificity.prototype.countIdIdentifiers = function(identifier) {
            var regex = /#/,
                matches = regex.exec(identifier);

            if (matches) {
                return matches.length;
            }

            return 0;
        };

        TopSelectorSpecificity.prototype.countClassIdentifiers = function(identifier) {
            var regex = /\./,
                matches = regex.exec(identifier);

            if (matches) {
                return matches.length;
            }

            return 0;
        };

        TopSelectorSpecificity.prototype.countAttributeIdentifiers = function(identifier) {
            var regex = /\[/,
                matches = regex.exec(identifier);

            if (matches) {
                return matches.length;
            }

            return 0;
        };

        TopSelectorSpecificity.prototype.countPseudoClassIdentifiers = function(identifier) {
            var regex = /:[^:]/,
                matches = regex.exec(identifier);

            if (matches) {
                return matches.length;
            }

            return 0;
        };

        TopSelectorSpecificity.prototype.countTypeIdentifiers = function(identifier) {
            var regex = /^[a-zA-Z_]/;

            if (regex.exec(identifier)) {
                return 1;
            }

            return 0;
        };

        TopSelectorSpecificity.prototype.countPseudoElementIdentifiers = function(identifier) {
            var regex = /::/,
                matches = regex.exec(identifier);

            if (matches) {
                return matches.length;
            }

            return 0;
        };

        return TopSelectorSpecificity;
    }
);
define(
    'metrics/TopSelectorSpecificitySelector',
    [],

    function () {
        function TopSelectorSpecificitySelector() {
            this.topSelectorSpecificity = 0;
            this.topSelectorSpecificitySelector = "";
        }

        TopSelectorSpecificitySelector.prototype.measure = function(selectorData) {
            _.each(selectorData.selectors, function(selector){
                var specificity = 0,
                    selectorString = "";

                _.each(selector, function(identifier){
                    selectorString += identifier;
                    var idIdentifiers = this.countIdIdentifiers(identifier),
                        classIdentifiers = this.countClassIdentifiers(identifier),
                        attributeIdentifiers = this.countAttributeIdentifiers(identifier),
                        pseudoClassIdentifiers = this.countPseudoClassIdentifiers(identifier),
                        typeIdentifiers = this.countTypeIdentifiers(identifier),
                        pseudoElementIdentifiers = this.countPseudoElementIdentifiers(identifier);
                        
                    specificity += Number(
                        String(idIdentifiers) + 
                        String(classIdentifiers + attributeIdentifiers + pseudoClassIdentifiers) + 
                        String(typeIdentifiers + pseudoElementIdentifiers));
                }, this);
                
                if(specificity > this.topSelectorSpecificity) {
                    this.topSelectorSpecificity = specificity;
                    this.topSelectorSpecificitySelector = selectorString;
                }
            }, this);


            return {
                'top-selector-specificity-selector': this.topSelectorSpecificitySelector
            };
        };        

       TopSelectorSpecificitySelector.prototype.countIdIdentifiers = function(identifier) {
            var regex = /#/,
                matches = regex.exec(identifier);

            if (matches) {
                return matches.length;
            }

            return 0;
        };

        TopSelectorSpecificitySelector.prototype.countClassIdentifiers = function(identifier) {
            var regex = /\./,
                matches = regex.exec(identifier);

            if (matches) {
                return matches.length;
            }

            return 0;
        };

        TopSelectorSpecificitySelector.prototype.countAttributeIdentifiers = function(identifier) {
            var regex = /\[/,
                matches = regex.exec(identifier);

            if (matches) {
                return matches.length;
            }

            return 0;
        };

        TopSelectorSpecificitySelector.prototype.countPseudoClassIdentifiers = function(identifier) {
            var regex = /:[^:]/,
                matches = regex.exec(identifier);

            if (matches) {
                return matches.length;
            }

            return 0;
        };

        TopSelectorSpecificitySelector.prototype.countTypeIdentifiers = function(identifier) {
            var regex = /^[a-zA-Z_]/;

            if (regex.exec(identifier)) {
                return 1;
            }

            return 0;
        };

        TopSelectorSpecificitySelector.prototype.countPseudoElementIdentifiers = function(identifier) {
            var regex = /::/,
                matches = regex.exec(identifier);

            if (matches) {
                return matches.length;
            }

            return 0;
        };

        return TopSelectorSpecificitySelector;
    }
);
define(
    'metrics/Selector',
    [
        'metrics/IdentifiersPerSelector', 'metrics/TotalSelectors',
        'metrics/TotalIdentifiers', 'metrics/SelectorsPerRule',
        'metrics/SpecificityPerSelector', 'metrics/TopSelectorSpecificity',
        'metrics/TopSelectorSpecificitySelector'

    ],
    function(
        IdentifiersPerSelector, TotalSelectors, TotalIdentifiers, SelectorsPerRule,
        SpecificityPerSelector, TopSelectorSpecificity, TopSelectorSpecificitySelector
    ) {
        return [
            new IdentifiersPerSelector(),
            new TotalSelectors(),
            new TotalIdentifiers(),
            new SelectorsPerRule(),
            new SpecificityPerSelector(),
            new TopSelectorSpecificity(),
            new TopSelectorSpecificitySelector()
        ];
    }
);
define(
    'metrics/TotalUniqueColours',
    [],

    function() {
        function TotalUniqueColours() {
            this.uniqueColours = [];
        }

        TotalUniqueColours.prototype.measure = function(selectorData) {
            _.each(selectorData.values, function(value){
                if(value.typeGroup == 'color') {
                    var hash = getLongHashForm(value.value.toLowerCase());

                    if(this.uniqueColours.indexOf(hash) === -1) {
                        this.uniqueColours.push(hash);
                    }
                }                
            }, this);

            return {
                'total-unique-colours': this.uniqueColours.length
            };
        };

        function getLongHashForm(string) {
            if(string.length == 3) {
                var r = string.substring(0, 1),
                    g = string.substring(1, 2),
                    b = string.substring(2);

                return r + r + g + g + b + b;
            }

            return string;
        }

        return TotalUniqueColours;
    }
);
define(
    'metrics/UniqueColours',
    [],

    function() {
        function UniqueColours() {
            this.uniqueColours = [];
        }

        UniqueColours.prototype.measure = function(selectorData) {
            selectorData.values.forEach(function(value) {
                if(value.typeGroup == 'color') {
                    var hash = getLongHashForm(value.value.toLowerCase());
                    if(this.uniqueColours.indexOf(hash) === -1) {
                        this.uniqueColours.push(hash);
                    }
                }
            }, this);
            return {
                'unique-colours': this.uniqueColours.sort().join(', ')
            };
        };

        function getLongHashForm(string) {
            if(string.length == 3) {
                var r = string.substring(0, 1),
                    g = string.substring(1, 2),
                    b = string.substring(2);

                return r + r + g + g + b + b;
            }

            return string;
        }

        return UniqueColours;
    }
);
define(
    'metrics/Declaration',
    [
        'metrics/TotalUniqueColours', 'metrics/UniqueColours'
    ],
    function(
        TotalUniqueColours, UniqueColours
    ) {
        return [
            new TotalUniqueColours(),
            new UniqueColours()
        ];
    }
);
define(
    'metrics/TotalStylesheets',
    [],

    function() {
        function TotalStylesheets () {
            this.totalStylesheets = 0;
        }

        TotalStylesheets.prototype.measure = function(stylesheetData) {
            this.totalStylesheets++;

            return {
                'total-stylesheets': this.totalStylesheets
            };
        };

        return TotalStylesheets;
    }
);
define(
    'metrics/Stylesheet',
    [
        'metrics/TotalStylesheets',
    ],
    function(
        TotalStylesheets
    ) {
        return [new TotalStylesheets()];
    }
);
define(
    'metrics/All',
    ['metrics/Selector', 'metrics/Declaration', 'metrics/Stylesheet'],

    function(selectorMetrics, declarationMetrics, stylesheetMetrics) {
        return {
            selector: selectorMetrics,
            declaration: declarationMetrics,
            stylesheet: stylesheetMetrics
        };
    }
);
require.config({
    baseUrl: 'scripts/libs',
    shim: {
        underscore: {
            exports: '_'
        }
    },
    paths: {
        CssTool: '../CssTool',
        jquery: "../libs/jquery/jquery-1.9.1.min",
        tokenizer: "../libs/CssParser/tokenizer",
        parser: "../libs/CssParser/parser",
        underscore: '../libs/underscore-min'
    }
});

requirejs(['CssTool','metrics/All', 'ReportWriterConsole'],
    function (CssTool, metrics, ReportWriterConsole) {
        var stylesheets = jQuery("link[rel='stylesheet']"),
            stylesheetData = [];

        if (typeof stylesheetArray != 'undefined') {
            var cssTool = new CssTool(metrics);
            cssTool.runReport(stylesheetArray);
        } else {

            stylesheets.each(function () {
                jQuery.get(jQuery(this).attr('href'), function (data) {
                    stylesheetData.push(data);
                });
            });

            setTimeout(function () {
                var cssTool = new CssTool(metrics, {'reportWriter': new ReportWriterConsole()});
                cssTool.runReport(stylesheetData);
            }, 5000);
        }
    }
);

/*
javascript: (function () {   
    var jsCode = document.createElement('script'),
        requirePath = 'http://localhost/~kas/CssTool/source/libs/require.js/require.js',
        scriptPath = 'http://localhost/~kas/CssTool/build/app.js';
    jsCode.setAttribute('src', requirePath);
    jsCode.setAttribute('data-main', scriptPath);
  document.body.appendChild(jsCode);   
 }());
 */;
define("app", function(){});
