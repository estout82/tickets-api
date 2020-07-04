
const validateIdString = (id) => {
    return /[0-9a-zA-Z]{24}/.test(id);
} 

const validateId = async (model, id) => {
    // ensure id strin gis valid
    if (!validateIdString(id)) return false;

    // query model for id
    try {
        let queryResult = await model.findById(id);

        if (!queryResult) return false;

        // all conditions have been checked
        return true;

    } catch (err) {
        return false;
    }
};

module.exports = {
    validateId,
    validateIdString
}