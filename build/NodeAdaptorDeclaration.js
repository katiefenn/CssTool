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