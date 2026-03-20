import { useContext } from "react";
import { ShopContext } from "../context/Shopcontext.jsx";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link className="text-gray-700 cursor-pointer group" to={`/product/${id}`}>
  <div className="relative overflow-hidden">
    <img
      className="w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0"
      src={image[0]}
      alt={name}
    />
    {image[1] && (
      <img
        className="absolute top-0 left-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
        src={image[1]}
        alt={`${name} second view`}
      />
    )}
  </div>
  <p className="pt-3 pb-1 text-sm">{name}</p>
  <p className="text-sm font-medium">{price}{currency}</p>
</Link>

  );
};

export default ProductItem;
