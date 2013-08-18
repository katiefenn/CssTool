define(
    'CssTool',
    ['DataAdaptor', 'underscore', 'backbone', 'metrics/All', 'Report'],

    function(DataAdaptor, _, Backbone, metrics, Report) {

        var CssTool = Backbone.Model.extend({

            defaults: {
                dataAdaptor: new DataAdaptor(),
                metrics: metrics
            },

            runReport: function(sources) {
                var data = [];

                if (_.isString(sources)) {
                    sources = [sources];
                }

                _.each(sources, function(source) {
                    data.push(this.get("dataAdaptor").process(source));
                }, this);

                var report = new Report({data: data, metrics: this.get("metrics")});
                return report.run();
            }
        });

        return CssTool;
    }
);