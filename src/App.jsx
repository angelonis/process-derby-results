import { useState } from "react";
import "./App.css";
import logo from "./assets/logo.png";

import Home from "./pages/Home";
import Results from "./pages/Results";
import Upload from "./pages/Upload";



function App() {
  const [activePage, setActivePage] = useState("home");
  const [resultsData, setResultsData] = useState(null);

  // rendered content
  const renderContent = () => {
    switch (activePage) {
      case "home":
        return <Home />;
      case "upload":
        return <Upload
      onResultsReady={(data) => {
        setResultsData(data);
        setActivePage("results"); // auto navigate
      }}
    />;
      case "results":
        return <Results data={resultsData} />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <a
            href="https://www.pack11coventry.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="header-link"
          >
            <h2>Pack 11 Coventry</h2>
          </a>
        </div>

        <nav className="menu">
          <ul>
            <li
              className={`menu-item ${activePage === "home" ? "active" : ""}`}
              onClick={() => setActivePage("home")}
            >
              Home
            </li>
            <li
              className={`menu-item ${activePage === "upload" ? "active" : ""}`}
              onClick={() => setActivePage("upload")}
            >
              Upload
            </li>
            <li
              className={`menu-item ${activePage === "results" ? "active" : ""}`}
              onClick={() => setActivePage("results")}
            >
              Results
            </li>
          </ul>
        </nav>
        {/* Bottom Image */}
        <div className="sidebar-footer">
          <img src={logo} alt="Sidebar Logo" />
        </div>
      </aside>

      {/* Dynamic Content Area */}
      <main className="content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;