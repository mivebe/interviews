const renderChart2 = rowData => {
    const container = document.getElementById("graph_container")

    const metrics = document.getElementById("metrics")
    metrics.innerHTML = ''

    const biggest = rowData.reduce((acc, curV) => acc[1] > curV[1] ? acc : curV)

    const sectionWidth = (container.scrollWidth) / (biggest[1] + 1)

    rowData.forEach((el, i) => {
        const width = sectionWidth * el[1]

        const row = document.createElement("div")
        row.classList.add("row")
        row.style.width = `${width}px`

        row.textContent = el[0]

        const value = document.createElement("span")
        value.classList.add("row-value")
        value.textContent = el[1]
        row.appendChild(value)

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

renderChart2([
    ["31", 2],
    ["28", 5],
    ["03", 3],
    ["04", 1],
    ["18", 1],
    ["22", 1],
    ["12", 4],
    ["11", 1],
    ["30", 4],
    ["19", 1],
    ["20", 2],
    ["07", 1],
    ["10", 19]
])
