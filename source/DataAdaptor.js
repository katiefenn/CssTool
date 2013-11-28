define(
    'DataAdaptor',
    ['NodeAdaptorSelector', 'NodeAdaptorDeclaration','tokenizer', 'parser', 'underscore', 'backbone'],

    function (NodeAdaptorSelector, NodeAdaptorDeclaration, tokenizer, parser, _, backbone) {

        function DataAdaptor() {
            this.catalogItems = [];
        }

        var DataAdaptor = Backbone.Model.extend({
            defaults: {
                data: []
            },

            initialize: function() {
                this.set({
                    'data': new Array()
                });
            },

            process: function(cssString) {
                var cssParsertokens = tokenizer.tokenize(cssString),
                    cssParserData = parser.parse(cssParsertokens),
                    data = new Array();

                _.each(cssParserData.value, function(rule){
                    var results = processRule(rule);
                    data.push(results);
                }, this);

                return data;
            }
        });

        var processRule = function(cssParserData) {
            var  data = [];
            if (_.isArray(cssParserData.value)) {
                _.each(cssParserData.value, function(property){
                    data.push(processDeclaration(property));
                }, this);
            }

            if (_.has(cssParserData, 'selector')) {
                data.push(processSelector(cssParserData.selector));
            }

            return data;
        };

        var processDeclaration = function(data) {
            var declarationAdaptor = new NodeAdaptorDeclaration();
            return declarationAdaptor.process(data);
        };

        var processSelector = function(data) {
            var selectorAdaptor = new NodeAdaptorSelector();
            return selectorAdaptor.process(data);
        };

        return DataAdaptor;
    }
);