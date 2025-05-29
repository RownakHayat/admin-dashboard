import Image from "next/image"

const TotalUsers = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className='text-primary text-[22px]'>সর্বমোট ব্যবহারকারী</h2>
        <h2 className="border border-gray-400 text-gray-400 rounded-lg p-2">২০২৩-২০২৮</h2>
      </div>
      <div className="grid grid-cols-12 rounded-lg gap-4">
        <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-4">
          <div className="shadow-md rounded-lg overflow-hidden transform transition duration-500 hover:scale-105">
            <div className=" border border-borderColor px-4 py-4 rounded text-center shadow">
              <div className="flex flex-col items-center space-y-3">
                  <Image src="/assets/Image/Female.png" alt='' width={50} height={50} />
                  <div className="text-center">
                    <h5 className='text-[14px] font-bold text-[#353535]'>মহিলা</h5>
                    <h2 className='text-[#353535] text-[32px]'>২৩৪০</h2>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-4">
          <div className="shadow-md rounded-lg overflow-hidden transform transition duration-500 hover:scale-105">
            <div className=" border border-borderColor px-4 py-4 rounded text-center shadow">
              <div className=" flex flex-col items-center space-y-3">
                  <Image src="/assets/Image/Male.png" alt='' width={50} height={50} />
                  <div className="text-center">
                    <h5 className='text-[14px] font-bold text-[#353535]'>পুরুষ</h5>
                    <h2 className='text-[#353535] text-[32px]'>৫৬২০</h2>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-4">
          <div className="shadow-md rounded-lg overflow-hidden transform transition duration-500 hover:scale-105">
            <div className=" border border-borderColor px-4 py-4 rounded text-center shadow">
              <div className="flex flex-col items-center space-y-3">
                  <Image src="/assets/Image/Third Gender.png" alt='' width={50} height={50} />
                  <div className="text-center">
                    <h5 className='text-[14px] font-bold text-[#353535]'>তৃতীয় লিঙ্গ</h5>
                    <h2 className='text-[#353535] text-[32px]'>৩২০</h2>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TotalUsers