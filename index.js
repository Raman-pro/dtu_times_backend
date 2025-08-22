const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { validatePost, validatePut } = require('./validation/validation.js');

const dbPath = "./db.json";
let db = JSON.parse(fs.readFileSync(dbPath));


const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));

app.get("/editions", (req, res) => {
    let db_copy = { ...db };



    if (req.query.status) {
        const status = req.query.status.toLowerCase();
        console.log(status);
    }

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

        // edition_id,created_at,updated_at
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
    return res.json({ db_copy })

})

app.get("/editions/:id", (req, res) => {
    const id = req.params.id;
    for (let i = 0; i < db["editions"].length; i++) {
        if (db["editions"][i]["_id"] == id) {
            return res.json(db["editions"][i]);
        }
    }
    return res.status(404).json({ message: "Edition not found" });
})

app.post("/editions", (req, res) => {
    const { error, value } = validatePost(req.body);
    console.log(error)
    if (error) {
        console.log(error)
        return res.status(400).json({ error: error.details.map(err => err.message) });
    }
    console.log(value)
    if (value) {
        value["_id"] = uuidv4;
        value["edition_id"] = db["editions"][0]["edition_id"] + 1
        db["editions"].unshift(value);
        if (!value["postedAt"]) {
            value["postedAt"] = new Date();
        }
        value["createdAt"] = new Date();

        value["updatedAt"] = value["created_at"]
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        res.json({ message: "New Edition added", edition: value });
    }
    else {
        res.json({ message: "Add values correctly" });
    }
})

app.put("/editions/:id", (req, res) => {
    const id = req.params.id;
    const { error, value } = validatePut(req.body);
    if (error) {
        console.log(error)
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
})


app.delete("/editions/:id", (req, res) => {
    const id = req.params.id;
    for (let i = 0; i < db["editions"].length; i++) {

        if (db["editions"][i]["_id"] == id) {
            db["editions"].splice(i, 1);
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            return res.json({ message: "Edition deleted successfully" });
        }
    }
    return res.status(404).json({ message: "Edition not found" });
})

app.listen(port, () => [
    console.log("Listening on port", port)
])

