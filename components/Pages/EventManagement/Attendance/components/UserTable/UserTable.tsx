import React from 'react'

const UserTable = ({ userData, organizationShow }: any) => {


  return (
    <>
      {
        userData?.length > 0 ? <>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-300 text-center">
                <th className="border border-gray-400 px-2 py-1">Sl</th>
                <th className="border border-gray-400 px-2 py-1">Name</th>
                <th className="border border-gray-400 px-2 py-1">Mobile</th>
                <th className="border border-gray-400 px-2 py-1">Email</th>
                {
                  organizationShow && <th className="border border-gray-400 px-2 py-1">Organization</th>
                }
                <th className="border border-gray-400 px-2 py-1">Attendance</th>

              </tr>

            </thead>
            <tbody className=''>
              {userData?.map((row: any, index: any) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                  <td className="border border-gray-400 px-2 py-1">{row?.name}</td>
                  <td className="border border-gray-400 px-2 py-1">{row?.mobile}</td>
                  <td className="border border-gray-400 px-2 py-1">{row?.email}</td>
                  {
                    organizationShow && <td className="border border-gray-400 px-2 py-1">{row?.organization}</td>
                  }
                  <td className="border border-gray-400 px-2 py-1">{row?.attendance}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </> : <>
          <p>No Data Found</p>
        </>
      }

    </>
  )
}

export default UserTable
