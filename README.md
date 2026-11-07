# Terminal Web

Prototipo web de una terminal financiera para el mercado argentino, con estilo de terminal: tablas de mercado por pestaña, cálculos en el backend y un adaptador para conectar un broker real. Fue el boceto de diseño y de tipos de datos de `terminal-f`.

## Stack

Next.js (App Router), React, TypeScript, Tailwind CSS y componentes de shadcn/ui.

## Ejecutar

```bash
npm install
npm run dev     # http://localhost:3000
```

## Datos

- **Sin variables de entorno:** usa datos de ejemplo (mock), así que funciona de entrada.
- **Con un broker:** copiá `.env.example` a `.env.local` y completalo.

```bash
BROKER_BASE_URL=https://api.tu-broker.com
BROKER_API_KEY=tu_api_key
```

El adaptador espera:

- `GET {BROKER_BASE_URL}/market/snapshot?settlement=CI|24hs`
- Header `Authorization: Bearer {BROKER_API_KEY}`
- Respuesta JSON con `marketStatus` (estado del mercado, Merval, S&P 500, dólar MEP y CCL) y `watchlists` (`cedears`, `acciones`, `on`, `caucion`).

Si el broker falla, el backend vuelve automáticamente a los datos de ejemplo.

## Notas

- Es un prototipo: los precios de ejemplo no son reales.
- No hay que subir `.env.local` ni claves al repositorio (ver `.gitignore`).
