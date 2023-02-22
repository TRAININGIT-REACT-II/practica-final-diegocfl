# Práctica final del curso de React de TrainingIT

Este proyecto incluye la plantilla para realizar la práctica final del curso ["Crea y gestiona tus aplicaciones con React (Avanzado)"](https://trainingit.es/curso-react-avanzado/) de [TrainingIT](https://trainingit.es/). Utiliza este proyecto como punto de partida para crear tu aplicación.

Este proyecto incluye:

- [Servidor](#servidor)
- [Cliente](#cliente)

# Instalación

Para lanzar este ejemplo solo es necesario tener instalado:

- [Node](https://nodejs.org/es/)
- [NPM](https://www.npmjs.com/) (viene instalado con NodeJS)

Una vez que tienes ambas librerías instaladas, solo tienes que instalar las dependencias del proyecto:

```
npm install
```

# Comenzar a desarollar

El `package.json` incluye un script para ejecutar el servidor y el cliente al mismo tiempo:

```
npm start

> practica-final@1.0.0 start
> concurrently npm:client npm:server

[server]
[server] > practica-final@1.0.0 server
[server] > nodemon -w server server/index.js
[server]
[client]
[client] > practica-final@1.0.0 client
[client] > webpack serve --mode development --config ./client/webpack.config.js
[client]
[server] [nodemon] 2.0.7
[server] [nodemon] to restart at any time, enter `rs`
[server] [nodemon] watching path(s): server/**/*
[server] [nodemon] watching extensions: js,mjs,json
[server] [nodemon] starting `node server/index.js`
[server] {"level":30,"time":1619892797077,"pid":24759,"hostname":"MacBook-Pro-de-Angel.local","msg":"Server listening at http://127.0.0.1:3000"}
[client] ℹ ｢wds｣: Project is running at http://localhost:8080/
[client] ℹ ｢wds｣: webpack output is served from /
[client] ℹ ｢wds｣: Content not from webpack is served from /Users/angelmm/Workspace/Practica-Final
[client] ℹ ｢wds｣: 404s will fallback to /index.html
[client] ℹ ｢wdm｣: wait until bundle finished: /
[client] ℹ ｢wdm｣: asset main.js 3.57 MiB [emitted] (name: main)
[client] asset favicon.ico 1.17 KiB [emitted]
[client] asset index.html 218 bytes [emitted]
[client] runtime modules 25.8 KiB 13 modules
[client] modules by path ../node_modules/ 1.33 MiB 38 modules
[client] modules by path ./ 7.62 KiB
[client]   modules by path ./src/ 5.28 KiB
[client]     modules by path ./src/components/*.css 2.24 KiB
[client]       ./src/components/Status.css 1.34 KiB [built] [code generated]
[client]       ../node_modules/css-loader/dist/cjs.js!./src/components/Status.css 920 bytes [built] [code generated]
[client]     ./src/App.js 2.67 KiB [built] [code generated]
[client]     ./src/components/Status.js 385 bytes [built] [code generated]
[client]   modules by path ./*.css 2.1 KiB
[client]     ./index.css 1.32 KiB [built] [code generated]
[client]     ../node_modules/css-loader/dist/cjs.js!./index.css 806 bytes [built] [code generated]
[client]   ./index.js 239 bytes [built] [code generated]
[client] webpack 5.36.2 compiled successfully in 3265 ms
```

Una vez ejecutado este comando, podrás acceder a la aplicación el <http://localhost:8080>. Mediante la configuración de webpack, tienes disponible el servidor en la ruta `/api`.

# Componentes

## Servidor

El servidor es un proyecto desarrollado con:

- Fastify
- bcrypt
- lowdb

En principio no vas a necesitar modificar el código, pero puedes verlo y modificarlo en la carpeta `server`.

> NOTA: Este servidor no es apto para producción. Es un servidor orientado a desarrollo local y solo debe de servir como ejemplo.

## Cliente

El cliente es el objetivo de esta práctica. Es una aplicación que incluye una configuración básica de Webpack y un componente. A partir de aquí, tendrás que desarollar la práctica final del curso.

El código que contiene es un ejemplo y puedes modificarlo a tu gusto.

# Práctica

Mi recomendación es que comiences con la práctica desde el primer día y la uses para prácticar con los distintos apartados del curso. De esta manera, durante la semana final solo tendrás que aplicar ciertos retoques.

¡Mucho ánimo!
