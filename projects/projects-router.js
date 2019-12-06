const express = require("express");

const Projects = require("../data/helpers/projectModel.js");

const router = express.Router();

router.get("/", (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error retrieving the projects"
            });
        });
});

router.get("/:id", (req, res) => {
    Projects.get(req.params.id)
        .then(project => {
            if (project) {
                res.status(200).json(project);
            } else {
                res.status(404).send({ message: "Project not found" });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error retrieving the project"
            });
        });
});

router.post("/", (req, res) => {
    if (req.body && req.body.description) {
        Projects.insert(req.body)
            .then(project => {
                res.status(200).json(project);
            })
            .catch(error => {
                console.log(error);
                res.status(500).send({ message: "Error creating the project" });
            });
    } else {
        res.status(400).send({
            message: "Please include a name and description in your request"
        });
    }
});

router.put("/:id", (req, res) => {
    if (req.body || req.body.description) {
        Projects.get(req.params.id)
            .then(project => {
                if (project) {
                    Projects.update(req.params.id, req.body)
                        .then(updated => {
                            res.status(200).json(updated);
                        })
                        .catch(error => {
                            console.log(error);
                            res.status(500).send({
                                message: "Error updating project"
                            });
                        });
                } else {
                    res.status(404).send({ message: "Project not found" });
                }
            })
            .catch(error => {
                console.log(error);
                res.status(500).send({ message: "Error finding project" });
            });
    } else {
        res.status(400).send({
            message: "Please include a name or description in your request"
        });
    }
});

router.delete("/:id", (req, res) => {
    Projects.get(req.params.id)
        .then(project => {
            if (project) {
                Projects.remove(req.params.id)
                    .then(removed => {
                        res.status(200).send({ message: "Project deleted" });
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(500).send({
                            message: "Error removing project"
                        });
                    });
            } else {
                res.status(404).send({ message: "Project not found" });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).send({
                message: "Error finding project to remove"
            });
        });
});

module.exports = router;