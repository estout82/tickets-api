
// read all docs from collection
const _handleReadAll = async (req, res) => {
    let data = {};

    // only return some fields if shortRead field is set
    if (this._shortReadFields) {
        try {
            data = await this._model.find()
                .select(this.shortReadFields)
                .exec();

            return res.status(200).json({
                status: 'ok',
                data: data
            });
        } catch (err) {
            return this._handleQueryError(req, res, err);
        }
    }
}

// read a single doc
const _handleRead = async (req, res) => {
    const id = req.params.id; // this is already a valid oid b/c regex in router

    try {
        let query = this._model.findById(id);
        
        // populate fields
        if (this._longReadPopulateFields) {
            query.populate(this._longReadPopulateFields);
        }

        let data = await query.exec();

        return res.status(200).json({
            status: 'ok',
            data: data
        });
    } catch (err) {
        return this._handleQueryError(req, res, err);
    }
}

// create a new doc
const _handleCreate = async (req, res, pre, post) => {
    if (pre && !pre(req, res)) {
        return;
    }

    // ensure body is not empty
    if (!req.body) {
        return this._handleEmptyRequest(req, res);
    }

    let doc = new this._model(req.body);

    // validate doc
    try {
        let validateError = await doc.validate();
    } catch (err) {
        return this._handleValidateError(req, res, err);
    }

    // preform query
    try {
        let saveResult = await doc.save();

        return res.status(201).json({
            status: 'ok',
            msg: 'created',
            data: [ saveResult._id ]
        });
    } catch (err) {
        return this._handleSaveError(req, res, err);
    }
}

// update existing doc
const _handleUpdate = async (req, res) => {
    const id = req.params.id;
    let doc = null;

    // ensure request body is not null
    if (!req.body) {
        return this._handleEmptyRequest(req, res);
    }

    // get doc from db
    try {
        doc = await this._model.findById(id);

        if (!doc) {
            return res.status(401).json({
                status: 'err',
                message: `${id} not in collection`
            });
        }
    } catch (err) {
        return this._handleQueryError(req, res, err);
    }

    // update doc fields
    Object.keys(req.body).forEach((key) => {
        const value = req.body[key];
        doc[key] = value;
    });

    // validate new fields
    try {
        let validateResult = await doc.validate();
    } catch (err) {
        return this._handleValidateError(req, res, err);
    }

    // save updated doc
    try {
        let queryResult = await doc.save();

        res.status(200).json({
            status: 'ok',
            msg: 'updated',
            data: [queryResult._id]
        });
    } catch (err) {
        return this._handleQueryError(req, res, err);
    }
}