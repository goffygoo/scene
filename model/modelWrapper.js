const find = (Model) => async (data, session) => {
    const promise = session ?
        Model.find(data).session(session) :
        Model.find(data);
    const result = await promise;
    return result;
}

const findAndPopulate = (Model) => async (data, field, session) => {
    const promise = session ?
        Model.find(data).populate(field).session(session) :
        Model.find(data).populate(field);
    const result = await promise;
    return result;
}

const findAndSelect = (Model) => async (data, select, session) => {
    const promise = session ?
        Model.find(data).select(select).session(session) :
        Model.find(data).select(select);
    const result = await promise;
    return result;
}

const findOne = (Model) => async (data, session) => {
    const promise = session ?
        Model.findOne(data).session(session) :
        Model.findOne(data);
    const result = await promise;
    return result;
}

const findOneAndSelect = (Model) => async (data, select, session) => {
    const promise = session ?
        Model.findOne(data).select(select).session(session) :
        Model.findOne(data).select(select);
    const result = await promise;
    return result;
}

const findOneAndUpdate = (Model) => async (data, updateData, session) => {
    const promise = session ?
        Model.findOneAndUpdate(data, updateData, { new: true }).session(session) :
        Model.findOneAndUpdate(data, updateData, { new: true });
    const result = await promise;
    return result;
}

const create = (Model) => async (data, session) => {
    const promise = session ?
        Model.create(data, { session }) :
        Model.create(data);
    const result = await promise;
    return result;
}

const findById = (Model) => async (id, session) => {
    const promise = session ?
        Model.findById(id).session(session) :
        Model.findById(id);
    const result = await promise;
    return result;
}

const findByIdAndSelect = (Model) => async (id, select, session) => {
    const promise = session ?
        Model.findById(id).select(select).session(session) :
        Model.findById(id).select(select);
    const result = await promise;
    return result;
}


const findByIdAndUpdate = (Model) => async (id, data, session) => {
    const promise = session ?
        Model.findByIdAndUpdate(id, data, { new: true }).session(session) :
        Model.findByIdAndUpdate(id, data, { new: true });
    const result = await promise;
    return result;
}

const deleteOne = (Model) => async (data, session) => {
    const promise = session ?
        Model.deleteOne(data).session(session) :
        Model.deleteOne(data);
    const result = await promise;
    return result;
}

const Wrapper = (Model) => {
    return {
        find: find(Model),
        findAndPopulate: findAndPopulate(Model),
        findAndSelect: findAndSelect(Model),
        findOne: findOne(Model),
        findOneAndSelect: findOneAndSelect(Model),
        findOneAndUpdate: findOneAndUpdate(Model),
        create: create(Model),
        findById: findById(Model),
        findByIdAndSelect: findByIdAndSelect(Model),
        findByIdAndUpdate: findByIdAndUpdate(Model),
        deleteOne: deleteOne(Model),
    }
}

export default Wrapper;