const express = require('express');
const router = express.Router();
const controller = require('../controllers/sentMailController');

router.get('/', controller.getAllSentMails);
router.post('/', controller.createSentMail);
router.put('/:id', controller.updateSentMail);
router.delete('/:id', controller.deleteSentMail);

module.exports = router;
