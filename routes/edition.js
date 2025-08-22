const express = require('express');
const router = express.Router();
const editionsController = require('../controllers/editionController.js');

router.get('/', editionsController.getAllEditions);

router.get('/:id', editionsController.getEditionById);

router.post('/', editionsController.createEdition);

router.put('/:id', editionsController.updateEdition);

router.delete('/:id', editionsController.deleteEdition);

module.exports = router;
