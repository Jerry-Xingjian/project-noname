const { MongoClient } = require('mongodb');
const console = require('console');

// the mongodb server URL
const dbName = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;

const dbURL = `mongodb+srv://${dbName}:${password}@cluster0.uexvt.mongodb.net/Project_Noname?retryWrites=true&w=majority`;

let MongoConnection;

// connection to the db
const connect = async () => {
  // always use try/catch to handle any exception
  try {
    MongoConnection = (await MongoClient.connect(
      dbURL,
      { useNewUrlParser: true, useUnifiedTopology: true },
    )); // we return the entire connection, not just the DB
    // check the we are connected to the database
    console.log('connected to project Noname db');
    return MongoConnection;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getDB = async () => {
  // test if there is an active connection
  if (!MongoConnection) {
    await connect();
  }
  return MongoConnection.db();
};

/**
 * Close the mongodb connection
 */
const closeMongoDBConnection = async () => {
  await MongoConnection.close();
};

module.exports = {
  connect,
  getDB,
  closeMongoDBConnection,
};
