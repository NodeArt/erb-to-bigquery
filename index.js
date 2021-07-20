import { config } from 'dotenv';
config();
import fetch from 'node-fetch';
import { Parse } from 'unzipper';

import { DATA_URL } from './config/download.js';

const downloadFile = async () => {
  const bqConfig = await import('./config/bigquery.js');
  const { getTable, insertData } = await import('./bigquery.js');
  const res = await fetch(DATA_URL);
  const json = await res.json();
  const url = json.result.resources[0].url;

  const fileReq = await fetch(url);
  fileReq.body.pipe(Parse()).on('entry', function (entry) {
    const table = 'erb';

    console.log('got file ', entry.path);
    console.log('entry.type ', entry.type);

    if (entry.type !== 'File') {
      console.log(`Entry type is ${entry.type}, stop`);
      return;
    }
    if (!entry?.path?.includes('erb')) {
      console.log(`Unknown file name ${entry.path}, stop`);
      return;
    }

    const tableConfig = bqConfig[table];
    getTable(tableConfig).then(() => insertData(entry, tableConfig));
  });
};

downloadFile();
