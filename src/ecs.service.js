import 'dotenv/config';
import { ECSClient,RunTaskCommand,DescribeTasksCommand } from '@aws-sdk/client-ecs';
import { EC2Client, DescribeNetworkInterfacesCommand } from "@aws-sdk/client-ec2";

const awsCredentials={
  region: "ap-south-1",
  credentials:{
   accessKeyId:process.env.ACCESS_KEY_ID,
   secretAccessKey:process.env.SECRET_ACCESS_KEY
  }
}
const ecsClient=new ECSClient(awsCredentials)
const ec2Client=new EC2Client(awsCredentials)

export async function initCloudIdeNodeJs(user,projectId) {
  const command = new RunTaskCommand({
    cluster: process.env.CLUSTER_ARN,
    taskDefinition: process.env.TASK_DEFINITION_ARN,
    launchType:'FARGATE',
    count:1,
    networkConfiguration:{
      awsvpcConfiguration:{
        assignPublicIp: 'ENABLED',
        subnets:[process.env.MY_SUBNET_1,process.env.MY_SUBNET_2,process.env.MY_SUBNET_3],
        securityGroups:[process.env.MY_SECURITY_GROUP],
      },
    },
    overrides:{
      containerOverrides:[
        {
          name:'cloud-ide-nodejs',
          environment:[
            {
              name:'AWS_ACCESS_KEY_ID',value:process.env.ACCESS_KEY_ID
            },
            {
                name:'AWS_SECRET_ACCESS_KEY',value:process.env.SECRET_ACCESS_KEY
            },{
                name:'USER',value:user
            },
            {
                name:'PROJECT',value:projectId
            }
          ]
        }
      ]
    }
    
})
 const res=await ecsClient.send(command);
 const taskArn=res.tasks[0].taskArn;
 return taskArn;
 
}

export async function getPublicIp(taskArn) {
  const describeTaskResponse=await ecsClient.send(new DescribeTasksCommand({
    cluster:'suryansh-verma-cluster',
    tasks:[taskArn]
   }));
   const eniId=describeTaskResponse.tasks[0].attachments[0].details.find(detail => detail.name === "networkInterfaceId").value;
   const describeNetworkInterfaces=await ec2Client.send(new DescribeNetworkInterfacesCommand({
    NetworkInterfaceIds:[eniId]
   }))
   const publicIp=describeNetworkInterfaces.NetworkInterfaces[0].Association.PublicIp;
   return publicIp;
}