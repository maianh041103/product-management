const uploadImagesToClound = require('../../helpers/uploadImagesToClound');

module.exports.uploadClound = async (req, res, next) => {
    if (req.file) {
        const link = await uploadImagesToClound(req.file.buffer);
        req.body[req.file.fieldname] = link;
    }
    next();
}