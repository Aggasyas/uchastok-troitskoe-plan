(function () {
  const data = window.PLOT_DATA;
  const pts = data.points;

  // --- viewBox is 0..640, we map local meters (east,north) to svg coords.
  // north (X, "up" on map) maps to -y in SVG (since SVG y grows downward).
  const VB = 640;
  const PAD = 90; // padding for compass + labels

  const eastVals = pts.map((p) => p.east);
  const northVals = pts.map((p) => p.north);
  const eastMin = Math.min(...eastVals), eastMax = Math.max(...eastVals);
  const northMin = Math.min(...northVals), northMax = Math.max(...northVals);
  const spanE = eastMax - eastMin;
  const spanN = northMax - northMin;
  const span = Math.max(spanE, spanN);
  const scale = (VB - PAD * 2) / span;

  const cx = (eastMin + eastMax) / 2;
  const cy = (northMin + northMax) / 2;

  function toSvg(east, north) {
    const x = VB / 2 + (east - cx) * scale;
    const y = VB / 2 - (north - cy) * scale; // flip north to screen-up
    return [x, y];
  }

  function pointsToPath(ptsArr, closed) {
    const coords = ptsArr.map((p) => toSvg(p.east, p.north));
    let d = "M" + coords.map((c) => c.join(",")).join(" L");
    if (closed) d += " Z";
    return d;
  }

  function svgEl(tag, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  // ============ MAIN PLOT (compass + boundary + wind + sun) ============
  function renderPlot() {
    const svg = document.getElementById("plot-svg");
    if (!svg) return;

    const textColor = "var(--color-text)";
    const mutedColor = "var(--color-text-muted)";
    const faintColor = "var(--color-text-faint)";
    const primary = "var(--color-primary)";
    const sky = "var(--color-sky)";
    const sun = "var(--color-orange, #c98a3f)";

    // Compass ring
    const ringR = VB / 2 - 20;
    const center = [VB / 2, VB / 2];
    svg.appendChild(svgEl("circle", {
      cx: center[0], cy: center[1], r: ringR,
      fill: "none", stroke: "var(--color-divider)", "stroke-width": "1", "stroke-dasharray": "2,4"
    }));

    const dirs = [
      { label: "С", angle: 0 }, { label: "СВ", angle: 45 },
      { label: "В", angle: 90 }, { label: "ЮВ", angle: 135 },
      { label: "Ю", angle: 180 }, { label: "ЮЗ", angle: 225 },
      { label: "З", angle: 270 }, { label: "СЗ", angle: 315 }
    ];
    dirs.forEach((d) => {
      const rad = (d.angle * Math.PI) / 180;
      const x = center[0] + ringR * Math.sin(rad);
      const y = center[1] - ringR * Math.cos(rad);
      svg.appendChild(svgEl("text", {
        x, y, "text-anchor": "middle", "dominant-baseline": "middle",
        "font-size": d.label.length > 1 ? "11" : "13",
        fill: d.angle === 0 ? primary : faintColor,
        "font-weight": d.angle === 0 ? "700" : "400"
      })).textContent = d.label;
    });

    // Ход солнца и роза ветров переехали в отдельный интерактивный блок ниже
    // (раздел «Климат и ориентация») — там можно двигать месяц/время и видеть
    // тень от дома. Здесь план остаётся чистым — только границы и подписи.

    // Boundary polygon
    const boundaryPath = pointsToPath(pts, true);
    svg.appendChild(svgEl("path", {
      d: boundaryPath, fill: "color-mix(in oklab, var(--color-primary) 10%, transparent)",
      stroke: primary, "stroke-width": "2.5", "stroke-linejoin": "round"
    }));

    // Highlight road (edge 1-2) and tupik (edge 5-1) with a distinct overlay + label
    function highlightEdge(fromN, toN, label, dash) {
      const pA = pts.find((p) => p.n === fromN);
      const pB = pts.find((p) => p.n === toN);
      const [x1, y1] = toSvg(pA.east, pA.north);
      const [x2, y2] = toSvg(pB.east, pB.north);
      svg.appendChild(svgEl("line", {
        x1, y1, x2, y2, stroke: sky, "stroke-width": "5", "stroke-dasharray": dash, opacity: "0.35", "stroke-linecap": "round"
      }));
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      const nx2 = -dy / len, ny2 = dx / len;
      const lx = mx + nx2 * -26, ly = my + ny2 * -26;
      svg.appendChild(svgEl("text", {
        x: lx, y: ly, "text-anchor": "middle", "font-size": "10.5", "font-weight": "600", fill: sky
      })).textContent = label;
    }
    highlightEdge(3, 4, "Проездная дорога", "0");
    highlightEdge(1, 2, "Тупиковый проезд", "5,3");

    // Corner 2-3 is a chamfered angle where a power-line pole stands
    (function markPoleCorner() {
      const pA = pts.find((p) => p.n === 2);
      const pB = pts.find((p) => p.n === 3);
      const [x1, y1] = toSvg(pA.east, pA.north);
      const [x2, y2] = toSvg(pB.east, pB.north);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      svg.appendChild(svgEl("circle", { cx: mx, cy: my, r: "4", fill: "none", stroke: mutedColor, "stroke-width": "1.5" }));
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.hypot(dx, dy) || 1;
      const nx2 = -dy / len, ny2 = dx / len;
      const lx = mx + nx2 * 20, ly = my + ny2 * 20;
      svg.appendChild(svgEl("text", {
        x: lx, y: ly, "text-anchor": "middle", "font-size": "9.5", "font-weight": "500", fill: mutedColor
      })).textContent = "опора ЛЭП";
    })();

    // Points + labels
    pts.forEach((p) => {
      const [x, y] = toSvg(p.east, p.north);
      svg.appendChild(svgEl("circle", { cx: x, cy: y, r: "4.5", fill: primary }));
      const labelOffset = 14;
      svg.appendChild(svgEl("text", {
        x: x + labelOffset, y: y - labelOffset / 2, "font-size": "13", "font-weight": "600", fill: textColor
      })).textContent = p.n;
    });

    // Edge length labels at midpoints
    data.edges.forEach((e) => {
      const p1 = pts.find((p) => p.n === e.from);
      const p2 = pts.find((p) => p.n === e.to);
      const [x1, y1] = toSvg(p1.east, p1.north);
      const [x2, y2] = toSvg(p2.east, p2.north);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      // offset label perpendicular outward
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      const nx = -dy / len, ny = dx / len;
      const offset = 16;
      const lx = mx + nx * offset, ly = my + ny * offset;
      const bg = svgEl("rect", {
        x: lx - 18, y: ly - 9, width: 36, height: 16, rx: 3,
        fill: "var(--color-surface)", opacity: "0.9"
      });
      svg.appendChild(bg);
      svg.appendChild(svgEl("text", {
        x: lx, y: ly + 3, "text-anchor": "middle", "font-size": "10.5", fill: mutedColor
      })).textContent = e.dist.toFixed(1) + " м";
    });
  }

  // ============ ZONING PLOT ============
  // House's back (utility side) faces the road (edge 3-4, no neighbor, gentlest slope);
  // main facade faces edge 5-1 (neighbor 1384, east side). Entrance/gate sits at the
  // chamfered corner 2-3 (power-line pole). Zone polygons are pre-computed
  // (Python/Shapely) per house variant and embedded in data-embed.js.
  let currentHouseKey = "A";

  function renderZoning(houseKey) {
    houseKey = houseKey || currentHouseKey;
    currentHouseKey = houseKey;
    const svg = document.getElementById("zoning-svg");
    if (!svg) return;
    svg.innerHTML = "";
    const primary = "var(--color-primary)";

    const opt = data.houseOptions[houseKey];
    const house = opt.corners;
    const zones = opt.zones;

    function fillZone(coords, color, opacity) {
      if (!coords || !coords.length) return;
      const d = pointsToPath(coords, true);
      svg.appendChild(svgEl("path", { d, fill: color, opacity: opacity || "0.62", stroke: "none" }));
    }

    fillZone(zones.hedge, "var(--zone-hedge)", "0.7");
    fillZone(zones.sauna, "var(--zone-sauna)", "0.55");
    fillZone(zones.garage, "var(--zone-garage)", "0.55");
    fillZone(zones.berry, "var(--zone-berry)", "0.55");
    fillZone(zones.firepit, "var(--zone-firepit)", "0.5");
    fillZone(zones.lawn, "var(--zone-lawn)", "0.6");
    fillZone(house, "var(--zone-house)", "0.85");

    // Small zone labels centered in each polygon (skip tiny/house to avoid clutter)
    function zoneCentroid(coords) {
      let cx = 0, cy = 0;
      coords.forEach((c) => { cx += c.east / coords.length; cy += c.north / coords.length; });
      return { east: cx, north: cy };
    }
    function labelZone(coords, text, dy) {
      if (!coords || !coords.length) return;
      const c = zoneCentroid(coords);
      const [x, y] = toSvg(c.east, c.north);
      svg.appendChild(svgEl("text", {
        x, y: y + (dy || 0), "text-anchor": "middle", "font-size": "10.5", "font-weight": "600",
        fill: "var(--color-text)", opacity: "0.85"
      })).textContent = text;
    }
    labelZone(zones.lawn, "Лужайка · отдых");
    labelZone(zones.firepit, "Костёр · мангал");
    labelZone(zones.berry, "Ягоды");
    labelZone(zones.garage, "Гараж");
    labelZone(zones.sauna, "Баня");
    labelZone(zones.hedge, "Хвойная изгородь", -4);

    // Tree markers (apple + a few deciduous) along the inner edge of the hedge band,
    // spaced so they don't shade the lawn/firepit (hedge sits on the north boundary).
    const hedgeCoords = zones.hedge;
    if (hedgeCoords && hedgeCoords.length >= 4) {
      // hedge is a thin band; sample a few points along its inner (south) edge
      const innerEdge = [hedgeCoords[2], hedgeCoords[3]]; // by construction, index 2-3 is the inner edge
      function lerp(p1, p2, t) {
        return { east: p1.east + (p2.east - p1.east) * t, north: p1.north + (p2.north - p1.north) * t };
      }
      const treeSpots = [0.15, 0.4, 0.65, 0.88].map((t) => lerp(innerEdge[0], innerEdge[1], t));
      treeSpots.forEach((spot, i) => {
        const [tx, ty] = toSvg(spot.east, spot.north);
        const isApple = i % 2 === 0;
        svg.appendChild(svgEl("circle", {
          cx: tx, cy: ty, r: "5", fill: isApple ? "var(--zone-firepit)" : "var(--zone-hedge)",
          stroke: "var(--color-surface)", "stroke-width": "1.2"
        }));
      });
    }

    // Re-draw boundary on top for a crisp edge
    svg.appendChild(svgEl("path", {
      d: pointsToPath(pts, true), fill: "none", stroke: primary, "stroke-width": "2.5", "stroke-linejoin": "round"
    }));

    // Gate marker at the chamfered corner 2-3 (power-line pole)
    const gatePt = opt.gate;
    const [gx, gy] = toSvg(gatePt.east, gatePt.north);
    svg.appendChild(svgEl("circle", { cx: gx, cy: gy, r: "6", fill: "var(--color-primary)", stroke: "var(--color-surface)", "stroke-width": "2" }));
    svg.appendChild(svgEl("text", {
      x: gx + 10, y: gy - 8, "font-size": "11", "font-weight": "600", fill: "var(--color-text)"
    })).textContent = "Въезд";

    // House label
    const hc = house.reduce((a, c) => ({ east: a.east + c.east / house.length, north: a.north + c.north / house.length }), { east: 0, north: 0 });
    const [hx, hy] = toSvg(hc.east, hc.north);
    svg.appendChild(svgEl("text", {
      x: hx, y: hy, "text-anchor": "middle", "dominant-baseline": "middle", "font-size": "11", "font-weight": "700", fill: "var(--color-surface)"
    })).textContent = "Дом";

    // North arrow (small)
    const nx = VB - 50, ny = 50;
    svg.appendChild(svgEl("line", { x1: nx, y1: ny + 20, x2: nx, y2: ny - 20, stroke: "var(--color-text-faint)", "stroke-width": "1.5" }));
    svg.appendChild(svgEl("path", { d: `M${nx - 5},${ny - 12} L${nx},${ny - 22} L${nx + 5},${ny - 12} Z`, fill: "var(--color-text-faint)" }));
    svg.appendChild(svgEl("text", { x: nx, y: ny + 34, "text-anchor": "middle", "font-size": "11", fill: "var(--color-text-faint)", "font-weight": "700" })).textContent = "С";
  }

  window.renderZoningWithHouse = renderZoning;

  // ============ EDGES TABLE ============
  function renderEdgesTable() {
    const tbody = document.getElementById("edges-tbody");
    if (!tbody) return;
    const roleLabels = {
      road: "Проездная дорога",
      tupik: "Тупиковый проезд",
      corner: "Скошенный угол (опора ЛЭП)",
      neighbor: null
    };
    data.edges.forEach((e) => {
      const tr = document.createElement("tr");
      const cell = e.neighbor ? e.neighbor : (roleLabels[e.role] || "—");
      tr.innerHTML = `<td>${e.from} → ${e.to}</td><td>${e.azimuth.toFixed(1)}°</td><td>${e.dist.toFixed(2)} м</td><td>${cell}</td>`;
      tbody.appendChild(tr);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderPlot();
    renderZoning();
    renderEdgesTable();
  });
})();
