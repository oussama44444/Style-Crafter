import { assets } from "../assets/assets"
import Title from "../components/Title"

function Contact() {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={'Contact'} text2={'Us'}></Title>
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-2">
        <img className="w-full md:max-w-[480px]" src={assets.contact} alt="" />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-bold text-xl text-gray-600">Our Shop</p>
          <p className="text-gray-500">You can find us at : MSB Hall ,South Mediterranean University ,Lac2</p>
          <p className="text-gray-500">Phone Number : +216 25994500</p>
          <p className="text-gray-500">Our Facebool page : style crafter</p>
          <p></p>
        </div>
      </div>
    </div>
  )
}

export default Contact
