define(
    'NodeAdaptorSelector',
    ['underscore', 'backbone'],
    function (_, Backbone) {

        var NodeAdaptorSelector = Backbone.Model.extend({
            process: function(tokens) {
                return processTokens(tokens);
            }
        });

        var processTokens = function(tokens) {
            var node = {
                    'selectors': getSelectors(tokens),
                    'type': 'selector'
                };

            return node;
        }

        var getSelectors = function(tokens) {
            var selectors = [],
                selector = [],
                identifier = "";

            _.each(tokens, function(token, tokenIndex) {
                if (token.tokenType == 'DELIM' && token.value == '.') {
                    identifier += ".";
                } else if (token.tokenType == ':') {
                    identifier += ":";
                } else if (token.tokenType == 'HASH') {
                    identifier += "#" + token.value;
                } else if (token.tokenType == 'IDENT') {
                    identifier += token.value;
                } else if (token.tokenType == 'WHITESPACE') {
                    selector.push(identifier);
                    selector.push(' ');

                    identifier = [];
                }

                if(tokens.length > tokenIndex + 1 && tokenIsDelimiter(tokens[tokenIndex + 1])) {
                    selector.push(identifier);
                    selectors.push(selector);

                    selector = [];
                    identifier = [];
                }
            });

            selector.push(identifier);
            selectors.push(selector);

            return selectors;
        }

        var tokenIsDelimiter = function(token) {
            return token.tokenType == 'DELIM' &&
                token.value == ',';
        }

        return NodeAdaptorSelector;
    }
);