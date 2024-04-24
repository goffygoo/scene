import Venue from "../service/search/model/Venue.js";

await Venue.createOrReplaceOne({
    "id": '7eefecdf1e234163a3506cb91c211f0e',
    "shortName": 'DTU',
    "name": 'Delhi Technological University',
    "type": 'College',
    "keywords": ['dce', 'bawana', 'rohini', 'dit'],
    "tags": ['engineering'],
}, 'delhi');


await Venue.createOrReplaceOne({
    "id": '5ceb6fb5a5ec4e1a85b051a65e6a2c54',
    "shortName": 'NSUT',
    "name": 'Netaji Subhas University of Technology',
    "type": 'College',
    "keywords": ['nsit', 'dwarka'],
    "tags": ['engineering'],
}, 'delhi');



await Venue.createOrReplaceOne({
    "id": '47142a46acca4406a735bc0cef1fa984',
    "shortName": 'IGDTUW',
    "name": 'Indira Gandhi Delhi Technical University for Women',
    "type": 'College',
    "keywords": ['IGDTU', 'Kashmere Gate', 'Girls College'],
    "tags": ['engineering'],
}, 'delhi');


await Venue.createOrReplaceOne({
    "id": 'f8638a6bd64442df9f5c0d0481d4b390',
    "shortName": 'IIIT-D',
    "name": 'Indraprastha Institute of Information Technology Delhi',
    "type": 'College',
    "keywords": ['IIIT-Delhi'],
    "tags": ['engineering'],
}, 'delhi');


await Venue.createOrReplaceOne({
    "id": '901f738e5c99484bbadf0055c81639e4',
    "shortName": 'IIT-D',
    "name": 'Indian Institute of Technology Delhi',
    "type": 'College',
    "keywords": ['Hauz Khas'],
    "tags": ['engineering'],
}, 'delhi');


await Venue.createOrReplaceOne({
    "id": '60b00e9b2c6841f7816fa923f41bdd00',
    "shortName": 'AIIMS',
    "name": 'All India Institute of Medical Sciences',
    "type": 'College',
    "keywords": [],
    "tags": ['medical'],
}, 'delhi');


await Venue.createOrReplaceOne({
    "id": '68d473dd27cc42c38a25e2eb0b20fbc1',
    "shortName": 'VMMC',
    "name": 'Vardhaman Mahavir Medical College',
    "type": 'College',
    "keywords": ['Safdurjung Hospital', 'IPU', 'GGSIPU'],
    "tags": ['medical'],
}, 'delhi');

