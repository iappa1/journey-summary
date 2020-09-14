import constants from "../constants"
const cassandra = require("cassandra-driver")

let cassandra_client = null

// initialize the cassandra client
const initializeCassandraClient = async () => {
    let conn = {
        contactPoints: constants.cassandra_client_configuration.contact_points.split(","),
        localDataCenter: constants.cassandra_client_configuration.local_data_center,
        keyspace: constants.cassandra_client_configuration.keyspace,
        credentials: {
            username: constants.cassandra_client_configuration.credentials.username,
            password: constants.cassandra_client_configuration.credentials.password
        }
    }

    cassandra_client = new cassandra.Client(conn)
}

// get all journey reports records for a particular enterprise.
export const getAllEnterpriseRecords = async (enterprise_id) => {

    let query = `SELECT * from factoreal.journey_report
        WHERE
        enterprise_id = ${enterprise_id};`

    // if the client is null, then initialize it
    if (cassandra_client == null) {
        await initializeCassandraClient()
    }
    const result = await cassandra_client.execute(query)

    return result.rows
}