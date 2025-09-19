import LoginForm from "../../components/auth/LoginForm";

const Login = () => {

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="w-full lg:w-1/2 rounded bg-gray-200 px-4 sm:px-7 flex items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
        <div className="w-full lg:w-1/2 max-h-screen hidden lg:block">
          <img 
            src="/login_robo_1.png" 
            alt="Login Illustration" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </>
  );
};

export default Login;
