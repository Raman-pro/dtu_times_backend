const fs = require('fs');
const uuid = require('uuid');
const { validatePost, validatePut } = require('../validation/validation.js');
const e = require('express');


const dbPath = "./db.json";
let db = JSON.parse(fs.readFileSync(dbPath));



exports.getAllEditions = (req, res) => {
    let db_copy = { ...db };

    if (req.query.search) {
        const search = req.query.search
        db_copy["editions"] = db_copy["editions"].filter((edition) => {
            if (edition["name"].toLowerCase().includes(search) || edition["createdAt"].includes(search) || edition["updatedAt"].includes(search)) {
                return edition
            }


        })
    }


    if (req.query.sortBy) {
        const sortBy = req.query.sortBy.toLowerCase();
        const order = req.query.order ? req.query.order : "d"

        function sortingOrder(a, b) {
            if (order === "a") {
                return a - b;
            } else {
                return b - a;
            }
        }

        if (sortBy === "editionid") {
            db_copy["editions"].sort((a, b) => sortingOrder(a["edition_id"], b["edition_id"]));
        }
        else if (sortBy === "createdat") {
            db_copy["editions"].sort((a, b) => sortingOrder(new Date(a["createdAt"]), new Date(b["createdAt"])));
        }
        else if (sortBy === "updatedat") {
            db_copy["editions"].sort((a, b) => sortingOrder(new Date(a["createdAt"]), new Date(b["createdAt"])));
        }
        else {
            return res.json({ message: "Invalid sortBy parameter" })
        }
    }

    console.log(req.query.pageNo)

    if (req.query.pageNo) {
        let pageNo = req.query.pageNo
        let numOfRec = parseInt(req.query.records) || 5
        let start = numOfRec * (pageNo - 1)
        let end = db_copy["editions"][numOfRec * (pageNo - 1) + numOfRec] ? (numOfRec * (pageNo - 1) + numOfRec) : db_copy["editions"].length
        db_copy["editions"] = db_copy["editions"].slice(start, end)
    }

    if (db_copy["editions"].length === 0) {
        res.status(404).json({ message: "No editions found" })
    }

    return res.status(200).json({ db_copy })
};

exports.getEditionById = (req, res) => {
    const id = req.params.id;

    for (let i = 0; i < db["editions"].length; i++) {
        if (db["editions"][i]["_id"] == id) {
            return res.json(db["editions"][i]);
        }
    }

    return res.status(404).json({ message: "Edition not found" });
};

exports.createEdition = (req, res) => {
    const { error, value } = validatePost(req.body);
    if (error) {
        return res.status(400).json({ error: error.details.map(err => err.message) });
    }
    if (value) {
        value["_id"] = uuid.v4();
        value["edition_id"] = db["editions"][0]["edition_id"] + 1
        if (!value["published_at"]) {

            value["published_at"] = new Date();
        }
        value["createdAt"] = new Date();

        value["updatedAt"] = new Date();
        db["editions"].unshift(value);
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        res.json({ message: "New Edition added", edition: value });
    }
    else {
        res.status(400).json({ message: "Add values correctly" });
    }
};

exports.updateEdition = (req, res) => {
    const id = req.params.id;
    const { error, value } = validatePut(req.body);
    if (error) {
        return res.status(400).json({ error: error.details.map(err => err.message) });
    }
    value._id = id;
    for (let i = 0; i < db["editions"].length; i++) {

        if (db["editions"][i]["_id"] == id) {
            let valueKeys = Object.keys(value)
            for (let i = 0; i < valueKeys.length; i++) {
                db["editions"][i][valueKeys[i]] = value[valueKeys[i]]
            }
            db["editions"][i]["updatedAt"] = new Date();
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            return res.json({ message: "Edition updated successfully", edition: db["editions"][i] });
        }
    }
    res.status(404).json({ message: "id not found" });
};

exports.deleteEdition = (req, res) => {
    const id = req.params.id;
    for (let i = 0; i < db["editions"].length; i++) {

        if (db["editions"][i]["_id"] == id) {
            db["editions"].splice(i, 1);
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            return res.json({ message: "Edition deleted successfully" });
        }
    }
    return res.status(404).json({ message: "Edition not found" });
};
