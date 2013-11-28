define(
    'NodeAdaptorDeclaration',
    ['underscore', 'backbone'],

    function(_, Backbone) {

        var NodeAdaptorDeclaration = Backbone.Model.extend({

            process: function(data) {
                var node = {
                    type: 'declaration',
                    property: '',
                    values: []
                };

                _.each(data, function(value) {
                    processValue(value, node);
                }, this);

                return node;
            }
        });

        var processValue = function(value, node) {
            if(value.tokenType == 'HASH') {
                node.values.push(processHash(value));
            }
            else if(value.tokenType == 'PERCENTAGE') {
                node.values.push(processPercentage(value));
            }
            else if(value.tokenType == 'DIMENSION') {
                node.values.push(processPixel(value));
            }
            else if(value.tokenType == 'URL') {
                node.values.push(processUrl(value));
            }
            else if(value.tokenType == 'IDENT') {
                node.values.push(processKeyword(value));
            }
            else if (value.tokenType == 'NUMBER') {
                node.values.push(processNumber(value));
            }
            else if (value.tokenType == 'STRING') {
                node.values.push(processString(value));
            }

            return node;
        };

        var processHash = function(value) {
            return {'value': value.value, 'string': '#' + value.value, 'typeGroup': 'color', 'type': 'rgb', 'format': 'hexadecimal'};
        };

        var processPercentage = function(value) {
            return {'value': value.value, 'string': value.value + '%', 'typeGroup': 'numeric', 'type': 'percentage'};
        };

        var processPixel = function(value) {
            return {'value': value.num, 'string': value.num + 'px', 'typeGroup': 'length', 'type': 'pixels'};
        };

        var processUrl = function(value) {
            return {'value': value.value, 'string': 'url(' + value.value + ')', 'typeGroup': 'textual', 'type': 'url'};
        };

        var processKeyword = function(value) {
            return {'value': value.value, 'string': value.value, 'typeGroup': 'textual', 'type': 'keyword'};
        };

        var processNumber = function(value) {
            return {'value': value.value, 'string': value.value, 'typeGroup': 'numeric', 'type': 'number'}
        };

        var processString = function(value) {
            return {'value': value.value, 'string': value.value, 'typeGroup': 'textual', 'type': 'string'};
        };

        return NodeAdaptorDeclaration;
    }
);