import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from './Loader';

function EnvironmentProcess() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const cloudIdeArn=queryParams.get('arn')
    const [loading,setLoading]=useState(false);
    const [success,setSuccess]=useState(true);
    const navigate=useNavigate();

    useEffect(()=>{
        setLoading(true);
        setSuccess(false);
        function getUrl(){
            if(cloudIdeArn){
                axios.get(`http://localhost:3000/cloud-ide-url/?arn=${cloudIdeArn}`)
                .then((res)=>{
                    const url=res.data.url;
                    setLoading(false);
                    setSuccess(true);
                    setTimeout(()=>{
                        window.location.href=url;
                    },1000*80)
                })
                .catch((err)=>{
                    if(!success) getUrl();
                    setLoading(false);
                })
            }
        }
           setTimeout(()=>{
                getUrl();
           },[5000])
    },[])
  
  return (
    <div className='w-full h-screen flex justify-center items-center bg-cyan-950'>
       {
        loading && <Loader/>
       }
       {
        !loading && <div className='w-[95%] h-[92%] bg-cyan-900 m-4  rounded-md flex justify-center items-center'>
            <div className='p-3 border-solid border-white border-[1.5px] rounded-md px-4 bg-black'>
                <h1 className='text-xl text-white text-center'>Please don't close the page</h1>
                <h1 className='text-xl text-white text-center'>environment is being created</h1>
                <h1 className='text-xl text-white text-center'>Wait, it will take some time to create environment</h1>
                <h1 className='text-xl text-white text-center'>When environment will created, we will redirect</h1>
                <div className='flex justify-center p-4'>
                     <Loader/>
                </div>
            </div>

        </div>
       }
    </div>
  )
}

export default EnvironmentProcess