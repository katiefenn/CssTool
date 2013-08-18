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

            process: function(cssString) {
                var cssParsertokens = tokenizer.tokenize(cssString),
                    cssParserData = parser.parse(cssParsertokens);

                _.each(cssParserData.value, function(rule){
                    var data = processRule(rule);
                    this.set('data', this.get('data').concat(data));
                }, this);

                return this.get('data');
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