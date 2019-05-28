const Express = require("express");
const router = Express.Router();
const MongoClient = require('mongodb').MongoClient;
const config = require('../config/config');
const dbUrl = `mongodb://localhost:${config.dbPort}/`

const responseClient = require('../util/util.js').responseClient;
const ObjectId = require('mongodb').ObjectID;

router.post('/getNewestInsets',(req,res)=>{
    
    let limit=6;
    let skip=0
    
    if(typeof req.pageNum === 'number' && req.pageNum >= 1){
        
        skip = (req.pageNum-1) * 6
    }
    MongoClient.connect(dbUrl,{useNewUrlParser:true},(err,db)=>{
        if(err){
            throw err
        }
        let dbi = db.db("InsetCollection");
        dbi.collection('insets').find({},{limit,skip}).toArray((error,result)=>{
            db.close();
            if(error){
                throw error
            }
            if(result){

                responseClient(res,200,1,'success',result)
            }else{
                responseClient(res,400,1,'faild',{})
            }
        })
    })
})
router.all('/getMyById',(req,res)=>{
    let id = "5cbebeb8e472d7e69d21eaf5";;
    MongoClient.connect(dbUrl,{useNewUrlParser:true},(err,db)=>{
        let dbi = db.db("InsetCollection");

        dbi.collection('users').findOne({_id:ObjectId(id)},{},(error,result)=>{
            console.log(result)
            db.close();
            responseClient(res,200,1,'success',result)
        })
    })
})
router.post('/getHomeInsets',(req,res)=>{
    //判断一下是否登录先
    let id = "5cbebeb8e472d7e69d21eaf5";
    let _id =  new ObjectId(id);

    
    MongoClient.connect(dbUrl,{useNewUrlParser:true},(err,db)=>{
        if(err) throw err;
        let dbi = db.db("InsetCollection");
        let subscribeids;
        //,{projection:{subscribeuserIds:1}}
        dbi.collection('insets').find({author:_id}).toArray((error,result)=>{
            console.log(error);
            subscribeids = result;
            db.close();
        });
        console.log(subscribeids);

        responseClient(res,200,1,'success',subscribeids)
    })
})

module.exports = router;