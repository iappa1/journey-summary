import constants from "../constants";
const { Pool } = require("pg");
const conf = {
  host: constants.db_host,
  port: constants.db_port,
  user: constants.db_username,
  password: constants.db_password,
  database: constants.db_name,
  max: constants.db_max,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
}

if (constants.db_ssl !== "false") {
  conf["ssl"] = true
} else {
  conf["ssl"] = false
}

const POSTGRES_POOL = new Pool(conf);

export default POSTGRES_POOL;
