const express = require('express');

const multer = require("multer");
const fs = require ("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const OAuth2Data = require('./credential.json')
const {google} = require ('googleapis')
const formidable = require('formidable');

const app = express();
app.use(cors({origin:"*"}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

var name,pic

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

var Storage = multer.diskStorage({

    destination: function (req, file, callback){

        callback(null,"./images");

    },
    filename : function (req, file, callback){
        callback(null,`FunOfHeuristic_${file.originalname}`)
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

        return res.json(url)

    }else{

        var oauth2 = google.oauth2({
            auth: OAuth2Client,
            version: "v2",
        });

    }
})

app.get('/api/callback',(req,res)=>{

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
                res.redirect("http://localhost:4200/upload");
            }
        })
    }
})


app.post("/api/upload", (req,res)=>{

    upload(req,res, function (err){
        if(err){
            console.log(err);
            return res.send("Error ocurred!");

        }else{
            console.log(req.file.path);

            //
           
           
            //oAuth2Client.setCredentials(req.body.token);
            

            const drive = google.drive({version:"v3",auth:OAuth2Client});
            const fileMetaData ={
                name : req.file.filename,
            };

            const media= {
                mimeType: req.file.mimetype,
                body : fs.createReadStream(req.file.path),
            };
            drive.files.create({

                resource:fileMetaData,
                media: media,
                fields:"id",
            },
            (err, file)=>{

                if (err){
                    console.error(err);
                }

                else{
                    fs.unlinkSync(req.file.path)
                    console.error("suceeeeeeeeeee");
                    return res.json("sucess")
                }
              

            }

            
            );
        }
    });
});

//
app.post('/fileUpload', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).send(err);
        const token = JSON.parse(fields.token);
        console.log(token)
        if (token == null) return res.status(400).send('Token not found');
        oAuth2Client.setCredentials(token);
        console.log(files.file);
        const drive = google.drive({ version: "v3", auth: oAuth2Client });
        const fileMetadata = {
            name: files.file.name,
        };
        const media = {
            mimeType: files.file.type,
            body: fs.createReadStream(files.file.path),
        };
        drive.files.create(
            {
                resource: fileMetadata,
                media: media,
                fields: "id",
            },
            (err, file) => {
                oAuth2Client.setCredentials(null);
                if (err) {
                    console.error(err);
                    res.status(400).send(err)
                } else {
                    res.send('Successfully upload the file')
                }
            }
        );
    });
  });

app.listen(5550, () => console.log("Server connected on port 5550"));