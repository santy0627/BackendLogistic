const { datosCiudades } = require('../constants/ciudades');

const Radianes = (grados) => (grados * Math.PI) / 180

const haversine = (a, b) => {
    const dLat = Radianes(b.lat - a.lat)
    const dLng = Radianes(b.lng - a.lng)

    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(Radianes(a.lat)) * Math.cos(Radianes(b.lat)) * Math.sin(dLng / 2) ** 2

    return 2 * 6371 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

const ordenarRuta = (origen, paradas) => {
    const pendientes = [...paradas]
    const ruta = []
    let actual = origen

    while (pendientes.length > 0) {
        let indiceMasCercano = 0
        let menorDistancia = haversine(actual, pendientes[0])

        for (let i = 1; i < pendientes.length; i++) {
            const distancia = haversine(actual, pendientes[i])

            if (distancia < menorDistancia) {
                menorDistancia = distancia
                indiceMasCercano = i
            }
        }

        actual = pendientes.splice(indiceMasCercano, 1)[0]
        ruta.push(actual)

    }

    return ruta
}

const obtCoordBarrio = (ciudad, barrio) => {
    if(!Object.hasOwn(datosCiudades, ciudad)) return null

    const barrios = datosCiudades[ciudad].barrios

    if(!Object.hasOwn(barrios, barrio)) return null

    return barrios[barrio]
}

const obtBodega = (ciudad) => {
    if(!Object.hasOwn(datosCiudades, ciudad)) return null
    
    return obtCoordBarrio(ciudad, datosCiudades[ciudad].bodega.barrio)
}

const ordenarRemesas = (ciudad, remesas) => {
    const origen = obtBodega(ciudad)

    if(!origen) return [...remesas]

    const ubicadas = []
    const noUbicadas = []

    for (const remesa of remesas) {
        const ubicacion = obtCoordBarrio(ciudad, remesa.barrioDestino)

        if(ubicacion) {
            ubicadas.push({ remesa, lat: ubicacion.lat, lng: ubicacion.lng })
        } else {
            noUbicadas.push(remesa)
        }
    }

    const ordenadas = ordenarRuta(origen, ubicadas).map((parada) => parada.remesa)
    return [...ordenadas, ...noUbicadas]

}

module.exports = { haversine, ordenarRuta, ordenarRemesas }