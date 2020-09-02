(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "datetimeobject",
            alias: "date",
            description: "COVID Tracking Project data date",
            dataType: tableau.dataTypeEnum.date
        }, {
            id: "STUSPS",
            description: "The two letter code of a United States state or territory",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "positiveIncrease",
            alias: "Positive Cases",
            description: "Daily positives",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "testIncrease",
            alias: "Tests",
            description: "Daily tests",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "deathIncrease",
            alias: "Deaths",
            description: "Daily deaths",
            dataType: tableau.dataTypeEnum.int
        }];

        var tableSchema = {
            id: "increasesFeed",
            alias: "Increases Feed",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };


    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://raw.githubusercontent.com/briefings/sars/develop/fundamentals/atlantic/warehouse/increases.json", function(data) {

            // Placeholder
            var tableData = [],
                dataLength = data.length,
                i=0;

            // Iterate over the lines
            for (i; i < dataLength; i += 1) {
                tableData.push({
                    datetimeobject: data[i][0],
                    STUSPS: data[i][1],
                    positiveIncrease: data[i][2],
                    testIncrease: data[i][3],
                    deathIncrease: data[i][4]
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "Increases Feed";
            tableau.submit();
        });

        myConnector.init = function(initCallback) {
            initCallback();
            tableau.submit();
        };
    });

})();
