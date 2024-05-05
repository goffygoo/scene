import config from "../constants/config.js";
import { MODEL_INDEX } from "../constants/index.js";
import { httpRequest } from "../util/index.js";

const indexUid = MODEL_INDEX.VENUE + '_' + process.env.CITY_KEY;

const { SEARCH_ENGINE, MEILISEARCH_SECRET_KEY } = config;

const axiosConfig = {
  headers: {
    Authorization: `Bearer ${MEILISEARCH_SECRET_KEY}`
  }
};

console.log('Index initiation started');
const initiationData = await httpRequest(
  "post",
  `${SEARCH_ENGINE}/indexes`,
  {
    uid: indexUid,
    primaryKey: "id"
  },
  axiosConfig
);

const { taskUid } = initiationData;

const getTask = async (taskUid, count = 0) => {
  if (count > 5) throw Error('getTask function call limit exceeded');

  const getData = await httpRequest(
    "get",
    `${SEARCH_ENGINE}/tasks/${taskUid}`,
    {},
    axiosConfig
  );

  const { status, error } = getData;

  if (status === 'failed') throw error;
  if (status === 'succeeded') return true;

  if (error) throw {
    message: 'getTask function call failed',
    error,
  };

  setTimeout(() => {
    getTask(taskUid, count + 1);
  }, 1000);
}

await getTask(taskUid);

console.log('Index initiation completed');

await httpRequest(
  "patch",
  `${SEARCH_ENGINE}/indexes/${indexUid}/settings`,
  {
    displayedAttributes: [
      "id",
    ],
    searchableAttributes: [
      "abbreviation",
      "name",
      "keywords",
    ],
    filterableAttributes: [
      "tags",
      "type",
    ],
    sortableAttributes: [],
    rankingRules:
      [
        "words",
        "typo",
        "attribute",
        "exactness",
        "sort",
        "proximity",
      ],
    stopWords: [],
    synonyms: {},
    distinctAttribute: null,
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 4,
        twoTypos: 7
      },
      disableOnWords: [],
      disableOnAttributes: []
    },
    faceting: {
      maxValuesPerFacet: 100
    },
    pagination: {
      maxTotalHits: 1000
    },
    proximityPrecision: "byAttribute",
  },
  axiosConfig
)

console.log('Index updation completed');
