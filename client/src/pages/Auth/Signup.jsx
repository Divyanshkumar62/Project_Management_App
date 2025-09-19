
import SignupForm from "../../components/auth/SignupForm";

const Signup = () => { 

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="w-full lg:w-1/2 min-h-screen hidden lg:block">
          <img 
            className="h-full w-full object-cover" 
            src="/signup.jpg" 
            alt="Signup Illustration" 
          />
        </div>
        <div className="w-full lg:w-1/2 rounded bg-gray-200 px-4 sm:px-7 flex items-center justify-center">
          <div className="w-full max-w-md">
            <SignupForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
