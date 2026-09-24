(function () {
  const data = window.PLOT_DATA;

  function fmt(n, d) {
    return Number(n).toFixed(d);
  }

  function renderCoordsTable() {
    const tbody = document.getElementById("coords-tbody");
    if (!tbody) return;
    data.points.forEach((p) => {
      const tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + p.n + "</td>" +
        "<td>" + fmt(p.east, 2) + "</td><td>" + fmt(p.north, 2) + "</td>" +
        "<td>" + fmt(p.mskX, 2) + "</td><td>" + fmt(p.mskY, 2) + "</td>" +
        "<td>" + fmt(p.lat, 7) + "°</td><td>" + fmt(p.lon, 7) + "°</td>" +
        "<td>" + fmt(p.utmE, 2) + "</td><td>" + fmt(p.utmN, 2) + "</td>";
      tbody.appendChild(tr);
    });
  }

  function buildExportRows(cols) {
    // cols: array of {header, key} to pull off each point
    const header = cols.map((c) => c.header);
    const rows = data.points.map((p) => cols.map((c) => (typeof c.key === "function" ? c.key(p) : p[c.key])));
    return [header, ...rows];
  }

  function exportXlsx() {
    if (!window.XLSX) {
      alert("Библиотека экспорта не загрузилась — проверьте подключение к интернету и попробуйте снова.");
      return;
    }
    const wb = XLSX.utils.book_new();

    const localRows = buildExportRows([
      { header: "Точка", key: "n" },
      { header: "Восток, м", key: "east" },
      { header: "Север, м", key: "north" }
    ]);
    const mskRows = buildExportRows([
      { header: "Точка", key: "n" },
      { header: "X (МСК-50, зона 1)", key: "mskX" },
      { header: "Y (МСК-50, зона 1)", key: "mskY" }
    ]);
    const gpsRows = buildExportRows([
      { header: "Точка", key: "n" },
      { header: "Широта (WGS-84)", key: "lat" },
      { header: "Долгота (WGS-84)", key: "lon" },
      { header: "Easting (UTM 37N)", key: "utmE" },
      { header: "Northing (UTM 37N)", key: "utmN" }
    ]);

    const ws1 = XLSX.utils.aoa_to_sheet(localRows);
    const ws2 = XLSX.utils.aoa_to_sheet(mskRows);
    const ws3 = XLSX.utils.aoa_to_sheet(gpsRows);
    XLSX.utils.book_append_sheet(wb, ws1, "Местные (сайт)");
    XLSX.utils.book_append_sheet(wb, ws2, "МСК-50 зона 1");
    XLSX.utils.book_append_sheet(wb, ws3, "WGS-84 и UTM");

    XLSX.writeFile(wb, "uchastok-50-03-0050480-1383-koordinaty.xlsx");
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderCoordsTable();
    const btn = document.getElementById("export-xlsx");
    if (btn) btn.addEventListener("click", exportXlsx);
  });
})();
