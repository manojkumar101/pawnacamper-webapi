const userServiceObject = require('./user');
const {responseFormater}= require('../../../../utils');
const logger = require('../../../../helpers/logger');
const { messages, statusCode } = require('../../../../constants');

const controller = {

  //add_camp_location
  add_camp_location: async (req, res, next) => {
    try{
      const addLocation = await userServiceObject
        .userService()
        .add_camp_location(req);

      res.status(addLocation.code).send(
        responseFormater(
          addLocation.code,
          addLocation.message,
          addLocation.data
        )
      );
    }catch(error){
      next(error);
    }
  },
  //addSiteImages
  addSiteImages: async (req, res, next) => {
    try{
      const addLocation = await userServiceObject
        .userService()
        .addSiteImages(req);

      res.status(addLocation.code).send(
        responseFormater(
          addLocation.code,
          addLocation.message,
          addLocation.data
        )
      );
    }catch(error){
      next(error);
    }
  },
  //availableSiteLocation
  availableSiteLocation: async (req, res, next) => {
    try{
      const availableLocation = await userServiceObject
        .userService()
        .availableSiteLocation(req);

      res.status(availableLocation.code).send(
        responseFormater(
          availableLocation.code,
          availableLocation.message,
          availableLocation.data
        )
      );
    }catch(error){
      next(error);
    }
  },
  //getSiteImage
  getSiteImage: async (req, res, next) => {
    try{
      const availableLocation = await userServiceObject
        .userService()
        .getSiteImage(req);

      res.status(availableLocation.code).send(
        responseFormater(
          availableLocation.code,
          availableLocation.message,
          availableLocation.data
        )
      );
    }catch(error){
      next(error);
    }
  },
  //removeGallaryImage
  removeGallaryImage: async (req, res, next) => {
    try{
      const addLocation = await userServiceObject
        .userService()
        .removeGallaryImage(req);

      res.status(addLocation.code).send(
        responseFormater(
          addLocation.code,
          addLocation.message,
          addLocation.data
        )
      );
    }catch(error){
      next(error);
    }
  },
  //create_user_booking
  create_user_booking: async (req, res, next) => {
    try{
      const createBooking = await userServiceObject
        .userService()
        .create_user_booking(req);

      res.status(createBooking.code).send(
        responseFormater(
          createBooking.code,
          createBooking.message,
          createBooking.data
        )
      );
    }catch(error){
      // logger.serverLogger(error);
      next(error);
    }
  },
  //getTodayBooking
  getTodayBooking: async (req, res, next) => {
    try{
      const todayBooking = await userServiceObject
        .userService()
        .getTodayBooking(req);

      res.status(todayBooking.code).send(
        responseFormater(
          todayBooking.code,
          todayBooking.message,
          todayBooking.data
        )
      );
    }catch(error){
      next(error);
    }
  },
  //userIsLogging
  userIsLogging: async (req, res, next) => {
    try{
      const loginUser = await userServiceObject
        .userService()
        .userIsLogging(req,res);

      res.status(loginUser.code).send(
        responseFormater(
          loginUser.code,
          loginUser.message,
          loginUser.data
        )
      );
    }catch(error){
      next(error);
    }
  },
  //contactOurTeam
  contactOurTeam: async (req, res, next) => {
    try{
      const contactTeam = await userServiceObject
        .userService()
        .contactOurTeam(req);

      res.status(contactTeam.code).send(
        responseFormater(
          contactTeam.code,
          contactTeam.message,
          contactTeam.data
        )
      );
    }catch(error){
      next(error);
    }
  },
 
};


module.exports = controller;
