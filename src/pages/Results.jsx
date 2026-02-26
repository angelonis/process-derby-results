function Results({ data }) {
  if (!data) {
    return (<div>
      <h1>Results</h1>
      <p>Upload your file to see your results.</p>
      <br></br>
    </div>)
  }

  const { topFive, denGroups, akela, unassigned } = data;

  return (
    <div>
      <h1>Results</h1>
      <p>Highlighted results appear in the top 5 and should not be awarded top den racer.</p>
      <br></br>

      <h2>🏆 Top 5 Overall</h2>
      {topFive.map((scout, index) => (
        <div key={index}>
          {index + 1}. {scout.firstName} {scout.lastName} — {scout.average}
        </div>
      ))}

      <h2>🏅 Den Results</h2>
      {Object.entries(denGroups).map(([den, scouts]) => (
        <div key={den}>
          <h3>{den}</h3>
          {scouts.map((scout, index) => (
            <div
              key={index}
              className={scout.isTopFive ? "highlight" : ""}
            >
              {index + 1}. {scout.firstName} {scout.lastName} — {scout.average}
            </div>
          ))}
        </div>
      ))}

      <h2>🧑‍🏫 Akela</h2>
      {akela.map((scout, index) => (
        <div key={index}>
          {scout.firstName} {scout.lastName} — {scout.average ?? "N/A"}
        </div>
      ))}

      <h2>⚠️ Unassigned / Did Not Race</h2>
      {unassigned.map((scout, index) => (
        <div key={index}>
          {scout.firstName} {scout.lastName}
        </div>
      ))}
    </div>
  );
}

export default Results;