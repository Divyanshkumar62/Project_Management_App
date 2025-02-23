import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput'
import { validateEmail } from '../../utils/Helper'
// import {BackgroundBeams} from '../../components/ui/BackgroundBeams'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault();
        if(!validateEmail(email)){
          setError("Please Enter a valid Email address")
          return;
        }
        if(!password){
          setError("Please Enter the Password")
          return;
        }
        setError("")

        // Login Logic

        navigate('/home')
    }

  return (
    <>
      <div className='flex '>
        <div className='w-1/2 rounded bg-gray-200 px-7 '>
          <form onSubmit={handleLogin} className='w-96 border-2 text-lg shadow-2xl mx-auto mt-20 p-16 rounded-lg'>
            <h4 className='text-3xl mb-4 text-blue-700 font-medium text-center'>Login</h4>
            <input
              type="text"
              placeholder='Email' className=' w-full text-md text-slate-500 bg-zinc-300 py-3 mr-3 rounded-md outline-none border-[1.5px] px-5 mb-4'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)}/>
            {error && <p className='text-red-500 text-sm pb-1'>{error}</p>}
            <button type='submit' className='btn-primary bg-blue-700 px-2 py-2 rounded-md w-20 text-white text-center mt-2'>Login</button>
            <p className='text-sm text-center mt-4'>
              Not registered yet?{" "}
              <Link to={'/signup'} className='font-medium text-blue-700'>Create an account</Link>
            </p>
          </form>
        </div>
        <div className='w-1/2 max-h-screen'>
          <img src={"/login_robo_1.png"} alt="" />
        </div>
      </div>
    </>
  )
}

export default Login