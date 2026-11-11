// Carga remesas de prueba con datos realistas (ciudades, barrios y direcciones de Colombia).
//
// Uso (desde la carpeta Backend):
//   node scripts/seedRemesas.js --dry               -> solo muestra las remesas, NO guarda nada
//   node scripts/seedRemesas.js                     -> guarda 40 remesas
//   node scripts/seedRemesas.js --cantidad=100      -> guarda 100 remesas
//   node scripts/seedRemesas.js --ciudad=Cali       -> todas las remesas van a esa ciudad
//   node scripts/seedRemesas.js --desde=26200001    -> otro lote (otros códigos y otros datos)
//
// Es seguro ejecutarlo varias veces: si una remesa con el mismo código ya existe,
// no la duplica ni la modifica. Tampoco borra nada.
//
// Todas las remesas usan un barrio que existe en constants/ciudades.js, así se pueden
// ordenar por ruta. Todas se crean "enBodega": los demás estados (asignada, cargada,
// enTransito...) los asigna la aplicación cuando la remesa entra a un camión.

const path = require('path')
const { datosCiudades, ciudades } = require('../constants/ciudades')
const Remesa = require('../models/remesaSchema')

// ---------- Configuración ----------
const CANTIDAD_POR_DEFECTO = 40
const CODIGO_INICIAL_POR_DEFECTO = 26100001 // 8 dígitos, para cumplir el validador del backend
const SEMILLA = 2026 // misma semilla y mismo lote = mismas remesas (por eso no duplica)

// Con qué frecuencia aparece cada ciudad como destino (las que no están pesan 1)
const PESO_CIUDAD = {
  Bogotá: 4,
  Medellín: 3,
  Cali: 4,
  Barranquilla: 2,
  Cartagena: 2,
  Bucaramanga: 2,
  Yumbo: 2,
  Palmira: 2
}

// Ciudades desde donde suele salir la mercancía
const ORIGENES = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Pereira']

// Rangos creíbles según el tipo de mercancía
const MERCANCIAS = [
  { tipo: 'cajas', peso: 5, cantidad: [10, 250], kgPorUnidad: [2, 5, 8, 12, 15, 20, 25] },
  { tipo: 'pallet', peso: 3, cantidad: [1, 10], kgPorUnidad: [300, 450, 600, 750, 900] },
  { tipo: 'sacos', peso: 3, cantidad: [20, 200], kgPorUnidad: [25, 40, 50] }
]

const REMITENTES = [
  'Distribuidora Andina S.A.S.',
  'Alimentos del Valle Ltda.',
  'Comercializadora Los Andes',
  'Industrias Metálicas del Norte',
  'Textiles y Confecciones del Pacífico',
  'Agroinsumos del Campo S.A.S.',
  'Plásticos y Envases de Colombia',
  'Importadora Caribe Trading',
  'Papelería y Útiles Express',
  'Cacharrería y Hogar Mayorista'
]

const DESTINATARIOS = [
  'Supermercado El Ahorro',
  'Ferretería La Esquina',
  'Droguería San Jorge',
  'Papelería Central',
  'Tienda Doña Rosa',
  'Distribuciones El Progreso',
  'Minimercado Los Amigos',
  'Restaurante La Fogata',
  'Panadería El Trigal',
  'Carlos Andrés Ruiz',
  'María Fernanda Gómez',
  'Luis Eduardo Martínez',
  'Diana Carolina Torres',
  'Juan Pablo Herrera',
  'Claudia Patricia Vargas'
]

const TIPOS_VIA = ['Cl', 'Cra', 'Av', 'Diag', 'Tv']
const SUFIJOS = ['', '', '', 'A', 'B', 'C', 'D', 'E']
const COMPLEMENTOS = [
  '',
  '',
  '',
  'Bodega 2',
  'Bodega 5',
  'Local 3',
  'Local 12',
  'Piso 2',
  'Oficina 301'
]

