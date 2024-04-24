import Event from "../service/search/model/Event.js";
import { generateRefreshToken } from '../util/index.js';

const day = 1000 * 60 * 60 * 24;

await Event.createOrReplaceOne({
    "id": generateRefreshToken(),
    "venueId": '7eefecdf1e234163a3506cb91c211f0e',
    "name": 'EngiFest',
    "time": 1713810600000,
    "boost": 3,
    "keywords": ['Sidhu moosewala', 'Divine', 'Anubhav Singh Bassi'],
    "tags": ['culturalfest'],
}, 'delhi');


await Event.createOrReplaceOne({
    "id": generateRefreshToken(),
    "venueId": '7eefecdf1e234163a3506cb91c211f0e',
    "name": 'Yuvaan',
    "time": 1713810600000 + 5*day,
    "boost": 1,
    "keywords": ['Kumar Vishwas', 'Rahat Indori', 'Gulzaar'],
    "tags": ['literaturefest'],
}, 'delhi');


await Event.createOrReplaceOne({
    "id": generateRefreshToken(),
    "venueId": '5ceb6fb5a5ec4e1a85b051a65e6a2c54',
    "name": 'Moksha',
    "time": 1713810600000 + 1*day,
    "boost": 2,
    "keywords": ['Papon', 'Vishal Dadlani', 'Divine'],
    "tags": ['culturalfest'],
}, 'delhi');



await Event.createOrReplaceOne({
    "id": generateRefreshToken(),
    "venueId": '901f738e5c99484bbadf0055c81639e4',
    "name": 'Rendezvous',
    "time": 1713810600000 + 1*day,
    "boost": 1,
    "keywords": ['Arijit Singh', 'Indian Ocean'],
    "tags": ['culturalfest'],
}, 'delhi');



await Event.createOrReplaceOne({
    "id": generateRefreshToken(),
    "venueId": '47142a46acca4406a735bc0cef1fa984',
    "name": 'Taarangana',
    "time": 1713810600000 + 2*day,
    "boost": 1,
    "keywords": ['KK', 'Javed Ali'],
    "tags": ['culturalfest'],
}, 'delhi');


await Event.createOrReplaceOne({
    "id": generateRefreshToken(),
    "venueId": 'f8638a6bd64442df9f5c0d0481d4b390',
    "name": 'Odyssey',
    "time": 1713810600000 + 3*day,
    "boost": 1,
    "keywords": ['Indira Gandhi', 'Delhiites'],
    "tags": ['techfest'],
}, 'delhi');


await Event.createOrReplaceOne({
    "id": generateRefreshToken(),
    "venueId": '60b00e9b2c6841f7816fa923f41bdd00',
    "name": 'Pulse',
    "time": 1713810600000 + 2*day,
    "boost": 2,
    "keywords": ['Vishal Shekhar', 'Honey Singh'],
    "tags": ['culturalfest'],
}, 'delhi');


await Event.createOrReplaceOne({
    "id": generateRefreshToken(),
    "venueId": '68d473dd27cc42c38a25e2eb0b20fbc1',
    "name": 'Nirvana',
    "time": 1713810600000 + 2*day,
    "boost": 1,
    "keywords": ['Zakir Khan', 'Local Train'],
    "tags": ['culturalfest'],
}, 'delhi');