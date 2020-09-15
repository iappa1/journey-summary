import constants from "./constants";
import POSTGRES_POOL from "./helpers/GetPostgresPool"
import getAllEnterpriseRecords from "./helpers/CassandraHelper"
import { incrementBlockCount, getRedisKeys, getBlockCount }  from "./helpers/RedisHelper"

const enterprise = constants.enterprise;

const setRedisKeys = async (enterprise_id) => {
    try {
        // get cassandra records
        const journey_report = await getAllEnterpriseRecords(enterprise_id);
        if (journey_report && journey_report.length > 0) {
            //loop through cassandra records
            for (let item in journey_report) {
                const journey_id = item["journey_id"]
                const component_id = item["component_id"]
                if (enterprise_id && journey_id && component_id) {
                    await incrementBlockCount(enterprise_id, journey_id, component_id)
                } else {
                    console.log("One or more values of the Enterprise Id or Journey Id or Componenet Id is missing")
                }

            }
        } else {
            console.log("No Journey Reports found for Enterprise Id: ", enterprise_id)
        }
    } catch (error) {
        console.log("Error in setRedisKeys");
        console.log(error);
    }
}

const setJourneyComponents = async (enterprise_id) => {
    try {
        // get matching redis keys
        const redisLikeKey = `BLOCK_COUNT_enterprise_${enterprise_id}.*`;
        const redisKeys = getRedisKeys(redisLikeKey)
        //loop over redis keys
        for (const key of redisKeys) {
            if (key.includes("BLOCK_COUNT_enterprise_") && key.includes("journey_") && key.includes("component_")) {
                // parse the key and get enterprise_id, journey_id, component_id 
                const journey_id = key.split(".")[1].split("_")[1]
                const component_id = key.split(".")[2].split("_")[1]

                // getcache and update the same in journeycomponents table.
                console.log("Inserting into journeycomponents for ENTERPRISE: " + enterprise_id + " JOURNEY: " + journey_id + " COMPONENT: " + component_id)
                const block_count = await getBlockCount(enterprise_id, journey_id, component_id);
                const insert_query = `insert into journeycomponents set count = ${block_count}
                                   where enterprise=${enterprise_id}
                                   and journeybuilder=${journey_id}
                                   and component_id=${component_id};`;
                await POSTGRES_POOL.query(insert_query);
                console.log("Insertion successful with count ", block_count);


            } else {
                console.log("Rediskey: " + key + " is not valid")
            }
        }
    } catch (error) {
        console.log("error in setJourneyComponents");
        console.log(error)
    }

}

const processJourneyReports = async (enterprise_id) => {
    try {
        console.log("Start Copy Journey Reports from CASSANDRA to REDIS")

        await setRedisKeys(enterprise_id)

        console.log("************************************************************")
        console.log("Copy Journey Reports from CASSANDRA to REDIS is completed")
        console.log("************************************************************")
        console.log("************************************************************")
        console.log("Starting Insert into Journey Components Table")
        console.log("************************************************************")

        await setJourneyComponents(enterprise_id)


        console.log("Insert into Journey Components Table completed.")
    } catch (error) {
        console.log("error in processJourneyReports");
        console.log(error);
    }

}
processJourneyReports(enterprise)

