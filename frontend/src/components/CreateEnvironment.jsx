import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios';

function CreateEnvironment() {
    const [user,setUser]=useState('');
    const [project,setProject]=useState('');
    const [language,setLanguage]=useState('node-js');
    const [creation,setCreation]=useState(false);
    const navigate=useNavigate();

    async function handleCreate(){
        setCreation(true);
        const projectId=project+'-'+Date.now().toString();
        const bodyObj={
            user,
            projectId,
            language
        }
        axios.post('http://localhost:3000/create-environment',bodyObj)
        .then((res)=>{
            const cloudIdeArn=res.data.clouIdeArn;
            navigate(`/processing?arn=${cloudIdeArn}`);
        })
        .catch((err)=>{
            console.log(err.message);
        })
    }
  return (
    <div className=' w-full justify-center items-center flex bg-cyan-950 h-screen'>
        <div className='flex justify-center items-center flex-col gap-3 border-solid bg-white border-[2px] rounded-md py-5 px-10 '>
        <h1 className='text-center text-4xl px-4 font-semibold'> Create environment</h1>
        <div className='flex w-full justify-center items-center flex-col gap-3 mt-9'>
            <input type="text" placeholder='username'  className='w-full py-2 border-solid border-[1.5px] border-gray-600 rounded-md pl-3' onChange={(e)=>setUser(e.target.value)}/>
            <input type="text" placeholder='projectName'  className='w-full py-2 border-solid border-[1.5px] border-gray-600 rounded-md  pl-3' onChange={(e)=>setProject(e.target.value)}/>
            <select name="language" id="language" className='p-2 border-solid border-gray-700 border-[1.5px] w-full rounded-md' onChange={(e)=>setLanguage(e.target.value)}>
                <option value="node-js">Node Js</option>
                <option value="python">Python</option>
                <option value="go">Go</option>
                <option value="ruby">Ruby</option>
            </select>
        </div>
        {
            creation ? <button className='bg-gray-900 p-3 font-bold rounded-md text-white w-full scale-105'>Creating environment...</button>
            :
            <button className='bg-gray-700 p-3 font-bold rounded-md text-white w-full hover:bg-gray-900 hover:scale-105' onClick={handleCreate}>Create Environment</button>
        }
        </div>
    </div>
  )
}

export default CreateEnvironment