const { BigQuery } = require('@google-cloud/bigquery');
const csv = require('csv-parser');
const through2 = require('through2');
const iconv = require('iconv-lite');

const { bigqueryConfig, erb } = require('./config/bigquery.js');

// Check all env variables in bigquery config
if (Object.values(bigqueryConfig).includes(undefined)) {
  console.log(bigqueryConfig);
  console.error('no connection settings in env');
  process.exit(100);
}

// Connect to Google BigQuery
const db = new BigQuery({
  projectId: bigqueryConfig.projectID,
  credentials: {
    client_email: bigqueryConfig.client_email,
    private_key: bigqueryConfig.private_key,
  },
  clientOptions: {
    clientId: bigqueryConfig.clientId,
  },
});
// Create table with name in tableID
const createTable = (tableConfig) => {
  const options = {
    schema: tableConfig.settlementsSchema,
  };

  console.log('Creating table ', tableConfig.tableID);

  return db
    .dataset(bigqueryConfig.datasetID)
    .createTable(tableConfig.tableID, options);
};

// Drop table and call createTable
module.exports.getTable = async (tableConfig) => {
  const exists = await db
    .dataset(bigqueryConfig.datasetID)
    .table(tableConfig.tableID)
    .exists();

  if (exists[0]) {
    console.log('Drop table');
    await db
      .dataset(bigqueryConfig.datasetID)
      .table(tableConfig.tableID)
      .delete();
  }

  return createTable(tableConfig);
};

module.exports.insertData = (fileStream, tableConfig) => {
  let count = 1;
  // Creating BigQuery writting stream
  const bqStream = db
    .dataset(bigqueryConfig.datasetID)
    .table(tableConfig.tableID)
    .createWriteStream({
      sourceFormat: 'NEWLINE_DELIMITED_JSON',
    });

  bqStream.on('error', function (e) {
    console.log(e);
    process.exit(1);
  });

  const propertiesArray = [];
  erb.settlementsSchema.forEach((obj) => propertiesArray.push(obj.name));
  const iconvStream = fileStream.pipe(iconv.decodeStream('win1251'));
  const csvStream = iconvStream.pipe(csv());
  const checkedStream = csvStream.pipe(
    through2.obj(async function (chunk, enc, callback) {
      const queryObj = {};
      const chunkProps = Object.keys(chunk);
      propertiesArray.forEach((prop, index) => {
        queryObj[prop] = chunk?.[chunkProps?.[index]] ?? '';
      });
      const toSend = JSON.stringify(queryObj) + '\n';
      if (count % 10000 === 0) {
        console.log(count);
      }
      count++;
      this.push(toSend);
      callback();
    })
  );
  const streamToBigQuery = checkedStream.pipe(bqStream);
  bqStream.once('complete', () => {
    console.log('bq end');
    process.exit(0);
  });
};
