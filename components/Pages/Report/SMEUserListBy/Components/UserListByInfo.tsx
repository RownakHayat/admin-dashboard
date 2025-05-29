
const UserListByIndustrySectorCluster = ({ userListByData }: any) => {

  let serialNumber = 1;
  return (

    <div>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-300 text-center">
             <th rowSpan={3} className="border border-gray-400 px-2 py-1">SL</th>
             <th rowSpan={3} className="border border-gray-400 px-2 py-1">Event Name</th>
             {/* <th rowSpan={3} className="border border-gray-400 px-2 py-1">Cluster</th>
            <th rowSpan={3} className="border border-gray-400 px-2 py-1">Sector</th>
            <th rowSpan={3} className="border border-gray-400 px-2 py-1">Industry</th> */}
          </tr>
        </thead>
        <tbody className=''>
          {/* <tr>
            <td className="border border-gray-400 px-2 py-1">{serialNumber++}</td>
            <td className="border border-gray-400 px-2 py-1">{userListByData?.user_profile?.cluster?.name}</td>
            <td className="border border-gray-400 px-2 py-1">{userListByData?.user_profile?.service_type?.name}</td>
            <td className="border border-gray-400 px-2 py-1">{userListByData?.user_profile?.organization_type?.name}</td>
          </tr> */}
          {userListByData?.event_participate?.map((eventInfoData: any, index: number) => {
                return (
                  <tr>
                    <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                    <td className="border border-gray-400 px-2 py-1">{eventInfoData?.event_detail?.event_name}</td>
                  </tr>
                )
              })}
        </tbody>
      </table>


    </div>

  )
}

export default UserListByIndustrySectorCluster