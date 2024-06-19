import _db from '../util/db.js';
import Event from '../model/Event.js';
import EventMS from '../service/app/search/model/Event.js';
import { splitChunks } from '../util/index.js';

const execute = async (params) => {
    const { date } = params;
    const rangeEnd = date ? (new Date(date)) : new Date();
    const rangeStart = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate() - 1);
   
    const events = await Event.findAndPopulate({
        endTime: {
            $gte: rangeStart.getTime(),
            $lte: rangeEnd.getTime()
        }
    }, "venueId");

    const eventChunks = splitChunks(events, 10);

    for (const chunks of eventChunks) {
        await Promise.all(
            chunks.map(event => {
                return EventMS.deleteById(event._id, event.venueId.city)
            })
        )
    }
}

export default execute;