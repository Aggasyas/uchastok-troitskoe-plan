(function () {
  const data = window.PLOT_DATA;
  if (!data) return;

  const LAT = 56.2077;
  const LON = 36.7097;
  const TZ_OFFSET_H = 3; // Moscow time, UTC+3, no DST

  const MONTH_NAMES = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
  // Representative day-of-year for the 15th of each month
  const MONTH_DOY = [15, 46, 75, 106, 136, 167, 197, 228, 259, 289, 320, 350];

  // Prevailing wind direction (azimuth, degrees from North) and rough share per month,
  // based on Moscow-region climate summaries (winter SW/W, summer NW/W, transition seasons mixed W).
  const WIND_BY_MONTH = [
    { az: 225, label: "ЮЗ" }, // Jan
    { az: 225, label: "ЮЗ" }, // Feb
    { az: 247, label: "ЮЗ/З" }, // Mar
    { az: 270, label: "З" }, // Apr
    { az: 292, label: "З/СЗ" }, // May
    { az: 315, label: "СЗ" }, // Jun
    { az: 315, label: "СЗ" }, // Jul
    { az: 292, label: "З/СЗ" }, // Aug
    { az: 270, label: "З" }, // Sep
    { az: 247, label: "ЮЗ/З" }, // Oct
    { az: 225, label: "ЮЗ" }, // Nov
    { az: 225, label: "ЮЗ" } // Dec
  ];

  const deg2rad = (d) => (d * Math.PI) / 180;
  const rad2deg = (r) => (r * 180) / Math.PI;

  // Solar position (NOAA simplified algorithm), returns {elevation, azimuth} in degrees.
  // azimuth measured clockwise from North (0=N, 90=E, 180=S, 270=W) — standard compass convention.
  function sunPosition(dayOfYear, hourLocal) {
    const gamma = (2 * Math.PI / 365) * (dayOfYear - 1 + (hourLocal - 12) / 24);
    const eqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma)
      - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
    const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma)
      - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma)
      - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);

    // Standard meridian for UTC+3 is 45°E; local solar time correction:
    const timeOffsetMin = eqtime + 4 * (LON - 15 * TZ_OFFSET_H);
    const trueSolarTimeMin = hourLocal * 60 + timeOffsetMin;
    let hourAngleDeg = trueSolarTimeMin / 4 - 180;
    if (hourAngleDeg < -180) hourAngleDeg += 360;
    if (hourAngleDeg > 180) hourAngleDeg -= 360;
    const ha = deg2rad(hourAngleDeg);

    const latRad = deg2rad(LAT);
    const cosZenith = Math.sin(latRad) * Math.sin(decl) + Math.cos(latRad) * Math.cos(decl) * Math.cos(ha);
    const zenith = Math.acos(Math.max(-1, Math.min(1, cosZenith)));
    const elevation = 90 - rad2deg(zenith);

    let azimuthRad = Math.acos(
      Math.max(-1, Math.min(1, (Math.sin(decl) - Math.sin(latRad) * Math.cos(zenith)) / (Math.cos(latRad) * Math.sin(zenith))))
    );
    let azimuth = rad2deg(azimuthRad);
    if (hourAngleDeg > 0) azimuth = 360 - azimuth; // afternoon: mirror to the west side

    return { elevation, azimuth };
  }

  function svgEl(tag, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  // Local coordinate mapping identical to plan.js so the plot lines up.
  const pts = data.points;
  const eastVals = pts.map((p) => p.east);
  const northVals = pts.map((p) => p.north);
  const eastMin = Math.min(...eastVals), eastMax = Math.max(...eastVals);
  const northMin = Math.min(...northVals), northMax = Math.max(...northVals);
  const span = Math.max(eastMax - eastMin, northMax - northMin);
  const VB = 560;
  const PAD = 70;
  const scale = (VB - PAD * 2) / span;
  const cx = (eastMin + eastMax) / 2;
  const cy = (northMin + northMax) / 2;

  function toSvg(east, north) {
    return [VB / 2 + (east - cx) * scale, VB / 2 - (north - cy) * scale];
  }

  function pointsToPath(arr, closed) {
    const coords = arr.map((p) => toSvg(p.east, p.north));
    let d = "M" + coords.map((c) => c.join(",")).join(" L");
    if (closed) d += " Z";
    return d;
  }

  const HOUSE_HEIGHT_M = 6; // eaves-to-ridge average used only to size the shadow

  function houseCentroid(house) {
    return house.reduce((a, c) => ({ east: a.east + c.east / house.length, north: a.north + c.north / house.length }), { east: 0, north: 0 });
  }

  function render() {
    const svg = document.getElementById("sun-svg");
    const monthSlider = document.getElementById("sun-month");
    const hourSlider = document.getElementById("sun-hour");
    const readout = document.getElementById("sun-readout");
    const monthVal = document.getElementById("sun-month-val");
    const hourVal = document.getElementById("sun-hour-val");
    if (!svg || !monthSlider || !hourSlider) return;

    const monthIdx = parseInt(monthSlider.value, 10);
    const hour = parseFloat(hourSlider.value);
    monthVal.textContent = MONTH_NAMES[monthIdx];
    const hh = Math.floor(hour);
    const mm = Math.round((hour - hh) * 60);
    hourVal.textContent = String(hh).padStart(2, "0") + ":" + String(mm).padStart(2, "0");

    const { elevation, azimuth } = sunPosition(MONTH_DOY[monthIdx], hour);
    const wind = WIND_BY_MONTH[monthIdx];

    svg.innerHTML = "";
    const primary = "var(--color-primary)";
    const textColor = "var(--color-text)";
    const faintColor = "var(--color-text-faint)";
    const mutedColor = "var(--color-text-muted)";
    const sun = "var(--color-orange, #c98a3f)";
    const sky = "var(--color-sky)";

    const center = [VB / 2, VB / 2];
    const ringR = VB / 2 - 20;

    // Compass ring + labels
    svg.appendChild(svgEl("circle", { cx: center[0], cy: center[1], r: ringR, fill: "none", stroke: "var(--color-divider)", "stroke-width": "1", "stroke-dasharray": "2,4" }));
    [["С", 0], ["СВ", 45], ["В", 90], ["ЮВ", 135], ["Ю", 180], ["ЮЗ", 225], ["З", 270], ["СЗ", 315]].forEach(([label, angle]) => {
      const rad = deg2rad(angle);
      const x = center[0] + ringR * Math.sin(rad);
      const y = center[1] - ringR * Math.cos(rad);
      svg.appendChild(svgEl("text", { x, y, "text-anchor": "middle", "dominant-baseline": "middle", "font-size": label.length > 1 ? "11" : "13", fill: angle === 0 ? primary : faintColor, "font-weight": angle === 0 ? "700" : "400" })).textContent = label;
    });

    // Full day sun path for context (faint), using current month
    let pathD = "";
    for (let h = 3; h <= 23; h += 0.25) {
      const s = sunPosition(MONTH_DOY[monthIdx], h);
      if (s.elevation < -2) continue;
      const r = ringR * Math.max(0.08, 1 - Math.min(s.elevation, 90) / 90 * 0.85);
      const rad = deg2rad(s.azimuth);
      const x = center[0] + r * Math.sin(rad);
      const y = center[1] - r * Math.cos(rad);
      pathD += (pathD === "" ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1) + " ";
    }
    svg.appendChild(svgEl("path", { d: pathD, fill: "none", stroke: sun, "stroke-width": "1.5", "stroke-dasharray": "4,3", opacity: "0.45" }));

    // Wind arrow for the selected month
    (function drawWind() {
      const rad = deg2rad(wind.az);
      const rOuter = ringR + 16;
      const rInner = ringR - 6;
      const x1 = center[0] + rOuter * Math.sin(rad), y1 = center[1] - rOuter * Math.cos(rad);
      const x2 = center[0] + rInner * Math.sin(rad), y2 = center[1] - rInner * Math.cos(rad);
      const defs = svgEl("defs", {});
      defs.innerHTML = '<marker id="windarrow2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="' + sky + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></marker>';
      svg.appendChild(defs);
      svg.appendChild(svgEl("line", { x1, y1, x2, y2, stroke: sky, "stroke-width": "3", "marker-end": "url(#windarrow2)" }));
      const lx = center[0] + (rOuter + 22) * Math.sin(rad);
      const ly = center[1] - (rOuter + 22) * Math.cos(rad);
      svg.appendChild(svgEl("text", { x: lx, y: ly, "text-anchor": "middle", "font-size": "10.5", "font-weight": "600", fill: sky })).textContent = "ветер " + wind.label;
    })();

    // Boundary
    svg.appendChild(svgEl("path", { d: pointsToPath(pts, true), fill: "color-mix(in oklab, var(--color-primary) 8%, transparent)", stroke: primary, "stroke-width": "2", "stroke-linejoin": "round" }));

    // House A footprint (used as the shadow-casting reference building)
    const opt = data.houseOptions.A;
    const house = opt.corners;
    svg.appendChild(svgEl("path", { d: pointsToPath(house, true), fill: "var(--zone-house)", opacity: "0.85", stroke: "none" }));

    // Shadow: only when sun is above horizon. Shadow points opposite the sun azimuth,
    // length = height / tan(elevation), clamped to a sane max for very low sun.
    if (elevation > 0.5) {
      const shadowAzRad = deg2rad((azimuth + 180) % 360);
      const lengthM = Math.min(HOUSE_HEIGHT_M / Math.tan(deg2rad(Math.max(elevation, 1.5))), 60);
      const dEast = Math.sin(shadowAzRad) * lengthM;
      const dNorth = Math.cos(shadowAzRad) * lengthM;
      const shadowPoly = house.map((c) => ({ east: c.east + dEast, north: c.north + dNorth }));
      // Draw shadow as house-outline translated + connecting quad for a simple silhouette
      const combined = [...house, ...shadowPoly.slice().reverse()];
      svg.appendChild(svgEl("path", { d: pointsToPath(shadowPoly, true), fill: mutedColor, opacity: "0.28", stroke: "none" }));
      // connect corners for a pseudo-3D cast look on the two "sun-facing" edges
      house.forEach((c, i) => {
        const [x1, y1] = toSvg(c.east, c.north);
        const [x2, y2] = toSvg(c.east + dEast, c.north + dNorth);
        svg.appendChild(svgEl("line", { x1, y1, x2, y2, stroke: mutedColor, "stroke-width": "0.75", opacity: "0.35" }));
      });
    }

    // Sun marker itself, positioned by azimuth and a radius inversely related to elevation
    if (elevation > -5) {
      const r = ringR * Math.max(0.08, 1 - Math.min(Math.max(elevation, 0), 90) / 90 * 0.85);
      const rad = deg2rad(azimuth);
      const x = center[0] + r * Math.sin(rad);
      const y = center[1] - r * Math.cos(rad);
      svg.appendChild(svgEl("circle", { cx: x, cy: y, r: elevation > 0 ? "9" : "6", fill: sun, opacity: elevation > 0 ? "1" : "0.35", stroke: "var(--color-surface)", "stroke-width": "2" }));
    }

    // Points
    pts.forEach((p) => {
      const [x, y] = toSvg(p.east, p.north);
      svg.appendChild(svgEl("circle", { cx: x, cy: y, r: "3.5", fill: primary }));
    });

    // Readout text
    if (readout) {
      if (elevation <= 0) {
        readout.textContent = "Солнце ниже горизонта";
      } else {
        readout.textContent = "Высота " + elevation.toFixed(1) + "°, азимут " + azimuth.toFixed(0) + "°";
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const monthSlider = document.getElementById("sun-month");
    const hourSlider = document.getElementById("sun-hour");
    if (!monthSlider || !hourSlider) return;
    monthSlider.addEventListener("input", render);
    hourSlider.addEventListener("input", render);
    render();
  });
})();
