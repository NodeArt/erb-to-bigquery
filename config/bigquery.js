export const bigqueryConfig = {
  datasetID: process.env?.BQ_DATASET_ID,
  projectID: process.env?.BQ_PROJECT_ID,
  private_key: decodeURI(process.env?.BQ_PRIVATE_KEY),
  clientId: process.env?.BQ_CLIENT_ID,
  client_email: process.env?.BQ_CLIENT_EMAIL,
};

export const erb = {
  tableID: 'erb_s',
  settlementsSchema: [
    {
      name: 'DEBTOR_NAME',
      type: 'STRING',
      mode: 'NULLABLE',
    },
    {
      name: 'DEBTOR_CODE',
      type: 'STRING',
      mode: 'NULLABLE',
    },
    {
      name: 'PUBLISHER',
      type: 'STRING',
      mode: 'NULLABLE',
    },
    {
      name: 'EMP_FULL_FIO',
      type: 'STRING',
      mode: 'NULLABLE',
    },
    {
      name: 'EMP_ORG',
      type: 'STRING',
      mode: 'NULLABLE',
    },
    {
      name: 'ORG_PHONE',
      type: 'STRING',
      mode: 'NULLABLE',
    },
    {
      name: 'EMAIL_ADDR',
      type: 'STRING',
      mode: 'NULLABLE',
    },
    {
      name: 'VP_ORDERNUM',
      type: 'STRING',
      mode: 'NULLABLE',
    },
    {
      name: 'VD_CAT',
      type: 'STRING',
      mode: 'NULLABLE',
    },
  ],
};
