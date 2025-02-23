import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput'
import { validateEmail } from '../../utils/Helper'
// import {BackgroundBeams} from '../../components/ui/BackgroundBeams'

const Signup = () => {
    const [name, setName] = useState("") 
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const handleSignup = (e) => {
        e.preventDefault();

        if(!name){
          setError("Please Enter the Name")
          return; 
        }
        if(!validateEmail(email)){
          setError("Please Enter a valid Email address")
          return;
        }
        if(!password){
          setError("Please Enter the Password")
          return;
        }
        setError("")

        // Signup Logic

        navigate('/login')
    }

  return (
    <>
      <div className='flex '>
        <div className='w-1/2 min-h-screen'>
          <img className='h-full' src={"/signup.jpg"} alt="" />
        </div>
        <div className='w-1/2 rounded bg-gray-200 px-7 '>
          <form onSubmit={handleSignup} className='w-96 border-2 text-lg shadow-2xl mx-auto mt-20 p-16 rounded-lg'>
            <h4 className='text-3xl mb-4 text-blue-700 font-medium text-center'>Signup</h4>
            <input
              type="text"
              placeholder='Name' className=' w-full text-md text-slate-500 bg-zinc-300 py-3 mr-3 rounded-md outline-none border-[1.5px] px-5 mb-4'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder='Email' className=' w-full text-md text-slate-500 bg-zinc-300 py-3 mr-3 rounded-md outline-none border-[1.5px] px-5 mb-4'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)}/>
            {error && <p className='text-red-500 text-sm pb-1'>{error}</p>}
            <button type='submit' className='btn-primary bg-blue-700 px-2 py-2 rounded-md w-20 text-white text-center mt-2'>Signup</button>
            <p className='text-sm text-left mt-4 text-nowrap'>
              Not registered yet?{" "}
              <Link to={'/login'} className='font-medium text-blue-700'>Login to your account</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Signup