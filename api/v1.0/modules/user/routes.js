const router = require('express').Router();
const api = require('./controller');
const authentication = require('../../../../middlewares');


// ADD SITE LOCATION IMAGE
router.post('/add-camp-location',  api.add_camp_location);
router.get('/available-site-location',api.availableSiteLocation)

router.post('/add-site-pic',  api.addSiteImages);
router.get('/get-site-images',  api.getSiteImage);
router.delete('/delete-site-pic',api.removeGallaryImage)
// CREATE NEW BOOKING

router.post('/generate-booking',  api.create_user_booking);
router.get('/get-booking',api.getTodayBooking)





// CONTACT OUR TEAM 

router.post('/contact-our-team',api.contactOurTeam)
// router.post('/create-node',authentication.validateToken, api.submitNode);
module.exports = router;