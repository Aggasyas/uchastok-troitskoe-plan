// Точные данные участка, полученные пересчётом координат МСК-50 (зона 1) из выписки ЕГРН.
window.PLOT_DATA = {
  cadastralNumber: "50:03:0050480:1383",
  address: "Московская область, г. Клин, д. Троицкое",
  areaM2: 975,
  areaTolerance: 22,
  // МСК-50 (зона 1): +proj=tmerc +lat_0=0 +lon_0=35.48333333333333 +k=1 +x_0=1250000
  // +y_0=-5712900.566 +ellps=krass +towgs84=23.57,-140.95,-79.8,0,-0.35,-0.79,-0.22 +units=m
  // WGS84 получены обратным пересчётом через pyproj, точность проверена round-trip (<1 см).
  // UTM zone 37N = EPSG:32637.
  points: [
    { n: 1, east: 0.0, north: 0.0, mskX: 519550.12, mskY: 1326262.58, lat: 56.2076444, lon: 36.7100571, utmE: 357962.36, utmN: 6231549.63 },
    { n: 2, east: -31.55, north: -7.52, mskX: 519542.60, mskY: 1326231.03, lat: 56.2075819, lon: 36.7095467, utmE: 357930.47, utmN: 6231543.73 },
    { n: 3, east: -36.37, north: -4.55, mskX: 519545.57, mskY: 1326226.21, lat: 56.2076093, lon: 36.7094699, utmE: 357925.81, utmN: 6231546.94 },
    { n: 4, east: -41.56, north: 17.26, mskX: 519567.38, mskY: 1326221.02, lat: 56.2078060, lon: 36.7093925, utmE: 357921.74, utmN: 6231568.99 },
    { n: 5, east: -4.49, north: 26.12, mskX: 519576.24, mskY: 1326258.09, lat: 56.2078796, lon: 36.7099923, utmE: 357959.21, utmN: 6231575.94 }
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
        lawn: [{east:-9.06,north:-2.16},{east:-31.55,north:-7.52},{east:-28.4,north:-2.41},{east:-29.82,north:-1.54},{east:-19.19,north:0.99},{east:-21.96,north:12.66},{east:-21.13,north:9.17},{east:-12.44,north:13.27},{east:-15.12,north:18.95},{east:-3.73,north:21.68},{east:-4.49,north:26.12},{east:-2.59,north:15.09}],
        firepit: [{east:-21.96,north:12.66},{east:-32.93,north:10.05},{east:-34.9,north:14.22},{east:-15.12,north:18.95},{east:-12.44,north:13.27},{east:-21.13,north:9.17}],
        berry: [{east:0.0,north:0.0},{east:-9.06,north:-2.16},{east:-2.59,north:15.09}],
        garage: [{east:-36.37,north:-4.55},{east:-34.15,north:-0.94},{east:-33.78,north:-2.48},{east:-29.82,north:-1.54},{east:-28.4,north:-2.41},{east:-31.55,north:-7.52}],
        sauna: [{east:-36.37,north:-4.55},{east:-41.56,north:17.26},{east:-40.51,north:12.88},{east:-23.31,north:16.99},{east:-34.9,north:14.22},{east:-32.93,north:10.05},{east:-36.56,north:9.19},{east:-33.78,north:-2.48},{east:-34.15,north:-0.94}],
        hedge: [{east:-41.56,north:17.26},{east:-4.49,north:26.12},{east:-3.73,north:21.68},{east:-40.51,north:12.88}]
      },
      areas: {
        house: 180.0,
        lawn: 348.1,
        firepit: 116.2,
        berry: 71.2,
        garage: 27.2,
        sauna: 63.9,
        hedge: 170.8
      }
    },
    B: {
      label: "Вариант Б · 2 этажа, 8×10 м",
      floors: 2,
      footprintM2: 80.0,
      corners: [{east:-33.78,north:-2.48},{east:-35.63,north:5.3},{east:-25.9,north:7.61},{east:-24.05,north:-0.17}],
      gate: {east: -33.96, north: -6.04},
      zones: {
        lawn: [{east:-9.06,north:-2.16},{east:-31.55,north:-7.52},{east:-28.4,north:-2.41},{east:-29.82,north:-1.54},{east:-33.78,north:-2.48},{east:-24.05,north:-0.17},{east:-25.9,north:7.61},{east:-25.75,north:6.99},{east:-12.44,north:13.27},{east:-15.12,north:18.95},{east:-3.73,north:21.68},{east:-4.49,north:26.12},{east:-2.59,north:15.09}],
        firepit: [{east:-25.9,north:7.61},{east:-31.18,north:6.36},{east:-34.9,north:14.22},{east:-15.12,north:18.95},{east:-12.44,north:13.27},{east:-25.75,north:6.99}],
        berry: [{east:0.0,north:0.0},{east:-9.06,north:-2.16},{east:-2.59,north:15.09}],
        garage: [{east:-36.37,north:-4.55},{east:-34.15,north:-0.94},{east:-33.78,north:-2.48},{east:-29.82,north:-1.54},{east:-28.4,north:-2.41},{east:-31.55,north:-7.52}],
        sauna: [{east:-36.37,north:-4.55},{east:-41.56,north:17.26},{east:-40.51,north:12.88},{east:-23.31,north:16.99},{east:-34.9,north:14.22},{east:-31.18,north:6.36},{east:-25.9,north:7.61},{east:-33.68,north:5.76},{east:-35.63,north:5.3},{east:-33.78,north:-2.48},{east:-34.15,north:-0.94}],
        hedge: [{east:-41.56,north:17.26},{east:-4.49,north:26.12},{east:-3.73,north:21.68},{east:-40.51,north:12.88}]
      },
      areas: {
        house: 80.0,
        lawn: 387.5,
        firepit: 160.1,
        berry: 71.2,
        garage: 27.2,
        sauna: 80.6,
        hedge: 170.8
      }
    }
  }
};
