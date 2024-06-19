import fs from 'fs';

const __dirname = import.meta.dirname;
const Queries = {};

export const buildQueries = async () => {
    const ls = fs.readdirSync(__dirname);
    const files = ls.filter(name => name !== 'index.js')
    for (const file of files) {
        const module = await import('./' + file);
        Queries[file] = module.default;
    }
}

export const getQueries = () => {
    return Queries;
}