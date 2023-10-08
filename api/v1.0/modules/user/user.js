const con = require('../../../../helpers');
const util = require('util');
const query = util.promisify(con.query).bind(con);
const functions = require('../../../../helpers');
// const config = require('../../../../config');
// const validator = require('validator');
const { messages, statusCode } = require('../../../../constants');

class UserService {
  /**
   * @description - Function to add_camp_location
   * @param {*} info - request body data
   */
  async add_camp_location(req) {
    try {
      let reqBody = req.body;
      let LocationId = Number(reqBody.LocationId)
        ? Number(reqBody.LocationId)
        : null;
      let LocationName = reqBody.LocationName;
      let LocationImage = reqBody.LocationImage;
      let Price = reqBody.Price;
      let Description = reqBody.Description;
      let GoogleMapUrl = reqBody.GoogleMapUrl;
      let DiscountPercentage = reqBody.DiscountPercentage;

      const createQuery = 'call manage_site_locate(?,?,?,?,?,?,?)';
      await query(createQuery, [
        LocationId,
        LocationName,
        LocationImage,
        Price,
        Description,
        GoogleMapUrl,
        DiscountPercentage,
      ]);

      return {
        code: statusCode.success,
        message: messages.success,
        data: [],
      };
    } catch (error) {
      throw {
        code: statusCode.internal_server_error,
        message: error.message,
        data: {},
      };
    }
  }
  /**
   * @description - Function to addSiteImages
   * @param {*} info - request body data
   */
  async addSiteImages(req) {
    try {
      let reqBody = req.body;
      let GallaryId = Number(reqBody.GallaryId)
        ? Number(reqBody.GallaryId)
        : null;
      let LocationId = Number(reqBody.LocationId)
        ? Number(reqBody.LocationId)
        : null;
      let LocationName = reqBody.LocationName
        ? reqBody.LocationName
        : null;
      let LocationImage =reqBody.LocationImage
        ? reqBody.LocationImage
        : null;
      let DeleteImage = null
      const manageQuery = 'call manage_gallary(?,?,?,?,?)';
      await query(manageQuery, [
        GallaryId,
        LocationId,
        LocationName,
        LocationImage,
        DeleteImage
      ]);

      return {
        code: statusCode.success,
        message: messages.success,
        data: [],
      };
    } catch (error) {
      throw {
        code: statusCode.internal_server_error,
        message: error.message,
        data: {},
      };
    }
  }
  /**
   * @description - Function to availableSiteLocation
   * @param {*} info - request body data
   */
  async availableSiteLocation() {
    try {
      const getQuery = `
                            SELECT 
                                    id as Id,
                                    location_name as LocationName,
                                    location_pic_url as LocationImage,
                                    camp_provider as CampProvider,
                                    camp_provider_pic as CampProviderPic,
                                    location_price as Price,
                                    location_description as Description,
                                    google_map_url as GoogleMapUrl,
                                    discount_price as DiscountPercentage
                            FROM tbl_camp_location;
                        `;
     let siteLocationArray= await query(getQuery);

      return {
        code: statusCode.success,
        message: messages.success,
        data: siteLocationArray,
      };
    } catch (error) {
      throw {
        code: statusCode.internal_server_error,
        message: error.message,
        data: {},
      };
    }
  }
  /**
   * @description - Function to getSiteImage
   * @param {*} info - request body data
   */
  async getSiteImage() {
    try {
      const getQuery = `
                        SELECT 
                            id as Id,
                            site_id as LocationId,
                            name as Name,
                            image_url as ImageUrl
                        FROM tbl_image;
                        `;
     let siteLocationArray= await query(getQuery);

      return {
        code: statusCode.success,
        message: messages.success,
        data: siteLocationArray,
      };
    } catch (error) {
      throw {
        code: statusCode.internal_server_error,
        message: error.message,
        data: {},
      };
    }
  }
  /**
   * @description - Function to removeGallaryImage
   * @param {*} info - request body data
   */
  async removeGallaryImage(req) {
    try {
          let reqBody = req.body;
          let GallaryId = Number(reqBody.GallaryId)
            ? Number(reqBody.GallaryId)
            : null;
          let LocationId = null;
          let LocationName = null;
          let LocationImage = null;
          let DeleteImage = 1
          const manageQuery = 'call manage_gallary(?,?,?,?,?)';
          await query(manageQuery, [
            GallaryId,
            LocationId,
            LocationName,
            LocationImage,
            DeleteImage
          ]);

          return {
            code: statusCode.success,
            message: messages.success,
            data: [],
          };
    } catch (error) {
      throw {
        code: statusCode.internal_server_error,
        message: error.message,
        data: {},
      };
    }
  }

