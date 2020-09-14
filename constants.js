


const constants = {

    // Postgres DB connection
    db_host: process.env.DB_HOST || "localhost",
    db_name: process.env.DB_NAME || "postgres",
    db_port: process.env.DB_PORT || 5432,
    db_max: 10,
    db_username: process.env.DB_USERNAME || "postgres",
    db_password: process.env.DB_PASSWORD || "root",
    db_ssl: process.env.SSL || "false",


    // for redis
    redis_port: process.env.REDIS_PORT || "6379",
    redis_host: process.env.REDIS_HOST || "redis",

    // cassandra
    cassandra_client_configuration: {
        contact_points: process.env.CASSANDRA_HOSTS || "cassandra:9042",
        local_data_center: process.env.CASSANDRA_DATACENTER || "datacenter1",
        keyspace: process.env.CASSANDRA_KEYSPACE || "factoreal",
        credentials: {
            username: process.env.CASSANDRA_USERNAME || "cassandra",
            password: process.env.CASSANDRA_PASSWORD || "cassandra",
        },
    },

    //enterprise_id
    enterprise_id : process.env.ENTERPRISE_ID || "5"

}


export default constants;
