// script.js

document.addEventListener("DOMContentLoaded", () => {
    const pressureForm = document.getElementById("pressure-form");
    const bloodPressureChart = document.getElementById("blood-pressure-chart").getContext("2d");
    const viewHistoryButton = document.getElementById("view-history");
    let chart; // Variable para el gráfico

    // Función para cargar el historial desde localStorage
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem("bloodPressureHistory")) || [];
        return history;
    }

    // Función para actualizar el gráfico
    function updateChart(data) {
        const systolic = data.map(item => item.systolic);
        const diastolic = data.map(item => item.diastolic);
        const labels = data.map(item => item.timestamp);

        if (chart) {
            chart.destroy(); // Destruir gráfico anterior si existe
        }

        chart = new Chart(bloodPressureChart, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Presión Arterial Sistólica',
                    data: systolic,
                    borderColor: 'red',
                    fill: false,
                    borderWidth: 2
                }, {
                    label: 'Presión Arterial Diastólica',
                    data: diastolic,
                    borderColor: 'blue',
                    fill: false,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Hora'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Presión (mmHg)'
                        }
                    }
                }
            }
        });
    }

    // Manejo de la presentación del formulario
    pressureForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const systolic = parseInt(document.getElementById("systolic").value);
        const diastolic = parseInt(document.getElementById("diastolic").value);
        const timestamp = new Date().toLocaleTimeString(); // Hora actual

        // Guardar lectura en localStorage
        const history = loadHistory();
        history.push({ systolic, diastolic, timestamp });
        localStorage.setItem("bloodPressureHistory", JSON.stringify(history));

        // Limpiar el formulario
        pressureForm.reset();

        // Actualizar gráfico
        updateChart(history);
    });

    // Manejo del botón de ver historial
    viewHistoryButton.addEventListener("click", () => {
        const history = loadHistory();
        let historyList = "Historial de Lecturas:\n\n";
        history.forEach((entry, index) => {
            historyList += `Lectura ${index + 1}: ${entry.systolic} / ${entry.diastolic} mmHg a las ${entry.timestamp}\n`;
        });
        alert(historyList);
    });

    // Cargar historial en el gráfico al cargar la página
    const history = loadHistory();
    updateChart(history);
});


// script.js

// Simulamos un almacenamiento local para las lecturas
const readings = JSON.parse(localStorage.getItem('bloodPressureReadings')) || [];

// Función para mostrar el historial
function displayHistory() {
    const tableBody = document.getElementById('historyTableBody');
    tableBody.innerHTML = ''; // Limpiar la tabla

    // Variables para el cálculo de promedios
    let totalSystolic = 0;
    let totalDiastolic = 0;

    // Agregar cada lectura a la tabla
    readings.forEach(reading => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${reading.date}</td>
            <td>${reading.systolic}</td>
            <td>${reading.diastolic}</td>
        `;
        tableBody.appendChild(row);

        // Sumar para el promedio
        totalSystolic += reading.systolic;
        totalDiastolic += reading.diastolic;
    });

    // Calcular y mostrar estadísticas
    const totalReadings = readings.length;
    const averageSystolic = (totalSystolic / totalReadings).toFixed(2) || 0;
    const averageDiastolic = (totalDiastolic / totalReadings).toFixed(2) || 0;

    document.getElementById('averageSystolic').innerText = `Promedio Sistólico: ${averageSystolic} mmHg`;
    document.getElementById('averageDiastolic').innerText = `Promedio Diastólico: ${averageDiastolic} mmHg`;
    document.getElementById('totalReadings').innerText = `Total de Lecturas: ${totalReadings}`;
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', displayHistory);