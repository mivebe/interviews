
document.getElementById('time-period').addEventListener('change', (event) => {
    event.preventDefault()
    if (!window.data) { return }
    window.radioValue = event.target.value
    renderChart(getFinalData(window.data))
})

function handleFileChange(event) {
    const file = event.target.files[0]

    document.getElementById("days").checked = true

    const reader = new FileReader()
    reader.addEventListener('loadend', ({ target }) => {
        const arrData = CSVToArray(target.result, ",")
        handleData(arrData)
    })
    reader.readAsText(file)
}

function CSVToArray(strData, strDelimiter) {

    strDelimiter = strDelimiter || ",";

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

        if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
            arrData.push([]);
        }

        let strMatchedValue;

        if (arrMatches[2]) {
            strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
        } else {
            strMatchedValue = arrMatches[3];
        }

        arrData[arrData.length - 1].push(strMatchedValue);
    }
    return (arrData);
}

const handleData = arrData => {
    window.data = arrData
    const finalData = getFinalData(arrData)
    renderChart(finalData)
}

const getFinalData = (arrData) => {
    const data = arrData.filter(el => el != [] && !el.includes(""))
    const [, ...rows] = data.filter(el => el[3] != "")

    let dateIdx = 0
    if (window.radioValue === 'Day' || !window.radioValue) dateIdx = 2

    if (window.radioValue === 'Month') dateIdx = 1

    const dates = rows.map(el => el[3].slice(0, 10).split('-')[dateIdx])

    const datesMap = dates.reduce((acc, curV) => {
        !acc.has(curV) ? acc.set(curV, 1) : acc.set(curV, (acc.get(curV)) + 1)
        return acc
    }, new Map())

    const finalData = []
    datesMap.forEach((el, key) => {
        finalData.push([key, el])
    })

    return finalData
}

const renderChart = rowData => {
    const container = document.getElementById("graph_container")
    container.innerHTML = ''

    const metrics = document.getElementById("metrics")
    metrics.innerHTML = ''

    const biggest = rowData.reduce((acc, curV) => acc[1] > curV[1] ? acc : curV)

    const sectionWidth = (container.scrollWidth) / (biggest[1] + 1)
    const sectionHeight = (container.scrollHeight) / (rowData.length + 1)

    rowData.forEach(el => {
        const width = sectionWidth * el[1]

        const row = document.createElement("div")
        row.classList.add("row")
        row.style.width = `${width}px`
        row.height = `${sectionHeight}px`
        row.textContent = el[0]
        container.append(row)
    })

    for (let i = 0; i < biggest[1] + 1; i++) {
        const mark = document.createElement("p")
        mark.textContent = i
        mark.classList.add("mark")
        mark.style.width = `${sectionWidth}px`
        metrics.append(mark)
    }

    const finalMark = document.createElement("span")
    finalMark.textContent = biggest[1] + 1
    metrics.lastChild.appendChild(finalMark)
}