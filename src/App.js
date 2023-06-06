import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

import './App.css';
import sampleExcelFile from './Book1.xlsx';

const App = () => {
  const [excelData, setExcelData] = useState(null);
  const [chart, setChart] = useState(null);

  const handleFileUpload = async () => {
    const response = await fetch(sampleExcelFile); // Fetch the sample Excel file
    const data = await response.arrayBuffer(); // Convert the file data to array buffer
    const workbook = XLSX.read(data, { type: 'array' }); // Read the workbook from array buffer
    const worksheetName = workbook.SheetNames[0]; // Get the name of the first worksheet
    const worksheet = workbook.Sheets[worksheetName]; // Get the worksheet using the name
    const range = XLSX.utils.decode_range(worksheet['!ref']); // Get the range of cells in the worksheet
    const rows = [];

    for (let R = range.s.r; R <= range.e.r; ++R) {
      const row = [];
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];
        const cellValue = cell?.v || '';
        row.push(cellValue);
      }
      rows.push(row);
    }

    if (chart !== null) {
      chart.destroy();
    }
    setExcelData(rows);
  };

  const chartData = {
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (excelData) {
    chartData.labels = excelData.slice(1).map((row) => row[0]);
    if (excelData[0].length > 1) {
      chartData.datasets[0].label = excelData[0][1];
      chartData.datasets[0].data = excelData.slice(1).map((row) => row[1]);
    }
  }

  return (
    <div className="container">
      <h1>Excel Reader and Bar Chart</h1>
      <button onClick={handleFileUpload}>Load Excel File</button>
      {excelData && (
        <div className="chart-container">
          <Bar data={chartData} />
        </div>
      )}
      {excelData && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                {excelData[0].map((cellData, index) => (
                  <th key={index}>{cellData}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {excelData.slice(1).map((rowData, index) => (
                <tr key={index}>
                  {rowData.map((cellData, index) => (
                    <td key={index}>{cellData}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
