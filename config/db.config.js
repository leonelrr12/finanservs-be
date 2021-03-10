module.exports = {
  HOST: "localhost",
  USER: "rsanchez",
  PASSWORD: "cafekotowa",
  DB: "finanservs",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}; 