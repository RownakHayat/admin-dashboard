
import AdminProfileInfo from "@/components/Pages/UserDashboard/AdminProfileInfo/AdminProfileInfo"
import { Suspense } from "react"
import Spinner from "@/components/common/Spinner/Spinner";


const AdminProfileInfoPage = () => {
  return (
    <Suspense fallback={<div><Spinner/></div>}>
      <div> <AdminProfileInfo /> </div>
    </Suspense>

  )
}

export default AdminProfileInfoPage