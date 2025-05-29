
import ProfileInformation from "@/components/Pages/UserDashboard/ProfileInformation/ProfileInformation"
import { Suspense } from "react"
import Spinner from "@/components/common/Spinner/Spinner";


const Profile = () => {
  return (
    <Suspense fallback={<Spinner/>}>
    <div> <ProfileInformation /> </div>
  </Suspense>

  )
}

export default Profile