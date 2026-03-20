import { assets } from '../assets/assets';

const NavBar = ({ setToken }) => {
  const handleLogOut = () => {
    setToken('');
  };

  return (
    <div className="flex items-center justify-between py-2 px-[4%]">

      <button
        onClick={handleLogOut}
        className="bg-gray-600 text-white px-5 py-2 rounded-full text-xs"
      >
        Log Out
      </button>
    </div>
  );
};

export default NavBar;
