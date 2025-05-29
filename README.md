# POC Rate Limit - Sistema Anti-Abuso para Recargas

Sistema de recargas con protección anti-abuso que utiliza rate limiting para prevenir solicitudes maliciosas.

## Prerequisitos

- Backend NestJS ejecutándose en puerto 3000

<https://github.com/larturi/poc-recargas-antiabuso-nest>

## Instalación y Ejecución

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

3. Abrir [http://localhost:3001](http://localhost:3001) en el navegador

## Funcionamiento

### Formulario de Recargas

La aplicación presenta un formulario simple donde el usuario puede:

- Ingresar un número de línea telefónica (ej: 1123456789)
- Hacer clic en "Validar" para enviar la solicitud al backend
- Ver el resultado de la validación en pantalla

### Sistema de Identificación con FingerprintJS

Para implementar el rate limiting, la aplicación utiliza **FingerprintJS** (`@fingerprintjs/fingerprintjs`) que:

- Genera un ID único del visitante basado en características del navegador y dispositivo
- Este ID se obtiene automáticamente al cargar la página usando `FingerprintJS.load()`
- El `visitorId` se envía junto con cada solicitud POST al backend
- Permite al backend identificar de manera única a cada usuario sin requerir login

### Rate Limiting

El backend NestJS implementa las siguientes reglas:

- **Límite**: 10 solicitudes por minuto por visitante único
- **Bloqueo**: 15 minutos de suspensión tras superar el límite
- **Almacenamiento**: Redis para contadores y bloqueos temporales

### Flujo de la Aplicación

1. Usuario accede a `/phone`
2. FingerprintJS genera un `visitorId` único
3. Usuario completa el formulario y envía
4. Se hace POST a `http://localhost:3000/api/validar-linea` con:
   - `numeroLinea`: número ingresado
   - `visitorId`: identificador único del browser
5. Backend valida rate limit y responde
6. Frontend muestra el resultado

## Requisitos del Backend

Asegurarse de que el backend NestJS esté ejecutándose en puerto 3000 con:

- Servicio de rate limiting configurado
- Redis funcionando
- Endpoint `/api/validar-linea` disponible
