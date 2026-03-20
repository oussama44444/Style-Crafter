const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex gap-2 items-center mt-6 mb-4">
      <p className="text-2xl font-semibold text-gray-600">{text1} <span className="text-3xl text-gray-800 font-bold">{text2}</span></p>
      <p className="w-16 sm:w-20 h-[2px] sm:h-[3px] bg-indigo-800 mt-1"></p>
    </div>
  );
};

export default Title;
