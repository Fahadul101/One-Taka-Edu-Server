const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xszsi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('course'));
app.use(fileUpload());

const port = 5000;

app.get('/',(req,res)=>{
    res.send("mongoDb working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const courseCollection = client.db("oneTakaEducation").collection("courses");


  app.post('/addCourse',(req,res)=>{
      const course = req.body;
      console.log(course);
      courseCollection.insertOne(course)
      .then(result =>{
          res.send(result.insertedCount > 0)
      })
  }),

  app.get('/allEnrollment', (req, res) => {
    courseCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
}),


  app.post('/enrollmentByDate',(req,res)=>{
    const date = req.body;
    console.log(date.date);
    // const name = req.body.name;

    // courseCollection.find({date: date.date})
    // .toArray((err, documents) =>{
    //     res.send(documents)
    // })
    
    courseCollection.find({date: date.date})
    .toArray((err, documents) =>{
        res.send(documents)
    })
})

   app.post('/addCourses',(req, res)=>{
       const file = req.files.file;
       const name = req.body.name;
       const courseName= req.body.courseName;
       const price = req.body.price;
       console.log(name,courseName,file,price);
       //for upload
       file.mv(`${__dirname}/course/${file.name}`,err =>{
           if(err){
               console.log(err);
               return res.status(500).send({msg:'Filed to Upload Image'});
           }

           return res.send({name: file.name, path:`/${file.name}`})
       })
   })

   app.post('/addReview',(req, res)=>{
    const file = req.files.file;
    const name = req.body.name;
    const courseName= req.body.courseName;
    const price = req.body.price;
    console.log(name,courseName,file,price);
    file.mv(`${__dirname}/course/${file.name}`,err =>{
        if(err){
            console.log(err);
            return res.status(500).send({msg:'Filed to Upload Image'});
        }

        return res.send({name: file.name, path:`/${file.name}`})
    })
    
})



});

app.listen(process.env.PORT || port)