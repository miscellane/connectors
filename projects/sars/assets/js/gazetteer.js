(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "STATEFP",
            alias: "State FIPS",
            description: "Federal Information Processing Standard State Code",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "STATEGEOID",
            alias: "State GEOID",
            description: "State Geographic Identifier",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "STUSPS",
            alias: "U.S. Postal Service State Code",
            description: "The two letter code of a United States state or territory",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "STATE",
            alias: "State",
            description: "U.S. State/Territory",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "POPESTIMATE2019",
            alias: "Population Estimate 2019",
            description: "Population Estimate 2019",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "ALAND",
            alias: "Land Area (Sq. Metres)",
            description: "Land Area in Square Metres",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "REGION",
            alias: "Region",
            description: "Administrative Regions",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "DIVISION",
            alias: "Division",
            description: "Administrative Divisions",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "gazetteerFeed",
            alias: "Gazetteer Feed",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };


    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://raw.githubusercontent.com/briefings/sars/develop/fundamentals/atlantic/warehouse/gazetteer.json", function(data) {

            // Placeholder
            var tableData = [],
                dataLength = data.length,
                i=0;

            // Iterate over the lines
            for (i; i < dataLength; i += 1) {
                tableData.push({
                    STATEFP: data[i][0],
                    STATEGEOID: data[i][1],
                    STUSPS: data[i][2],
                    STATE: data[i][3],
                    POPESTIMATE2019: data[i][4],
                    ALAND: data[i][5],
                    REGION: data[i][6],
                    DIVISION: data[i][7]
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "Gazetter Feed";
            tableau.submit();
        });

        myConnector.init = function(initCallback) {
            initCallback();
            tableau.submit();
        };
    });

})();
