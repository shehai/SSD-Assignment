const express = require('express');
const app = express();
const multer = require("multer");
const fs = require ("fs");

var name,pic

const OAuth2Data = require('./credentials.json')
const {google} = require ('googleapis')

const CLIENT_ID = OAuth2Data.web.client_id

const CLIENT_SECRET = OAuth2Data.web.client_secret

const REDIRECT_URI =OAuth2Data.web.redirect_uris[0]



const OAuth2Client = new google.auth.OAuth2(

    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
)

var authed = false

const SCOPES = "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile"

var storage = multer.diskStorage({

    destination: function (req, file, callback){

        callback(null,"./images");

    },
    filename : function (req, file, callback){
        callback(null, file.fieldname + "_" + Date.now()+" "+file.originalname)
    },
});

var upload = multer({
    storage: Storage,

}).single("file");
app.get('/', (req,res)=>{

    if(!authed){

        var url = OAuth2Client.generateAuthUrl({

            access_type:'offline',
            scope:SCOPES
        })

        console.log(url)

        return res.send(url)

    }else{

        var oauth2 = google.oauth2({
            auth: OAuth2Client,
            version: "v2",
        });

    }
})

app.get('/getAcessToken',(req,res)=>{

    const code = req.query.code

    if(code){
        //get acess token
        OAuth2Client.getToken(code,function(err,tokens){

            if(err){
                console.log("Error in Authenticating")
                console.log(err)
            }else{
                console.log("sucessful")
                console.log(tokens)
                OAuth2Client.setCredentials(tokens)

                authed = true
            }
        })
    }
})


app.post("/upload/image", (req,res)=>{

    upload(req,res, function (err){
        if(err){
            console.log(err);
            return res.send("Error ocurred!");

        }else{
            console.log(req.file.path);
            const drive = google.drive({version:"v3",auth:OAuth2Client});
            const fileMetaDeta ={
                name : req.file.filename,
            };

            const media= {
                mimeType: req.file.mimetype,
                body : fs.createReadStream(req.file.path),
            };
            drive.files.create({

                resource:fileMetadata,
                media: media,
                fields:"id",
            },
            (err, file)=>{

                if (err){
                    console.error(err);
                }

                else{
                    fs.unlinkSync(req.file.path)
                    return res.send("sucess", {name:name, pic:pic,sucess:true})
                }
              

            }

            }
            )
        }
    })
})

app.listen(5550, () => console.log("Server connected on port 5550"));