
export const ActiveEvent  = () => {
 return(
  <>
  <div className="bg-white p-4 rounded-lg shadow-md">
  <h2 className="text-xl font-bold mb-4">Active Event</h2>
  <div className="relative w-full h-full">
      <img
        className="w-full h-full object-cover"
        src="path/to/your/map.png" // Replace with your map image path
        alt="Bangladesh map"
      />
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <div className="text-xl font-bold text-white">Active Events</div>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center text-white">
            <span>ডিজিটাল মার্কেটিং বিষয়ক প্রশিক্ষণ</span>
            <span>01/11/2022</span>
          </div>
          <div className="flex justify-between items-center text-white">
            <span>এ.আই টুলস ব্যবহারে উদ্যোগতাদের উদ্বুদ্ধকরন</span>
            <span>01/11/2022</span>
          </div>
          {/* ... more event details */}
        </div>
        <div className="text-xl font-bold text-white">Divisions</div>
        {/* ... division labels */}
      </div>
    </div>
</div>
  </>
 )
}

export default ActiveEvent  