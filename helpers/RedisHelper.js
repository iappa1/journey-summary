import constants from "../constants";
const Redis = require("ioredis")
let redis = null;

export const incrementBlockCount = async (enterprise_id, journey_id, component_id) => {
    const redisKey = `BLOCK_COUNT_enterprise_${enterprise_id}.journey_${journey_id}.component_${component_id}`;
    if (redis == null) {
        redis = new Redis({
            host: constants.redis_host,
            port: constants.redis_port
        });
    }
    await redis.incr(redisKey, function (err, result) {
        if (err) {
            console.log("Error in incrementBlockCount for REDIS KEY: " + redisKey)
        } else {
            console.log("REDIS KEY: " + redisKey + " incremented Successfully for component to " + result);
        }
    });

}

export const getRedisKeys = async (redisKey) => {
    if (redis == null) {
        redis = new Redis({
            host: constants.redis_host,
            port: constants.redis_port
        });
    }
    return await redis.keys(redisKey)
}

export const getBlockCount = async (enterprise_id, journey_id, component_id) => {
    //create redisKey
    const redisKey = `BLOCK_COUNT_enterprise_${enterprise_id}.journey_${journey_id}.component_${component_id}`;
    if (redis == null) {
      redis = new Redis({
        host: constants.redis_host,
        port: constants.redis_port
      });
    }
    const block_count = await redis.get(redisKey, function (err, result) {
  
      if (err) {
        console.log("Error in getBlockIteration for REDIS KEY: "+ redisKey)
      } else {
        if (result == null) {
          return 0
        } else {
          return result
        }
      }
    });
  
    return Number(block_count);
  }

  export const cleanUpKeys = async (rediskey) => {
    if (redis == null) {
      redis = new Redis({
        host: constants.redis_host,
        port: constants.redis_port
      });
    }
    try {
      redis.keys(rediskey).then(keys => {
        const pipeline = redis.pipeline();
        keys.forEach(key => pipeline.del(key));
        return pipeline.exec();
      });

    } catch(error) {
      console.log("Error in cleanUpKeys")
      console.log(error)
    }
    
  }

  // export default getRedisKeys;
