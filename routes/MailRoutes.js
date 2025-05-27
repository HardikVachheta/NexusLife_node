const express = require('express');
const router = express.Router();
const controller = require('../controllers/MailController');
const protect = require('../middleware/auth');

router.get('/', protect, controller.getAllMails);
router.post('/', protect, controller.createMail);
router.put('/:id', protect, controller.updateMail);
router.delete('/:id', protect,controller.deleteMail);
router.get('/type/:type', protect,controller.getMailsByType);
router.get('/company/:companyId', protect,controller.getMailsByCompany);
router.get('/summary', protect,controller.getMailSummary);

module.exports = router;
