import LoginForm from "../../components/auth/LoginForm";

const Login = () => {

  return (
    <>
      <div className="flex ">
        <div className="w-1/2 rounded bg-gray-200 px-7 ">
          <LoginForm />
        </div>
        <div className="w-1/2 max-h-screen">
          <img src={"/login_robo_1.png"} alt="" />
        </div>
      </div>
    </>
  );
};

export default Login;
