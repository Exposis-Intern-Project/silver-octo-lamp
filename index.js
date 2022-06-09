const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const path = require('path');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const helpers = require('./Js/helpers.js');
const handlebars = require('handlebars');
// const { receiveMessageOnPort } = require('worker_threads');

// for storing file
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './static/uploads');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// middleware
app.engine('hbs' , require('hbs').__express);
app.set('view engine','hbs');
app.set('views' , path.join(__dirname,'views'));
app.use('/static',express.static('static'));
var css =  path.join(__dirname,'/Css');
app.use(express.static(css))
var js =  path.join(__dirname,'/Js');
app.use(express.static(js))
var photos =  path.join(__dirname,'/photos');
app.use(express.static(photos))
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }))
let upload = multer({ storage: storage, fileFilter: helpers.imageFilter })

// // parse application/json
app.use(bodyParser.json())




//

//
app.get('/', (req, res) => {
  res.status(200).render('index.hbs');
});

app.get('/file' , (req,res) => {
  res.status(200).render('file.hbs');
})

app.get('/contact' , (req,res)=>{
  res.status(200).render('contact.hbs')
})

app.get('/emailFormat' , (req,res)=>{
  // res.status(200).sendFile(path.join(__dirname , './static/emailFormat.html'))
  res.status(200).render("emailFormat.hbs")
})


app.get("/about" , (req,res)=>{
  res.render('about.hbs')
})

app.get("/sucessful" , (req,res)=>{
  res.render('successful.hbs')
})

app.post("/sendEmails" ,upload.single('file'), (req,res)=>{
  //  console.log(req.body);
  let clientId = req.body.clientId;
  let clientSecret = req.body.clientSecret;
  let refresh_token = req.body.refresh_token;
  let from_email = req.body.from_email;
  let subject = req.body.subject;
  let to_email = JSON.parse(req.body.to_email);
  let message = req.body.message;
  // to_email.push("nitingupta.tt.19@nitj.ac.in");
  // console.log(to_email);
   

  const oauth2Client = new OAuth2(
     clientId, 
     clientSecret,
    "https://developers.google.com/oauthplayground" // Redirect URL
   );
    
   oauth2Client.setCredentials({
    refresh_token: refresh_token
    });
   

  //  oauth2Client.refreshAccessToken(function(err, tokens){
  //   console.log(tokens)
  //   oauth2Client.credentials = {access_token : tokens.access_token}
  //   callback(oauth2Client);
  //  });
     
    const accessToken = oauth2Client.getAccessToken()
  const smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
       type: "OAuth2",
       user: from_email, 
       clientId: clientId,
       clientSecret: clientSecret,
       refreshToken: refresh_token,
       accessToken: accessToken
  },
  tls: {
    rejectUnauthorized: false
  }
});
 
    const filePath = path.join(__dirname, './static/email.html');
    const replacements = {
        Message: message,

      };

    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const htmlToSend = template(replacements);

   const mailOptions = {
    from: from_email, // Sender address
    to: to_email, // List of recipients
    subject: subject, // Subject line
    html: htmlToSend, // Plain text body
    attachments: [
      { filename: req.file.filename, path: req.file.path }
   ]
};
smtpTransport.sendMail(mailOptions, (error, response) => {
  
  if(error){
    console.log(error);
    res.status(400).json({
      message: "An ERROR Occured",
      status: 400
    })
  }
  else{
    console.log(response);
    res.status(200).json({
      message: "All Mails Are Transferred!",
      status: 200
    })
  }
  smtpTransport.close();
});
// res.send("rror")

})




// app.get("/fileUpload" , (req,res)=>{
//   res.sendFile(path.join(__dirname , './static/fileUpload.html'));
// })

// app.get("/html" , (req,res)=>{
//   res.sendFile(path.join(__dirname , './static/email.html'));
// })

app.post('/stats',upload.single('upload_data'), function (req, res) {



  console.log(req.body)


});

app.get('*' , (req,res)=>{
  res.status(404).sendFile(path.join(__dirname , './static/Error.html'))
})
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})