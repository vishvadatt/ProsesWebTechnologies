const db = require("../index");
const subscriptionColl = db.collection("subscription");
const APIError = require("../helpers/APIError");
const resPattern = require("../helpers/resPattern");
const httpStatus = require("http-status");
const query = require('../query/query');
const {ObjectId} = require('mongodb');
const moment = require('moment');
const Joi = require('joi');

const createSubscription = async (req,res,next) => {
    try {   
        const requestData = req.body;
        

        // const schema = Joi.object({
        //     userName : Joi.string().required().allow(),
        //     subscriptionName : Joi.string().required(),
        //     purchaseDate : Joi.string().required(),
        //     startTime : Joi.string().required(),
        //     endTime : Joi.string().required(),
        // });

        // const result = schema.validateAsync(requestData)
        // const {error,value} = result;
        // console.log("error.",error);
        // if(error){
        //     return res.status(httpStatus.BAD_REQUEST).json({message : error.details[0]?.message})
        // }
       

        requestData.purchaseDate = moment(requestData.purchaseDate).format('DD/MM/YYYY');
        
        const checkSubscription = await query.find(subscriptionColl,{purchaseDate : requestData.purchaseDate},{limit : 1},{ _id : -1});
        
        const findOneUser = await query.findOne(subscriptionColl,{subscriptionName : requestData.subscriptionName})
        if(findOneUser){
            return res.status(httpStatus.BAD_REQUEST).json({message : "You have already Purchase this Subscription"})
        }

        if(requestData.startTime >= requestData.endTime ){
            return res.status(httpStatus.BAD_REQUEST).json({message : "Start time should be smaller than end Time"})
        }

        let insertdata;
        
        if(checkSubscription[0]){
           if(requestData.endTime > checkSubscription[0].endTime){
                insertdata = await query.insert(subscriptionColl,requestData);
           }else{
            const message = `Already you have purchase same time of subscription ${checkSubscription[0].startTime} to ${checkSubscription[0].endTime} between. please enter uper time of ${checkSubscription[0].endTime}`;
            // return next(new APIError(`${message}`, httpStatus.BAD_REQUEST, true));
            return res.status(httpStatus.BAD_REQUEST).json({message : message})

           }
        }else{
            console.log("create new date of sub");
            insertdata = await query.insert(subscriptionColl,requestData);
        }
        
        if (insertdata?.ops?.length > 0) {
            const obj = resPattern.successPattern(
            httpStatus.OK,
            insertdata.ops[0],
            `success`
            );
            return res.status(obj.code).json({
            ...obj,
            });
        
        } else {
            const message = `Something went wrong, Please try again.`;
            return next(new APIError(`${message}`, httpStatus.BAD_REQUEST, true));
        }
        
    } catch (e) {
        console.log("e.",e);
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const getAllSubscription  = async (req,res,next) => {
    try {
        const address = req.query.address;
        const search = req.query.search;
        let pageNo = req.query.pageNo
        let limit = parseInt(req.query.limit);

        let qry = {}
        let filter = {}

        if(address){
            filter['address'] = address
        }

        if(search){
            qry = {
                "$or" : [
                    {name : {'$regex' : search,'$options' : 'i'}}
                ]
            }
        }
        let finalQuery = {
            "$and" : [
                filter,
                qry
            ]
        }
        
        const result = await query.findByPagination(subscriptionColl,finalQuery,{},pageNo,limit);
        const obj = resPattern.successPattern(httpStatus.OK,result,`success`);
            return res.status(obj.code).json({
            ...obj,
            });
    } catch (e) {
        console.log("e.",e);
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const findOneSubscription = async (req,res,next) => {
    try {
        const id = ObjectId(req.params.id);
        const result = await query.findOne(subscriptionColl,{_id : id});
        const obj = resPattern.successPattern(httpStatus.OK,result,`success`);
        return res.status(obj.code).json({
            ...obj,
        });
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const updateSubscription = async (req,res,next) => {
    try {
        const id = ObjectId(req.params.id);
        const requestData = req.body;
        const result = await query.findOneAndUpdate(subscriptionColl,{_id : id},{
            $set : requestData
        },{returnOriginal : false});

        const obj = resPattern.successPattern(httpStatus.OK,result,`success`);
        return res.status(obj.code).json({
            ...obj,
        });
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const deleteSubscription = async (req,res,next) => {
    try {
        const id = ObjectId(req.params.id);
         await query.deleteOne(subscriptionColl,{_id : id});
        const obj = resPattern.successPattern(httpStatus.OK,{message : "Delete Successfully...!"},`success`);
        return res.status(obj.code).json({
            ...obj,
        });
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}
module.exports = {
    createSubscription,
    getAllSubscription,
    findOneSubscription,
    updateSubscription,
    deleteSubscription
}
