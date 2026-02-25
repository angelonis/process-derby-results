import { useState } from "react";

function Upload() {
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

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    console.log("File ready:", selectedFile);
    alert(`File "${selectedFile.name}" ready for processing.`);
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