// ---------- Generador de números aleatorios con semilla ----------
const crearAleatorio = (semilla) => {
  let a = semilla

  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const crearGenerador = (semilla) => {
  const azar = crearAleatorio(semilla)
  const entero = (min, max) => Math.floor(azar() * (max - min + 1)) + min
  const elegir = (lista) => lista[entero(0, lista.length - 1)]
  const elegirConPeso = (lista) => {
    const total = lista.reduce((suma, item) => suma + item.peso, 0)
    let punto = azar() * total

    for (const item of lista) {
      punto -= item.peso
      if (punto < 0) return item
    }

    return lista[lista.length - 1]
  }

  return { entero, elegir, elegirConPeso }
}

// ---------- Construcción de las remesas ----------
const generarRemesas = (cantidad, codigoInicial, ciudadFija) => {
  const { entero, elegir, elegirConPeso } = crearGenerador(SEMILLA + codigoInicial)
  const opcionesCiudad = ciudades.map((nombre) => ({ nombre, peso: PESO_CIUDAD[nombre] ?? 1 }))
  const remesas = []

  for (let i = 0; i < cantidad; i++) {
    const ciudadDestino = ciudadFija ?? elegirConPeso(opcionesCiudad).nombre
    const barrioDestino = elegir(Object.keys(datosCiudades[ciudadDestino].barrios))
    const ciudadOrigen = elegir(ORIGENES.filter((ciudad) => ciudad !== ciudadDestino))

    const mercancia = elegirConPeso(MERCANCIAS)
    const unidades = entero(mercancia.cantidad[0], mercancia.cantidad[1])
    const kgPorUnidad = elegir(mercancia.kgPorUnidad)

    const bis = entero(1, 10) === 1 ? ' Bis' : '' // solo la vía principal puede llevar "Bis"
    const via = `${elegir(TIPOS_VIA)} ${entero(1, 120)}${elegir(SUFIJOS)}${bis}`
    const puerta = `${entero(1, 95)}${elegir(SUFIJOS)}-${String(entero(1, 99)).padStart(2, '0')}`
    const direccionDestino = [`${via} # ${puerta}`, elegir(COMPLEMENTOS)].filter(Boolean).join(', ')

    remesas.push({
      codigo: codigoInicial + i,
      cantidad: unidades,
      pesoTotal: unidades * kgPorUnidad,
      direccionDestino,
      ciudadDestino,
      barrioDestino,
      tipoMercancia: mercancia.tipo,
      estado: 'enBodega',
      remitente: elegir(REMITENTES),
      destinatario: elegir(DESTINATARIOS),
      ciudadOrigen
    })
  }

  return remesas
}

// Comprueba cada remesa contra el schema (bulkWrite no lo hace por sí solo)
const validarRemesas = async (remesas) => {
  for (const remesa of remesas) {
    try {
      await new Remesa(remesa).validate()
    } catch (error) {
      console.error(`La remesa ${remesa.codigo} no cumple el schema: ${error.message}`)
      process.exit(1)
    }
  }
}

// ---------- Argumentos ----------
const leerArgumento = (nombre) => {
  const prefijo = `--${nombre}=`
  const encontrado = process.argv.find((arg) => arg.startsWith(prefijo))

  return encontrado ? encontrado.slice(prefijo.length) : undefined
}

// Acepta "cali", "Cali", "bogota", "Bogotá"... (ignora mayúsculas y tildes)
const sinTildes = (texto) => texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

const buscarCiudad = (texto) => ciudades.find((ciudad) => sinTildes(ciudad) === sinTildes(texto))

// ---------- Ejecución ----------
const main = async () => {
  const esPrueba = process.argv.includes('--dry')
  const cantidad = Number(leerArgumento('cantidad') ?? CANTIDAD_POR_DEFECTO)
  const codigoInicial = Number(leerArgumento('desde') ?? CODIGO_INICIAL_POR_DEFECTO)
  const textoCiudad = leerArgumento('ciudad')

  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 500) {
    console.error('La cantidad debe ser un número entero entre 1 y 500.')
    process.exit(1)
  }

  if (
    !Number.isInteger(codigoInicial) ||
    codigoInicial < 10000000 ||
    codigoInicial + cantidad - 1 > 99999999
  ) {
    console.error(
      '--desde debe ser un número de 8 dígitos y el lote completo debe caber en 8 dígitos.'
    )
    process.exit(1)
  }

  let ciudadFija
  if (textoCiudad !== undefined) {
    ciudadFija = buscarCiudad(textoCiudad)

    if (!ciudadFija) {
      console.error(
        `La ciudad "${textoCiudad}" no existe. Ciudades válidas: ${ciudades.join(', ')}`
      )
      process.exit(1)
    }
  }

  const remesas = generarRemesas(cantidad, codigoInicial, ciudadFija)
  await validarRemesas(remesas)

  if (esPrueba) {
    console.log(`Modo prueba: se generaron ${remesas.length} remesas, no se guardó nada.\n`)
    console.table(
      remesas.map((remesa) => ({
        codigo: remesa.codigo,
        origen: remesa.ciudadOrigen,
        destino: remesa.ciudadDestino,
        barrio: remesa.barrioDestino,
        cantidad: remesa.cantidad,
        kg: remesa.pesoTotal,
        tipo: remesa.tipoMercancia,
        estado: remesa.estado
      }))
    )
    return
  }

  // Se cargan aquí para que el modo --dry funcione sin conexión
  require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true })
  const mongoose = require('mongoose')
  const dbConnection = require('../config/db')

  await dbConnection()

  // dbConnection() atrapa el error de conexión y no lo lanza, así que se verifica aquí
  if (mongoose.connection.readyState !== 1) {
    console.error('No se pudo conectar a la base de datos. No se guardó nada.')
    console.error('Revisa tu conexión y la lista de IP permitidas en MongoDB Atlas.')
    process.exit(1)
  }

  console.log(`Base de datos: ${mongoose.connection.name}`)

  const resultado = await Remesa.bulkWrite(
    remesas.map((remesa) => ({
      updateOne: {
        filter: { codigo: remesa.codigo },
        update: { $setOnInsert: remesa }, // solo escribe si NO existe esa remesa
        upsert: true
      }
    }))
  )

  const creadas = resultado.upsertedCount

  console.log(`Remesas creadas: ${creadas}`)
  console.log(`Ya existían (sin cambios): ${remesas.length - creadas}`)

  await mongoose.disconnect()
}

main().catch((error) => {
  console.error('Error al cargar las remesas:', error.message)
  process.exit(1)
})
