const Express = require("express");
const router = Express.Router();
const MongoClient = require('mongodb').MongoClient;
const config = require('../config/config');
const dbUrl = `mongodb://localhost:${config.dbPort}/`

const responseClient = require('../util/util.js').responseClient;
const ObjectId = require('mongodb').ObjectID;

router.post('/getNewestInsets',(req,res)=>{
    let id = req.decoded['_id'];
    let limit=6;
    let skip=0
    
    if(typeof req.pageNum === 'number' && req.pageNum >= 1){
        
        skip = (req.pageNum-1) * 6
    }
    MongoClient.connect(dbUrl,{useNewUrlParser:true},async (err,db)=>{
        if(err){
            throw err
        }
        let dbi = db.db("InsetCollection");
        let allNewest = null;
        let getAllNew = async ()=>{
            
            let result1 = await new Promise((resolve,reject)=>{
                dbi.collection('insets').find({},{limit,skip}).toArray((error,result)=>{
                    db.close();
                 
                    if(result){
                        resolve(result);
                        //responseClient(res,200,1,'success',result)
                    }else{
                        //responseClient(res,400,1,'faild',{})
                        reject(error)
                    }
                })
            })
            allNewest = result1;
        }
        
        await getAllNew();

        
        responseClient(res,200,1,'success',allNewest)
        /*dbi.collection('insets').find({},{limit,skip}).toArray((error,result)=>{
            db.close();
            if(error){
                throw error
            }
            if(result){

                responseClient(res,200,1,'success',result)
            }else{
                responseClient(res,400,1,'faild',{})
            }
        })*/
    })
})
router.all('/getSubsNewest',(req,res)=>{
    
    let id = req.decoded['_id'];
    MongoClient.connect(dbUrl,{useNewUrlParser:true},(err,db)=>{
        let dbi = db.db("InsetCollection");
        let getsubscribeIds =async ()=>{
            //await还挺好用的
            let ids = await  dbi.collection('users').findOne({_id:ObjectId(id)},{projection:{subscribeuserIds:1}})
            let idsCollect = ids.subscribeuserIds || [];
            if(idsCollect.length > 0){
                idsCollect.forEach(e=>{
                    e = ObjectId(e);
                })
            }
            dbi.collection('insets').find({author:{$in:idsCollect}}).toArray((error,result)=>{
                if(result){
                   

                    responseClient(res,200,1,'success',result);
                }else{
                    responseClient(res,400,1,'failed',error);
                }
                db.close();
            })
            


            /**
             * ,(error,result)=>{
                if(result){
                    resolve(result)
                }else{
                    reject(error)
                }  
            }
             */
        }
        
        getsubscribeIds();
    })
})
/*router.post('/getHomeInsets',(req,res)=>{
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
})*/

module.exports = router;