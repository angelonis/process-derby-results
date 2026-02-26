import { useState } from "react";
import * as XLSX from "xlsx";
import { processScoutData } from "../utils/ScoutProcessor";

function Upload({ onResultsReady }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validMimeType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    if (file.type !== validMimeType) {
      alert("Only valid .xlsx files are allowed.");
      event.target.value = null;
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // --- Sheet 1: Roster ---
      const rosterSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rosterData = XLSX.utils.sheet_to_json(rosterSheet);

      // --- Sheet 3: Standings ---
      const standingsSheet = workbook.Sheets[workbook.SheetNames[2]];

      // Header starts on row 3 → skip first 2 rows
      const standingsData = XLSX.utils.sheet_to_json(standingsSheet, {
        range: 2,
      });

      // Process data
      const processed = processScoutData(rosterData, standingsData);

      // Send to App.jsx
      onResultsReady(processed);
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <>
      <h1>Upload Results File</h1>

      <div className="upload-container">
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
        />

        {selectedFile && (
          <p className="file-name">
            Selected: {selectedFile.name}
          </p>
        )}

        <button onClick={handleUpload}>
          Process File
        </button>
      </div>
    </>
  );
}

export default Upload;