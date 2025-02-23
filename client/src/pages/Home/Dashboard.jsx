import { IoGridOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { FaDiagramProject } from "react-icons/fa6";
const Dashboard = () => {
  return (
    <div className=' w-20 h-screen flex flex-col justify-between items-center py-4'>
        <div className="text-blue-700">
            <img src="/logo.png" alt="Logo" />
        </div>
        <div className="text-gray-700 flex flex-col items-center justify-center gap-6">
            <span className="text-blue-700"><IoGridOutline size={30}/></span>
            <span><FaDiagramProject size={30}/></span>
            <span><TbLogout2 size={30}/></span>
        </div>
        <div>
            <img className='w-16 h-16 rounded-full object-cover object-right-top' src="/profile.jpg" alt="" />
        </div>
    </div>
  )
}

export default Dashboard