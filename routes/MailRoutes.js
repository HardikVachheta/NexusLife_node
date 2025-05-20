const express = require('express');
const router = express.Router();
const controller = require('../controllers/MailController');

router.get('/', controller.getAllMails);
router.post('/', controller.createMail);
router.put('/:id', controller.updateMail);
router.delete('/:id', controller.deleteMail);
router.get('/type/:type', controller.getMailsByType);
router.get('/company/:companyId', controller.getMailsByCompany);
router.get('/summary', controller.getMailSummary);


module.exports = router;
