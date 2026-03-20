import BestSeller from "../components/BestSeller"

import Model from "../components/Model.jsx"
import SubscribeBox from "../components/subscribeBox"
import SplitCollections from "../components/SplitCollection.jsx"
import SpeceficCollections from "../components/speceficCollections.jsx"

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

