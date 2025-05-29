import * as Dialog from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"

const FeedbackDescription = ({ open, setOpen, data }: any) => {
  
  return (
    <>
      <Dialog.Root open={open && data} onOpenChange={setOpen}>
        <Dialog.Portal>
          {/* <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" /> */}
          <Dialog.Content className="bg-white data-[state=open]:animate-contentShow overflow-auto fixed top-[50%] lg:left-[50%] h-[50vh] sm:w-[350px] lg:w-[40vw] lg:translate-x-[-50%] translate-y-[-50%] rounded-[6px p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            {/* <Dialog.Title>
              <p className='text-[#4B5563] text-[18px] font-[500] my-3'></p>
            </Dialog.Title> */}
            <div className='sm:w-[350px] lg:w-full'>

              <div className="grid grid-cols-4 gap-4 pb-3">
                <div className='flex justify-between'>
                  <p className="text-nowrap">User Name</p>
                  <p>:</p>
                </div>
                <div>
                  <p className=' text-[#545454] text-nowrap'>{data?.user?.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 pb-3">
                <div className='flex justify-between text-nowrap'>
                  <p>Division</p>
                  <p>:</p>
                </div>
                <div>
                  <p className=' text-[#545454] text-nowrap'>{data?.user?.user_profile?.division?.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 pb-3">
                <div className='flex justify-between text-nowrap'>
                  <p>District</p>
                  <p>:</p>
                </div>
                <div>
                  <p className=' text-[#545454] text-nowrap'>{data?.user?.user_profile?.district?.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 pb-3 text-nowrap">
                <div className='flex justify-between text-nowrap'>
                  <p>Upzila</p>
                  <p>:</p>
                </div>
                <div>
                  <p className=' text-[#545454] text-nowrap'>{data?.user?.user_profile?.upazila?.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 pb-3 text-nowrap">
                <div className='flex justify-between text-nowrap'>
                  <p>Mobile No</p>
                  <p>:</p>
                </div>
                <div>
                  <p className=' text-[#545454] text-nowrap'>{data?.user?.mobile}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 border-t-2 border-b-2 p-3 pl-0 ">
                <div className="text-[#545454] font-semibold gap-2 ">
                  <h4>Subject</h4>
                  <h3 className="text-[#666666] break-words">{data?.subject}</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 pt-3">
                <div className="text-[#545454] font-semibold gap-2">
                  <h4 className="text-[#545454] font-semibold">Description</h4>
                  <p className="text-[#666666] break-words">{data?.description}</p>
                </div>
              </div>

            </div>


            <Dialog.Close asChild>
              <button
                onClick={() => setOpen(!open)}
                className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </>

  )
}

export default FeedbackDescription
