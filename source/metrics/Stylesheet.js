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