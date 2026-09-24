// Точные данные участка, полученные пересчётом координат МСК-50 (зона 1) из выписки ЕГРН.
window.PLOT_DATA = {
  cadastralNumber: "50:03:0050480:1383",
  address: "Московская область, г. Клин, д. Троицкое",
  areaM2: 975,
  areaTolerance: 22,
  points: [
    { n: 1, east: 0.0, north: 0.0 },
    { n: 2, east: -31.55, north: -7.52 },
    { n: 3, east: -36.37, north: -4.55 },
    { n: 4, east: -41.56, north: 17.26 },
    { n: 5, east: -4.49, north: 26.12 }
  ],
  edges: [
    { from: 1, to: 2, dist: 32.43, azimuth: 256.6, neighbor: null, role: "tupik" },
    { from: 2, to: 3, dist: 5.66, azimuth: 301.6, neighbor: null, role: "corner" },
    { from: 3, to: 4, dist: 22.42, azimuth: 346.6, neighbor: null, role: "road" },
    { from: 4, to: 5, dist: 38.11, azimuth: 76.6, neighbor: "50:03:0050480:1846", role: "neighbor" },
    { from: 5, to: 1, dist: 26.5, azimuth: 170.2, neighbor: "50:03:0050480:1384", role: "neighbor" }
  ],
  houseOptions: {
    A: {
      label: "Вариант А · 1 этаж, 12×15 м",
      floors: 1,
      footprintM2: 180.0,
      corners: [{east:-33.78,north:-2.48},{east:-36.56,north:9.19},{east:-21.96,north:12.66},{east:-19.19,north:0.99}],
      gate: {east: -33.96, north: -6.04},
      zones: {
        lawn: [{east:-40.25,north:11.75},{east:-38.82,north:13.08},{east:-37.6,north:13.57},{east:-23.01,north:17.04},{east:-21.25,north:17.11},{east:-19.99,north:16.71},{east:-18.59,north:15.64},{east:-17.59,north:13.7},{east:-14.73,north:1.6},{east:-14.74,north:0.28},{east:-15.14,north:-0.98},{east:-16.2,north:-2.38},{east:-17.72,north:-3.27},{east:-32.65,north:-6.84},{east:-36.37,north:-4.55}],
        orchard: [{east:-18.21,north:15.13},{east:-19.24,north:16.24},{east:-20.4,north:16.88},{east:-22.57,north:17.12},{east:-37.6,north:13.57},{east:-38.82,north:13.08},{east:-39.85,north:12.25},{east:-40.25,north:11.75},{east:-36.63,north:-3.46},{east:-41.56,north:17.26},{east:-8.2,north:25.23}],
        garden: [{east:-17.31,north:-3.1},{east:-16.2,north:-2.38},{east:-15.35,north:-1.37},{east:-14.83,north:-0.16},{east:-14.69,north:1.16},{east:-17.59,north:13.7},{east:-18.21,north:15.13},{east:-8.2,north:25.23},{east:-4.49,north:26.12},{east:0.0,north:0.0},{east:-28.0,north:-6.67},{east:-27.98,north:-5.73}],
        decor: [{east:-31.55,north:-7.52},{east:-32.65,north:-6.84},{east:-27.98,north:-5.73},{east:-28.0,north:-6.67}]
      },
      areas: {
        house: 180.0,
        lawn: 277.89,
        orchard: 150.24,
        garden: 365.38,
        decor: 3.88
      }
    },
    B: {
      label: "Вариант Б · 2 этажа, 8×10 м",
      floors: 2,
      footprintM2: 80.0,
      corners: [{east:-33.78,north:-2.48},{east:-35.63,north:5.3},{east:-25.9,north:7.61},{east:-24.05,north:-0.17}],
      gate: {east: -33.96, north: -6.04},
      zones: {
        lawn: [{east:-22.91,north:-3.48},{east:-34.07,north:-5.97},{east:-36.37,north:-4.55},{east:-38.96,north:6.35},{east:-38.61,north:7.13},{east:-37.68,north:8.13},{east:-36.77,north:8.61},{east:-26.71,north:11.02},{east:-25.35,north:11.07},{east:-24.07,north:10.59},{east:-23.07,north:9.66},{east:-22.5,north:8.42},{east:-20.58,north:0.3},{east:-20.66,north:-1.06},{east:-21.07,north:-2.0},{east:-21.73,north:-2.79}],
        orchard: [{east:-23.32,north:9.97},{east:-25.01,north:11.0},{east:-26.37,north:11.08},{east:-36.44,north:8.7},{east:-37.95,north:7.92},{east:-38.96,north:6.35},{east:-41.56,north:17.26},{east:-8.2,north:25.23}],
        garden: [{east:-23.24,north:-3.57},{east:-22.0,north:-3.0},{east:-21.26,north:-2.29},{east:-20.66,north:-1.06},{east:-20.55,north:-0.04},{east:-22.5,north:8.42},{east:-23.32,north:9.97},{east:-8.2,north:25.23},{east:-4.49,north:26.12},{east:0.0,north:0.0},{east:-28.0,north:-6.67},{east:-28.11,north:-4.73}],
        decor: [{east:-34.07,north:-5.97},{east:-28.11,north:-4.73},{east:-27.99,north:-6.62},{east:-31.55,north:-7.52}]
      },
      areas: {
        house: 80.0,
        lawn: 158.48,
        orchard: 259.25,
        garden: 470.35,
        decor: 9.3
      }
    }
  }
};
