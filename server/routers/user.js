const Express = require("express");
const router = Express.Router();
const MongoClient = require('mongodb').MongoClient;
const config = require('../config/config');
const dbUrl = `mongodb://localhost:${config.dbPort}/`

const responseClient = require('../util/util.js').responseClient

router.all("/getAllUser",(req,res)=>{

    MongoClient.connect(dbUrl,{useNewUrlParser:true},function(err,db){
        if(err){
            throw err
        }
        let dbi = db.db("InsetCollection");
        dbi.collection('users').find({}).toArray(function(error,result){
            db.close();
            if(error){
                throw error
            }
            
            responseClient(res,200,1,'success',result)
        })
    })

})

module.exports = router;