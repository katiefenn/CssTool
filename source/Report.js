define(
    'Report',
    ['underscore', 'backbone'],

    function (_, Backbone) {
        var Report = Backbone.Model.extend({
            defaults: {
                results: {}
            },

            initialize: function() {
                this.set({
                    'results': {}
                });
            },

            run: function(data) {
                _.each(data, function(stylesheet) {
                    this.runMetricsOnStylesheet(stylesheet, this.get("metrics").stylesheet);

                    _.each(stylesheet, function(rulePart){
                        if(rulePart.type == 'selector') {
                            this.runMetricsOnCatalogItem(rulePart, this.get("metrics").selector);
                        }
                        else if(rulePart.type == 'declaration') {
                            this.runMetricsOnCatalogItem(rulePart, this.get("metrics").declaration);
                        }
                    }, this);
                }, this);

                return this.get("results");
            },

            runMetricsOnStylesheet: function(stylesheet, metrics) {
                _.each(metrics, function(metric){
                    _.extend(this.get("results"), metric.measure(stylesheet));
                }, this);
            },

            runMetricsOnCatalogItem: function(catalogItem, metrics) {
                _.each(metrics, function(metric){
                    _.extend(this.get("results"), metric.measure(catalogItem));
                }, this);                
            }
        });

        return Report;
    }
);