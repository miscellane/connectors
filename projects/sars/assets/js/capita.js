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
            id: "positiveRate",
            alias: "Positive/100k",
            description: "Cumulative positive cases per 100k",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "testRate",
            alias: "Tests/100k",
            description: "Cumulative tests per 100k",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "deathRate",
            alias: "Deaths/100k",
            description: "Cumulative deaths per 100k",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "hospitalizedRate",
            alias: "Hospitalized/100k",
            description: "Cumulative hospitalisations per 100k",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "ndays",
            alias: "Days",
            description: "Days thus far",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "label",
            alias: "Label",
            description: "Label",
            dataType: tableau.dataTypeEnum.float
        }
        ];

        var tableSchema = {
            id: "capitaFeed",
            alias: "Capita Feed",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };


    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://raw.githubusercontent.com/briefings/sars/develop/fundamentals/atlantic/warehouse/capita.json", function(data) {

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
            tableau.connectionName = "Capita Feed";
            tableau.submit();
        });

        myConnector.init = function(initCallback) {
            initCallback();
            tableau.submit();
        };
    });

})();
