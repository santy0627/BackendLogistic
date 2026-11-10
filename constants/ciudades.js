const datosCiudades = {
  Bogotá: {
    bodega: { direccion: 'Av. Calle 13 # 68-50', barrio: 'Montevideo' },
    barrios: {
      Chapinero: { lat: 4.6486, lng: -74.0628 },
      'Chicó Norte': { lat: 4.6762, lng: -74.0484 },
      Teusaquillo: { lat: 4.6417, lng: -74.085 },
      'La Candelaria': { lat: 4.5965, lng: -74.0721 },
      Kennedy: { lat: 4.625, lng: -74.1573 },
      Fontibón: { lat: 4.678, lng: -74.143 },
      Modelia: { lat: 4.6635, lng: -74.117 },
      Montevideo: { lat: 4.65, lng: -74.124 },
      Suba: { lat: 4.743, lng: -74.084 }
    }
  },
  Medellín: {
    bodega: { direccion: 'Carrera 65 # 30-20', barrio: 'Guayabal' },
    barrios: {
      'El Poblado': { lat: 6.2088, lng: -75.5677 },
      Laureles: { lat: 6.2442, lng: -75.599 },
      Estadio: { lat: 6.257, lng: -75.59 },
      Belén: { lat: 6.231, lng: -75.603 },
      Guayabal: { lat: 6.219, lng: -75.59 },
      Manrique: { lat: 6.276, lng: -75.551 },
      Aranjuez: { lat: 6.285, lng: -75.563 },
      Robledo: { lat: 6.279, lng: -75.601 }
    }
  },
  Cali: {
    bodega: { direccion: 'Calle 15 # 30-20', barrio: 'Acopi' },
    barrios: {
      Acopi: { lat: 3.475, lng: -76.515 },
      Granada: { lat: 3.459, lng: -76.535 },
      'San Antonio': { lat: 3.446, lng: -76.543 },
      'San Fernando': { lat: 3.432, lng: -76.548 },
      'El Peñón': { lat: 3.449, lng: -76.545 },
      'Ciudad Jardín': { lat: 3.369, lng: -76.537 },
      Aguablanca: { lat: 3.42, lng: -76.49 },
      Siloé: { lat: 3.43, lng: -76.562 },
      Chipichape: { lat: 3.48, lng: -76.527 }
    }
  },
  Barranquilla: {
    bodega: { direccion: 'Calle 30 # 25-40', barrio: 'Centro' },
    barrios: {
      'El Prado': { lat: 10.998, lng: -74.804 },
      'Alto Prado': { lat: 11.001, lng: -74.807 },
      Boston: { lat: 10.991, lng: -74.792 },
      Riomar: { lat: 11.013, lng: -74.827 },
      'Villa Country': { lat: 11.009, lng: -74.808 },
      Recreo: { lat: 10.989, lng: -74.798 },
      Centro: { lat: 10.979, lng: -74.781 },
      Montes: { lat: 10.969, lng: -74.798 }
    }
  },
  Cartagena: {
    bodega: { direccion: 'Calle 31 # 54-120', barrio: 'El Bosque' },
    barrios: {
      Centro: { lat: 10.423, lng: -75.55 },
      Getsemaní: { lat: 10.421, lng: -75.545 },
      Manga: { lat: 10.411, lng: -75.54 },
      Bocagrande: { lat: 10.399, lng: -75.555 },
      Castillogrande: { lat: 10.391, lng: -75.55 },
      'El Bosque': { lat: 10.392, lng: -75.52 },
      Crespo: { lat: 10.445, lng: -75.516 }
    }
  },
  Cúcuta: {
    bodega: { direccion: 'Avenida 7 # 10-45', barrio: 'Centro' },
    barrios: {
      Centro: { lat: 7.8939, lng: -72.5078 },
      Caobos: { lat: 7.8841, lng: -72.4952 },
      'La Riviera': { lat: 7.8891, lng: -72.4927 },
      Guaimaral: { lat: 7.9097, lng: -72.4932 },
      Atalaya: { lat: 7.9076, lng: -72.5232}
    }
  },
  Bucaramanga: {
    bodega: { direccion: 'Carrera 15 # 30-20', barrio: 'Centro' },
    barrios: {
      Centro: { lat: 7.1193, lng: -73.1227 },
      'Cabecera del Llano': { lat: 7.114, lng: -73.106 },
      Provenza: { lat: 7.098, lng: -73.105 },
      Sotomayor: { lat: 7.117, lng: -73.112 },
      'San Alonso': { lat: 7.126, lng: -73.1165 }
    }
  },
  Pereira: {
    bodega: { direccion: 'Carrera 10 # 25-40', barrio: 'Centro' },
    barrios: {
      Centro: { lat: 4.8133, lng: -75.6961 },
      Pinares: { lat: 4.8085, lng: -75.683 },
      Álamos: { lat: 4.8225, lng: -75.7115 },
      Cuba: { lat: 4.804, lng: -75.736 },
      Maraya: { lat: 4.795, lng: -75.73 }
    }
  },
  'Santa Marta': {
    bodega: { direccion: 'Avenida del Ferrocarril # 29-50', barrio: 'Centro Histórico' },
    barrios: {
      'Centro Histórico': { lat: 11.2408, lng: -74.199 },
      'El Rodadero': { lat: 11.205, lng: -74.23 },
      Taganga: { lat: 11.268, lng: -74.192 },
      Bavaria: { lat: 11.2275, lng: -74.188 },
      Gaira: { lat: 11.193, lng: -74.225 },
      'El Pando': { lat: 11.229, lng: -74.196 }
    }
  },
  Ibagué: {
    bodega: { direccion: 'Carrera 5 # 60-20', barrio: 'Centro' },
    barrios: {
      Centro: { lat: 4.4389, lng: -75.2322 },
      'La Pola': { lat: 4.435, lng: -75.225 },
      Belén: { lat: 4.441, lng: -75.226 },
      Jordán: { lat: 4.449, lng: -75.2 },
      Mirolindo: { lat: 4.427, lng: -75.198 }
    }
  },
  Yumbo: {
    bodega: { direccion: 'Carrera 5 # 12-40', barrio: 'Centro' },
    barrios: {
      Centro: { lat: 3.585, lng: -76.495 },
      Belalcázar: { lat: 3.587, lng: -76.493 },
      'Buenos Aires': { lat: 3.592, lng: -76.49 },
      'La Estancia': { lat: 3.597, lng: -76.496 },
      Panorama: { lat: 3.58, lng: -76.5 },
      Arroyohondo: { lat: 3.59, lng: -76.47 }
    }
  },
  Palmira: {
    bodega: { direccion: 'Carrera 28 # 42-20', barrio: 'Centro' },
    barrios: {
      Centro: { lat: 3.5394, lng: -76.3036 },
      'Las Mercedes': { lat: 3.536, lng: -76.298 },
      'El Prado': { lat: 3.547, lng: -76.306 },
      Zamorano: { lat: 3.528, lng: -76.305 },
      Industrial: { lat: 3.53, lng: -76.29 }
    }
  },
  Popayán: {
    bodega: { direccion: 'Carrera 9 # 18N-50', barrio: 'Centro Histórico' },
    barrios: {
      'Centro Histórico': { lat: 2.4419, lng: -76.6063 },
      'El Cadillal': { lat: 2.456, lng: -76.605 },
      'La Esmeralda': { lat: 2.465, lng: -76.61 },
      Catay: { lat: 2.46, lng: -76.59 },
      Campobello: { lat: 2.45, lng: -76.595 }
    }
  },
  Pasto: {
    bodega: { direccion: 'Carrera 22 # 12-40', barrio: 'Centro' },
    barrios: {
      Centro: { lat: 1.2136, lng: -77.2811 },
      Santiago: { lat: 1.219, lng: -77.275 },
      'Las Cuadras': { lat: 1.206, lng: -77.287 },
      Morasurco: { lat: 1.23, lng: -77.27 },
      Tamasagra: { lat: 1.208, lng: -77.264 }
    }
  }
}

const ciudades = Object.keys(datosCiudades)

module.exports = { datosCiudades, ciudades }
