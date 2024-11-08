import express from 'express';
import 'dotenv/config';
import { getPublicIp, initCloudIdeNodeJs } from './ecs.service.js';
import cors from "cors";


const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({origin:'*'}));

app.get('/health',(req,res)=>{
    res.status(200).send('healthy');
})

app.post('/create-environment',async(req,res)=>{
    try {
        const {user,projectId}=req.body;
        if(!user || !projectId) return res.status(400).json({success:false, message:'please provide user and projectId'});
        const clouIdeArn=await initCloudIdeNodeJs(user,projectId);
        res.status(201).json({
            success:true,
            clouIdeArn
        });
    } catch (error) {
        res.status(400).json({
            success:false,
            message:'error in creation of environment',
            error:error.message
        })
    }
})

app.get('/cloud-ide-url',async(req,res)=>{
    try {
        const {arn}=req.query;
        if(!arn) return res.status(400).json({success:false,message:'please provide cloudIdeArn'});
        const publicIp=await getPublicIp(arn);
        const url=`http://${publicIp}:8000`;
        res.json({
            success:true,
            url
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:'error in getting cloudide url',
            error:error
        })
    }
})

const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})