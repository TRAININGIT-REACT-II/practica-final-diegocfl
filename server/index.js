// Servidor de ejemplo para la práctica final del curso
const fastify = require("fastify")({ logger: true });
const bcrypt = require("bcrypt");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");
const { nanoid } = require("nanoid");

// Configuracion
const DB_PATH =
  process.env.DB_PATH || path.resolve(__dirname, "..", "data", "db.json");
const DB_DEFAULTS = {
  users: [],
  notes: [],
};
const SALT_ROUNDS_TO_ENCRYPT = 5;
const USER_ID_LENGTH = 8;
const NOTE_ID_LENGTH = 8;
const TOKEN_LENGTH = 24;
const API_TOKEN_HEADER = "api-token";

// Cargamos la base de datos (lowdb)
// @ref https://github.com/typicode/lowdb
const dbAdapter = new FileSync(DB_PATH);
const db = low(dbAdapter);
db.defaults(DB_DEFAULTS).write();

/**
 * Configura Fastify para comprobar el token y obtener el usuario
 * en cada ruta. Finalmente, la ruta lo utilizará si es necesario.
 */
// Esta configuración es más conveniente hacerla a través de un
// plugin, pero por simplicidad la haré directamente aquí.
// @ref https://www.fastify.io/docs/latest/Decorators/#decorate-request
fastify.decorateRequest("token", null);
fastify.decorateRequest("user", null);
fastify.decorateRequest("authenticated", false);

// Agregamos un hook para cargar el usuario en cada petición
// si el token está presente.
fastify.addHook("preHandler", (request, _reply, done) => {
  const token = request.headers[API_TOKEN_HEADER];
  request.token = token;

  if (token != null) {
    const user = db.get("users").find({ token }).value();

    if (user != null) {
      request.user = user;
      request.authenticated = true;
    }
  }

  done();
});

// Una función para compborar si el usuario existe.
// En otro caso, devuelve un 401
const checkAuthentication = (request, reply, done) => {
  if (request.token == null) {
    reply.code(401).send({
      error: "El token no está presente en la petición",
    });
  } else if (!request.authenticated) {
    reply.code(401).send({
      error: "No existe un usuario asociado al token",
    });
  }

  done();
};

// Peticiones

/**
 * GET /
 * Autenticación: No
 *
 * Devuelve un simple OK. Se puede utilizar para comprobar si el servidor
 * funciona.
 */
fastify.get("/api", async () => {
  return { status: "ok" };
});

/**
 * POST /register
 * Autenticación: No
 *
 * Registra un nuevo usuario en el sistema. Recibe los parámetros por
 * el cuerpo del mensaje
 */
fastify.post("/api/register", (request, reply) => {
  const { username, password } = request.body;

  const userExists = db.get("users").find({ username }).value();

  if (userExists != null) {
    reply.code(400).send({
      error: "El nombre de usuario ya existe",
    });
  } else {
    // Encriptamos la contraseña
    bcrypt.hash(password, SALT_ROUNDS_TO_ENCRYPT, (err, hash) => {
      if (err) {
        return reply.code(500).send({
          error: "Hubo un error al almacenar la contraseña",
        });
      }

      const newUser = {
        id: nanoid(USER_ID_LENGTH),
        username: username,
        password: hash,
        token: nanoid(TOKEN_LENGTH),
      };

      // Almacenamos el usuario en la DB
      db.get("users").push(newUser).write();

      return reply.send({
        id: newUser.id,
        username,
        token: newUser.token,
      });
    });
  }
});

/**
 * POST /login
 * Autenticación: No
 *
 * Inicia sesión devolviendo el token para las peticiones
 */
fastify.post("/api/login", (request, reply) => {
  const { username, password } = request.body;

  const user = db.get("users").find({ username }).value();

  if (user == null) {
    reply.code(401).send({
      error: "Las credenciales introducidas no son correctas",
    });
  } else {
    // Encriptamos la contraseña
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return reply.code(500).send({
          error: "Hubo un error al comprobar las credenciales",
        });
      }

      if (result) {
        return reply.send({
          id: user.id,
          username,
          token: user.token,
        });
      } else {
        reply.code(401).send({
          error: "Las credenciales introducidas no son correctas",
        });
      }
    });
  }
});

/**
 * GET /notes
 * Autenticación: Sí
 *
 * Devuelve las notas del usuario
 */
fastify.route({
  method: "GET",
  path: "/api/notes",
  preHandler: checkAuthentication,
  handler: (request, reply) => {
    // Obtenemos el usuario
    const { id: userId } = request.user;
    const notes = db.get("notes").filter({ author: userId }).value();

    return notes;
  },
});

/**
 * GET /notes/:id
 * Autenticación: Sí
 *
 * Devuelve las notas del usuario
 */
fastify.route({
  method: "GET",
  path: "/api/notes/:id",
  preHandler: checkAuthentication,
  handler: (request, reply) => {
    // Obtenemos el usuario
    const { id: userId } = request.user;
    const { id } = request.params;
    const note = db.get("notes").find({ author: userId, id }).value();

    if (note == null) {
      reply.code(404).send({
        error: "La nota no existe",
      });
    } else {
      return {
        ...note,
        author: {
          id: userId,
          username: request.user.username,
        },
      };
    }
  },
});

/**
 * POST /notes
 * Autenticación: Sí
 *
 * Crea una nueva nota en el sistema
 */
fastify.route({
  method: "POST",
  path: "/api/notes",
  preHandler: checkAuthentication,
  handler: (request, reply) => {
    // Obtenemos el usuario
    const { id: userId } = request.user;
    const { title, content } = request.body;
    const date = new Date();

    const newPost = {
      author: userId,
      title,
      content,
      createdAt: date,
      updatedAt: date,
      id: nanoid(NOTE_ID_LENGTH),
    };

    db.get("notes").push(newPost).write();

    return {
      id: newPost.id,
      title,
      content,
      createdAt: date,
      updatedAt: date
    };
  },
});

/**
 * PATCH /notes/id
 * Autenticación: Sí
 *
 * Actualiza una nota en el sistema
 */
fastify.route({
  method: ["PATCH", "PUT"],
  path: "/api/notes/:id",
  preHandler: checkAuthentication,
  handler: (request, reply) => {
    // Obtenemos el usuario
    const { id: userId } = request.user;
    const { title, content } = request.body;
    const { id } = request.params;
    const note = db.get("notes").find({ author: userId, id }).value();

    if (note == null) {
      reply.code(404).send({
        error: "La nota no existe",
      });
    } else {
      // Actualizamos
      db.get("notes")
        .find({ author: userId, id })
        .assign({ title, content, updatedAt: new Date() })
        .write();

      return {
        ...note,
        title,
        content,
        author: {
          id: userId,
          username: request.user.username,
        },
      };
    }
  },
});

/**
 * DELETE /notes/id
 * Autenticación: Sí
 *
 * Crea una nueva nota en el sistema
 */
fastify.route({
  method: "DELETE",
  path: "/api/notes/:id",
  preHandler: checkAuthentication,
  handler: (request, reply) => {
    // Obtenemos el usuario
    const { id: userId } = request.user;
    const { id } = request.params;
    const note = db.get("notes").find({ author: userId, id }).value();

    if (note == null) {
      reply.code(404).send({
        error: "La nota no existe",
      });
    } else {
      // Eliminamos
      db.get("notes").remove({ author: userId, id }).write();

      return {};
    }
  },
});

// Iniciamos el servidor!
const start = async () => {
  try {
    await fastify.listen({
      port: 3000
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
