//all db configuration is done here
exports.dbConfig = {
  server: "localhost",
  database: "LeanDb",
  user: "sa",
  password: process.env.MssqlPw,
  port: '1433',
};