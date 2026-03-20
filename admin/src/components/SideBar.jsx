import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const SideBar = () => {
  const navItems = [
    { to: "/add", label: "Add Items", icon: assets.add_icon },
    { to: "/list", label: "Items List", icon: assets.order_icon },
    { to: "/orders", label: "Orders", icon: assets.order_icon },
    { to: "/set-model-image", label: "Set Model Image", icon: assets.upload_area },
    { to: "/categories", label: "Categories", icon: assets.add_icon },
  ];

  return (
    <div className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className="flex items-center gap-3 border border-gray-300 p-2 rounded-lg hover:bg-gray-100"
          >
            <img className="w-5 h-5" src={item.icon} alt={item.label} />
            <p>{item.label}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
