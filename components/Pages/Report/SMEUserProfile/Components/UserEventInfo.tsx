
const UserEventInfoComponent = ({ userData }: any) => {

  return (
    <div>
      <>
        <div>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-300 text-center">
                <th rowSpan={3} className="border border-gray-400 px-2 py-1">SL</th>
                <th rowSpan={3} className="border border-gray-400 px-2 py-1">Event Name</th>
              </tr>
            </thead>
            <tbody className=''>
              {userData?.event_participate?.map((eventInfoData: any, index: number) => {
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
      </>
    </div>
  )
}

export default UserEventInfoComponent