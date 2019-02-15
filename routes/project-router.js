const express = require("express");

const db = require("../data/helpers/projectModel");

const router = express.Router();

function allCAPS(req, res, next) {
  const { name } = req.body;
  req.body.name = name.toUpperCase();
  next();
}

router.post("/", allCAPS, (req, res) => {
  const { name, description, completed } = req.body;
  if (!name || !description) {
    res.status(400).json({
      errorMessage: "Project must have a name and description."
    });
    return;
  }
  db.insert({
    name,
    description,
    completed
  })
    .then(response => {
      res.status(201).json(response);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the Project to the database"
      });
      return;
    });
});

router.get("/", (req, res) => {
  db.get()
    .then(Projects => {
      res.json({ Projects });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "Project list could not be retrieved."
      });
      return;
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.get(id)
    .then(Project => {
      if (Project.length === 0) {
        res.status(404).json({
          message: "That Project does not exist."
        });
        return;
      }
      res.json({ Project });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "Project could not be retrived"
      });
      return;
    });
});

router.get("/:id/actions", (req, res) => {
  const { id } = req.params;
  db.getProjectActions(id)
    .then(Project => {
      if (Project.length === 0) {
        res.status(404).json({
          message: "That Project does not exist."
        });
        return;
      }
      res.json({ Project });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "Project Actions could not be retrived"
      });
      return;
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(response => {
      if (response === 0) {
        res.status(404).json({
          message: "The Project with the specified ID does not exist."
        });
        return;
      }
      res.json({ success: `Project ${id} removed.` });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The Project could not be removed"
      });
      return;
    });
});

router.put("/:id", allCAPS, (req, res) => {
  const { id } = req.params;
  const { name, description, completed } = req.body;
  if (!name || !description) {
    res.status(400).json({
      errorMessage: "Project must have a name and description."
    });
    return;
  }
  db.update(id, { name, description, completed })
    .then(response => {
      if (response == 0) {
        res.status(404).json({
          message: "The Project with the specified ID does not exist."
        });
        return;
      }
      db.get(id)
        .then(Project => {
          if (Project.length === 0) {
            res.status(404).json({
              errorMessage: "The name with the specified ID does not exist."
            });
            return;
          }
          res.json(Project);
        })
        .catch(error => {
          console.log(error);
          res
            .status(500)
            .jason({ error: "The Project information could not be modified." });
        });
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The Project information could not be modified." });
      return;
    });
});

module.exports = router;
