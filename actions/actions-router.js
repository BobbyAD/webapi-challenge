const express = require("express");

const Actions = require("../data/helpers/actionModel.js");

const router = express.Router();

router.get("/", (req, res) => {
    Actions.get()
        .then(actions => {
            res.status(200).json(actions);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error retrieving the actions"
            });
        });
});

router.get("/:id", (req, res) => {
    Actions.get(req.params.id)
        .then(action => {
            if (action) {
                res.status(200).json(action);
            } else {
                res.status(404).send({ message: "Action not found" });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error retrieving the action"
            });
        });
});

router.post("/", (req, res) => {
    if (req.body.project_id && req.body.notes && req.body.description) {
        Actions.insert(req.body)
            .then(action => {
                res.status(200).json(action);
            })
            .catch(error => {
                console.log(error);
                res.status(500).send({ message: "Error creating the action" });
            });
    } else {
        res.status(400).send({
            message: "Please include project_id, notes and description in your request"
        });
    }
});

router.put("/:id", (req, res) => {
    if (req.body.project_id || req.body.notes || req.body.description) {
        Actions.get(req.params.id)
            .then(action => {
                if (action) {
                    Actions.update(req.params.id, req.body)
                        .then(updated => {
                            res.status(200).json(updated);
                        })
                        .catch(error => {
                            console.log(error);
                            res.status(500).send({
                                message: "Error updating action"
                            });
                        });
                } else {
                    res.status(404).send({ message: "Action not found" });
                }
            })
            .catch(error => {
                console.log(error);
                res.status(500).send({ message: "Error finding action" });
            });
    } else {
        res.status(400).send({
            message: "Please include notes or description in your request"
        });
    }
});

router.delete("/:id", (req, res) => {
    Actions.get(req.params.id)
        .then(action => {
            if (action) {
                Actions.remove(req.params.id)
                    .then(removed => {
                        res.status(200).send({ message: "Action deleted" });
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(500).send({
                            message: "Error removing action"
                        });
                    });
            } else {
                res.status(404).send({ message: "Action not found" });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).send({
                message: "Error finding action to remove"
            });
        });
});

module.exports = router;