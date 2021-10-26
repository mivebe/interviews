const fs = require('fs');



const strData = fs.readFileSync("HTML-CSS-JS/exercises/Interviews/Kanbanize/task_4/card_data.csv", "utf8")
console.log(strData);

const arrData = CSVToArray(strData, ",")
console.log(arrData);

anychart.onDocumentReady(function () {

    // set the data
    const data = {
        header: ["Name", "Death toll"],
        rows: [
            ["San-Francisco (1906)", 1500],
            ["Messina (1908)", 87000],
            ["Ashgabat (1948)", 175000],
            ["Chile (1960)", 10000],
            ["Tian Shan (1976)", 242000],
            ["Armenia (1988)", 25000],
            ["Iran (1990)", 50000]
        ]
    };

    const chart = anychart.bar();
    chart.data(data);

    chart.title("The deadliest earthquakes in the XXth century");

    chart.container("container");
    chart.draw();
});



function CSVToArray(strData, strDelimiter) {

    strDelimiter = (strDelimiter || ",");

    const objPattern = new RegExp(
        (
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );

    const arrData = [[]];
    let arrMatches = null;

    while (arrMatches = objPattern.exec(strData)) {

        const strMatchedDelimiter = arrMatches[1];


        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ) {
            arrData.push([]);
        }

        let strMatchedValue;

        if (arrMatches[2]) {
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );
        } else {
            strMatchedValue = arrMatches[3];
        }
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    return (arrData);
}