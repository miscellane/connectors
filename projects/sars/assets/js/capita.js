(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "datetimeobject",
            alias: "Date",
            description: "COVID Tracking Project data date",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "STUSPS",
            alias: "U.S. Postal Service State Code (Capita)",
            description: "The two letter code of a United States state or territory",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "deathRate",
            alias: "Deaths/100k [C]",
            description: "Cumulative, and unique, deaths per 100k",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "positiveRate",
            alias: "Positive/100k [C]",
            description: "Positive cases thus far per 100k",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "testRate",
            alias: "Tests/100k [C]",
            description: "Cumulative tests per 100k",
            dataType: tableau.dataTypeEnum.float
        },  {
            id: "icuRate",
            alias: "ICU Patients/100k [C]",
            description: "Cumulative, and unique, ICU patients per 100k",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "hospitalizedRate",
            alias: "Hospitalized/100k [C]",
            description: "Cumulative, and unique, hospitalisations per 100k",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "ndays",
            alias: "Days",
            description: "Days thus far",
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
                    deathRate: data[i][2],
                    positiveRate: data[i][3],
                    testRate: data[i][4],
                    icuRate: data[i][5],
                    hospitalizedRate: data[i][6],
                    ndays: data[i][7]
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
