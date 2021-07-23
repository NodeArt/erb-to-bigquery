// import { config } from 'dotenv';
// config();
import fetch from 'node-fetch';
import * as unzipper from 'unzipper';

import { DATA_URL } from './config/download.js';

const downloadFile = async () => {
  const bqConfig = await import('./config/bigquery.js');
  const { getTable, insertData } = await import('./bigquery.js');
  const res = await fetch(DATA_URL);
  const json = await res?.json();
  const url = json?.result?.resources?.[0]?.url;

  if (!url) {
    throw 'Error: no url for download';
  }

  const fileReq = await fetch(url);
  fileReq.body.pipe(unzipper.Parse()).on('entry', function (entry) {
    const table = 'erb';

    if (entry.type !== 'File') {
      throw `Entry type is ${entry.type}, File expected`;
    }
    if (!entry?.path?.includes('erb')) {
      throw `Unknown file name ${entry.path}`;
    }

    const tableConfig = bqConfig[table];
    getTable(tableConfig).then(() => insertData(entry, tableConfig));
  });
};

downloadFile();
