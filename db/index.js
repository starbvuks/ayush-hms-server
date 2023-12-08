const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: 5432,
  database: "ayush",
  user: "postgres",
  password: "password",
});

client.connect();

function query(query, values) {
  return client.query(query, values);
}

module.exports = {
  query,
};
