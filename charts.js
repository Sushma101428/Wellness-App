function createLineChart(canvasId, labels, data, labelText) {
    new Chart(document.getElementById(canvasId), {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: labelText,
                data,
                borderColor: "#007bff",
                borderWidth: 2,
                tension: 0.4
            }]
        },
        options: { responsive: true }
    });
}
