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