  /**
   * @description - Function to create_user_booking
   * @param {*} info - request body data
   */
  async create_user_booking(req) {
    try {
      let reqBody = req.body;
      let FirstName = reqBody.FirstName;
      let LastName = reqBody.LastName;
      let EmailAddress = reqBody.EmailAddress;
      let PhoneNumber = reqBody.PhoneNumber;
      let Address = reqBody.Address;
      let PicUrl = reqBody.PicUrl;
      let CampLocationId = reqBody.CampLocationId;
      let AdultCount = reqBody.AdultCount;
      let ChildrenCount = reqBody.ChildrenCount;
      let StartDate = reqBody.StartDate;
      let EndDate = reqBody.EndDate;
      let SpecialNote = reqBody.SpecialNote;
      let TentPerfer = reqBody.TentPerfer;

      const createQuery = 'call create_new_booking(?,?,?,?,?,?,?,?,?,?,?,?,?)';
      const userDbResp = await query(createQuery, [
        FirstName,
        LastName,
        EmailAddress,
        PhoneNumber,
        Address,
        PicUrl,
        CampLocationId,
        AdultCount,
        ChildrenCount,
        StartDate,
        EndDate,
        SpecialNote,
        TentPerfer,
      ]);
      let finalJson = userDbResp[0][0];
      return {
        code: statusCode.success,
        message: messages.success,
        data: finalJson,
      };
    } catch (error) {
      throw {
        code: statusCode.internal_server_error,
        message: error.message,
        data: {},
      };
    }
  }

  /**
   * @description - Function to getTodayBooking
   * @param {*} info - request body data
   */
   async getTodayBooking(req) {
    try {
      let SearchDate= req.query.SearchDate ? req.query.SearchDate : null;
      const getQuery = `
                        SELECT	A.id as UserId,
                            A.first_name as FirstName,
                            A.last_name as LastName,
                            A.email_id as EmailId,
                            A.phone_number as PhoneNumber,
                            B.status as BookingStatus,
                            B.adult_count as AdultCount,
                            B.children_count as ChildrenCount,
                                DATEDIFF(Date(B.end_date),Date( B.start_date))+1 AS TotalDays,
                            B.start_date as StartDate,
                            B.end_date as EndDate,
                            B.special_note as SpecialNote,
                            B.tent_preference as TentPreference,
                                C.location_name as LocationName,
                                C.location_price as LocationPrice,
                                C.discount_price as DiscountPercentage
                        From
                            tbl_user A 
                                inner join  tbl_booking B
                                      on B.user_id=A.id
                                inner join tbl_camp_location C
                                          on C.id=B.camp_location_id
                        Where	Date( B.start_date)=Date(?)
                        `;
     let totalbooking= await query(getQuery,[SearchDate]);

      return {
        code: statusCode.success,
        message: messages.success,
        data: totalbooking,
      };
    } catch (error) {
      throw {
        code: statusCode.internal_server_error,
        message: error.message,
        data: {},
      };
    }
  }


  /**
   * @description - Function to userIsLogging
   * @param {*} info - request body data
   */
  async userIsLogging(req,res) {
    try {
     let  {EmailAddress ,UserPassword} = req.body;
      const getQuery = `
                        SELECT	*
                        From
                            tbl_user
                        Where	email_id= ?
                        `;
     let UserDetails= await query(getQuery,[EmailAddress]);

     if(!UserDetails.length){
      return {
        code: statusCode.unauthorized,
        message: messages.unAuthorized,
        data: [],
      };
     }
     let loggedInUser=UserDetails[0];
     delete loggedInUser.password
     delete loggedInUser.is_deleted

     let Token=await functions.tokenEncrypt(loggedInUser);


      return {
        code: statusCode.success,
        message: messages.success,
        data: {
          UserDetails:loggedInUser,
          EAuthToken:Token
        },
      };
    } catch (error) {
      throw {
        code: statusCode.internal_server_error,
        message: error.message,
        data: {},
      };
    }
  }


  /**
   * @description - Function to contactOurTeam
   * @param {*} info - request body data
   */
   async contactOurTeam(req) {
    try {
      
      return {
        code: statusCode.success,
        message: messages.success,
        data: [],
      };
    } catch (error) {
      throw {
        code: statusCode.internal_server_error,
        message: error.message,
        data: {},
      };
    }
  }
}
module.exports = {
  userService: function () {
    return new UserService();
  },
};
