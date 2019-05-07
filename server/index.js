const Express = require('express');
const app = new Express();
const config = require('./config/config.js')
const responseClient = require('./util/util').responseClient;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const path = require('path');
const userrouter = require('./routers/user');
const insetrouter = require('./routers/insets');
const fs = require('fs')

const MongoClient = require('mongodb').MongoClient;

const dbUrl = `mongodb://localhost:${config.dbPort}/`

let upload = multer({
    dest:path.join(__dirname,'../upload')
})



//定义一个中间件解析token获取用户信息
const checkToken = function(req,res,next){
    let token = req.headers['x-access-token'];
    if(token){
         jwt.verify(token, app.get('InsetCollKey'), function (err, decoded) {
            if (err) {
                console.log('验证token失败')
            }
            else {
                req.decoded = decoded;
                next()
            }
        });
    }else{
        next()
    }
    
}

app.set("InsetCollKey",config.key);
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());
app.use(checkToken);
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", `http://${config.apiHost}:${config.apiPort}`)
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'GET, POST,OPTIONS');
    if (req.method == 'OPTIONS') {
        res.sendStatus(204);
    } else {
        next();
    }
})
app.use('/upload', Express.static(path.join(__dirname, "..", "/upload")));
app.use('/user',userrouter);
app.use('/inset',insetrouter);
//通过转换token为用户信息
app.post('/getUserInfo',(req,res)=>{
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        /*验证token*/
        jwt.verify(token, app.get('InsetCollKey'), function (err, decoded) {
            if (err) {
                return res.json({success: false, message: '验证token失败'});
            }
            else {
                
                responseClient(res,200,1,'success',decoded)
            }
        });
    }
    else {
        return res.status(403).send({
            success: false,
            message: '没有token'
        });
    }
})

app.post('/imgUpload',upload.single('imageFile'),(req,res,next)=>{
    
    
    let tempArr = req.file.originalname.split('.');
    let trueType = tempArr.pop();
    let newName = `http://${config.apiHost}:${config.apiPort}/upload/${req.file.filename}.${trueType}`;
    fs.rename(req.file.path,`upload/${req.file.filename}.${trueType}`,(err)=>{
        if(err){
            responseClient(res, 400, 0, 'failed', {err})
            throw err;

        }
    })

    responseClient(res, 200, 1, 'success', {path:newName})
})
app.post('/login',(req,res)=>{
    MongoClient.connect(dbUrl,{useNewUrlParser:true},function(err,db){
        if(err){
            throw err
        }
        let {password,loginName} = req.body;
        if(!password || !loginName){
            responseClient(res,400,1,'failed',{
                info:'请输入用户名和密码'
            })
        }
        loginName = loginName + '';

        let dbi = db.db("InsetCollection");
       
        dbi.collection('users').findOne(
            {
                'password':password,
                $or:[
                    {'email':loginName},
                    {'phone':loginName}
                ]
            },
            {projection:{password:0,subscribeuserIds:0,collectsids:0}},
            async function(error,result){
                db.close();
                if(error){
                    throw error
                }
                if(result){
                    let token = jwt.sign(result, app.get('InsetCollKey'), {});
                    
                    let output = {
                        'user':result,
                        'token':token
                    }
                    let getsbusById = await function(){
                        if(output.user){
                            responseClient(res,200,1,'success',output)
                        }
                       
                    } 
                    getsbusById();
                }else{
                    responseClient(res,200,1,'nomatch',{})
                }
            }
        )
    })
})
app.all('/test',(req,res)=>{
    res.send('响应一个消息-略略')
})
app.listen(config.apiPort, function (err) {
    if (err) {
        console.error('err:', err);
    } else {
        console.info(`===> api server is running at ${config.apiHost}:${config.apiPort}`)
    }
});