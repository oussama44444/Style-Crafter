import { assets } from "../assets/assets"
import SubscribeBox from "../components/subscribeBox"
import Title from "../components/Title"

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={'About'} text2={'Us'}></Title>
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img src={assets.aboutus}  alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus doloremque laudantium, ea dicta, quis beatae recusandae, hic deleniti animi voluptates excepturi. Blanditiis, labore eaque in neque dignissimos ducimus enim quod.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa ratione, obcaecati amet vitae iure maxime, doloremque, magni at corporis perferendis ullam sunt animi! Doloremque sequi nihil ea provident vero dolor?</p>
          
        </div>
      </div>
     <SubscribeBox/>
    </div>
  )
}

export default About
