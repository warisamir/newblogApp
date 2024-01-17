const express= require('express');
const bodyparser=require('body-parser');
const {randomBytes}=require('crypto');
const cors=require('cors')
const app =express();
const axios=require('axios');
app.use(bodyparser.json());
app.use(cors());
const posts={};
app.get('/posts',(req,res)=>{
    res.send(posts);
})
app.post('/posts/create',async(req,res)=>{
    const id=randomBytes(4).toString('hex');
    const {title}=req.body;
    posts[id]={
        id,
        title
    };
    await axios.post('http://event-bus-srv:4005/events',{
       type:'PostCreated',
       data:{
        id,
        title
       } 
    });
    res.status(201).send(posts[id]);
});

app.post('/events',(req,res)=>{
    console.log(`Received Event`,req.body.type);
    res.send({});
})
app.listen(4000,()=>{
    console.log("v55");
    console.log('listening on port 4000')
})
// app.listen(4005, () => {
//     console.log(`listening on 4005`);
// });