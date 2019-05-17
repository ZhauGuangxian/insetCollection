const Express = require("express");
const router = Express.Router();
const MongoClient = require('mongodb').MongoClient;
const config = require('../config/config');
const dbUrl = `mongodb://localhost:${config.dbPort}/`

const responseClient = require('../util/util.js').responseClient;

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

route.post('/getHomeInsets',(req,res)=>{
    //判断一下是否登录先
    let {id} = req.body; 
    MongoClient.connect(dbUrl,{useNewUrlParser:true},(err,db)=>{
        if(err) throw err;
        let dbi = db.db("InsetCollection");
        let subscribeids = dbi.collection('users').findOne({"_id":id},{projection:{subscribeuserIds:1}});
        console.log(subscribeids);

        responseClient(res,200,1,'success','jiade')
    })
})

module.exports = router;