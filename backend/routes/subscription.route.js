const router = require('express').Router();
const SubscriptionCtrl = require('../controllers/subscription.controller');

router.route('/create-subscription').post(SubscriptionCtrl.createSubscription);
router.route('/get-subscription').get(SubscriptionCtrl.getAllSubscription);
router.route('/fineone-subscription/:id').get(SubscriptionCtrl.findOneSubscription);
router.route('/update-subscription/:id').put(SubscriptionCtrl.updateSubscription);
router.route('/delete-subscription/:id').delete(SubscriptionCtrl.deleteSubscription);

module.exports = router;