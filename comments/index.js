const express= require('express');
const bodyparser=require('body-parser');
const {randomBytes}=require('crypto');
const cors=require('cors');
const axios =require('axios');
const app =express();
app.use(bodyparser.json());
app.use(cors());
const commentbyID={};
app.get('/posts/:id/comments',(req,res)=>{
    res.send(commentbyID[req.params.id]||[]);
})
app.post('/posts/:id/comments',async(req,res)=>{
    const comid=randomBytes(4).toString('hex');
    const {content}=req.body;
    const comments=commentbyID[req.params.id]||[];
    comments.push({id:comid,content,status:'pending'});
    commentbyID[req.params.id]=comments;
    await axios.post('http://event-bus-srv:4005/events',{
        type:'CommentCreated',
        data:{
            id:comid,
            content,
            postId:req.params.id,
            status:'pending'
        }
    });
    res.status(201).send(comments);
});
app.post('/events',async(req,res)=>{
    console.log(`Received Event`,req.body.type);
    const {type,data}=req.body;
    if(type==='CommentModerated')
    {
        const {id,status,postId,content}=data;
        const comments=commentbyID[postId]||[];
        const comment=comments.find(comment=>{
            return comment.id===id
        });
        comment.status=status;
        // commentbyID[postId]=comments;

        await axios.post('http://event-bus-srv:4005/events',{
            type:'CommentUpdated',
            data:{
                id,
                status,
                postId,
                content
            }
        })
    } 

    res.send({});
})
app.listen(4001,()=>{
    console.log('listenting on port 4001')
})