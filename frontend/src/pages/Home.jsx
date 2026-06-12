import BestSeller from "../components/BestSeller"

import Model from "../components/Model.jsx"
import SubscribeBox from "../components/SubscribeBox"
import SplitCollections from "../components/SplitCollection.jsx"
import SpeceficCollections from "../components/SpeceficCollections.jsx"

const Home = () => {
  return (
    <div>
      <Model />
      <SplitCollections />
      <SpeceficCollections />
      <SubscribeBox/>
    </div>
  )
}

export default Home

