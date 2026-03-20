import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import axios from "axios";
import { toast } from "react-toastify";

const SignIn = () => {
  const { token, setToken, navigate } = useContext(ShopContext);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    currentAction: 'Sign In'
  });

  const { name, email, password, currentAction } = formState;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleActionSwitch = () => {
    setFormState((prevState) => ({
      ...prevState,
      currentAction: currentAction === 'Sign In' ? 'Sign Up' : 'Sign In',
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const url = currentAction === 'Sign In'
      ? 'http://localhost:6009/api/user/login'
      : 'http://localhost:6009/api/user/register';

    const userData = currentAction === 'Sign In' ? { email, password } : { name, email, password };

    try {
      const response = await axios.post(url, userData);
      
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] m-auto mt-14 gap-4 text-black">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentAction}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-900" />
      </div>
      
      {currentAction === 'Sign Up' && (
        <input
          onChange={handleInputChange}
          value={name}
          name="name"
          type="text"
          className="w-[50%] px-3 py-2 border border-black"
          placeholder="Name"
          required
        />
      )}

      <input
        onChange={handleInputChange}
        value={email}
        name="email"
        type="email"
        className="w-[50%] px-3 py-2 border border-black"
        placeholder="Email"
        required
      />

      <input
        onChange={handleInputChange}
        value={password}
        name="password"
        type="password"
        className="w-[50%] px-3 py-2 border border-black"
        placeholder="Password"
        required
      />
      
      <div className="w-full text-sm flex justify-center mt-4">
        <p
          onClick={handleActionSwitch}
          className="cursor-pointer text-blue-500 hover:underline"
        >
          {currentAction === 'Sign In' ? 'Create Account' : 'Sign In'}
        </p>
      </div>

      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentAction === 'Sign In' ? 'Login' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignIn;
