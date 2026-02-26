export function processScoutData(rosterData, standingsData) {
  // ---------- Normalize Helpers ----------
  const normalize = (value) =>
    value ? value.toString().trim().toLowerCase() : "";

  const fullName = (first, last) =>
    `${first} ${last}`.trim().toLowerCase();

  // ---------- STEP 1: Build Average Lookup ----------
  // Standings header starts on row 3 (already assumed parsed correctly)
  const averageLookup = {};

  standingsData.forEach((row) => {
    if (!row.Name || row.Average == null) return;

    const nameKey = normalize(row.Name);
    averageLookup[nameKey] = Number(row.Average);
  });

  // ---------- STEP 2: Build Master Scout List ----------
  const scouts = rosterData.map((row) => {
    const firstName = row["First Name"]?.trim();
    const lastName = row["Last Name"]?.trim();
    const den = row["Den"]?.trim();
    const raced = Number(row["Passed?"]) === 1;

    const nameKey = fullName(firstName, lastName);

    return {
      firstName,
      lastName,
      den: den || "",
      raced,
      average: averageLookup[nameKey] ?? null,
    };
  });

  // ---------- STEP 3: Group Separation ----------
  const unassigned = [];
  const akela = [];
  const competitive = [];

  scouts.forEach((scout) => {
    const normalizedDen = normalize(scout.den);

    // If didn't race OR no den → Unassigned
    if (!scout.raced || !normalizedDen) {
      unassigned.push({
        ...scout,
        den: scout.den || "Unassigned",
      });
      return;
    }

    // If Akela (case insensitive)
    if (normalizedDen === "akela") {
      akela.push(scout);
      return;
    }

    // If raced but no average found → treat as unassigned (data issue)
    if (scout.average == null) {
      unassigned.push(scout);
      return;
    }

    competitive.push(scout);
  });

  // ---------- STEP 4: Sort Competitive ----------
  competitive.sort((a, b) => a.average - b.average);

  // ---------- STEP 5: Top 5 Overall ----------
  const topFive = competitive.slice(0, 5);

  const topFiveNameSet = new Set(
    topFive.map((s) => fullName(s.firstName, s.lastName))
  );

  // ---------- STEP 6: Group By Den ----------
  const denGroups = {};

  competitive.forEach((scout) => {
    const denKey = scout.den;

    if (!denGroups[denKey]) {
      denGroups[denKey] = [];
    }

    denGroups[denKey].push({
      ...scout,
      isTopFive: topFiveNameSet.has(
        fullName(scout.firstName, scout.lastName)
      ),
    });
  });

  // Sort each den group
  Object.values(denGroups).forEach((group) =>
    group.sort((a, b) => a.average - b.average)
  );

  // Sort special groups
  akela.sort((a, b) => (a.average ?? Infinity) - (b.average ?? Infinity));
  unassigned.sort((a, b) => (a.average ?? Infinity) - (b.average ?? Infinity));

  return {
    topFive,
    denGroups,
    akela,
    unassigned,
  };
}