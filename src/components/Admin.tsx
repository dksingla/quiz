import React from 'react'
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const navigate = useNavigate();
  return (
    <div className='flex w-screen h-screen justify-center items-center'>
      <div className='cursor-pointer'>
        <button onClick={() => navigate('/createquiz')} className='border p-3 border-black bg-slate-400 text-white cursor-pointer rounded-lg'>Add</button>
      </div>
      <div className='cursor-pointer'>
        <button onClick={() => navigate('')} className='border p-3 border-black bg-slate-400 text-white cursor-pointer rounded-lg'>Edit</button>
      </div>
      <div className='cursor-pointer'>
        <button onClick={() => navigate('')} className='border p-3 border-black bg-slate-400 text-white cursor-pointer rounded-lg'>Delete</button>
      </div>
    </div>
  )
}

export default Admin
