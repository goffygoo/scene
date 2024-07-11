import { addOrReplace } from '../service/app/search/actions.js';
import _db from '../util/db.js';
import { httpRequest } from '../util/index.js';
import fs from 'fs';

const __dirname = import.meta.dirname;

const getIds = async (index) => {
    const data = await httpRequest(
        'get',
        'https://baljeetkode.com/api/ms',
        {
            index
        },
    );
    return data.map(doc => doc.id);
}

const getModels = () => {
    const ls = fs.readdirSync(__dirname + '/../model');
    return ls.filter(file => file[0].toUpperCase() === file[0]);
}

const migrateMongo = async () => {
    const models = getModels();
    for (const model of models) {
        const key = model.split('.')[0];
        const data = await httpRequest(
            'get',
            'https://baljeetkode.com/api/model',
            {
                model: key
            },
        )
        const Model = await import(`../model/${key}.js`);
        await Model.default.create(data);
    }
}

const migrateMS = async () => {
    const indexes = ['event_delhi', 'venue_delhi'];
    for (const index of indexes) {
        const ids = await getIds(index);
        for (const id of ids) {
            const data = await httpRequest(
                'get',
                'https://baljeetkode.com/api/msfull',
                {
                    index,
                    id,
                },
            )
            await addOrReplace(data, index);
        }
    }
}

const execute = async (params) => {
    await migrateMongo();
    await migrateMS()
}

export default execute;