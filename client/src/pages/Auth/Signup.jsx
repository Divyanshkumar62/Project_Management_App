
import SignupForm from "../../components/auth/SignupForm";

const Signup = () => { 

  return (
    <>
      <div className="flex ">
        <div className="w-1/2 min-h-screen">
          <img className="h-full" src={"/signup.jpg"} alt="" />
        </div>
        <div className="w-1/2 rounded bg-gray-200 px-7 ">
          <SignupForm />
        </div>
      </div>
    </>
  );
};

export default Signup;
