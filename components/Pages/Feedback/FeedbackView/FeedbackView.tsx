import * as Dialog from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"

const FeedbackView = ({ data }: any) => {
    return (
        <div className='w-full'>
            <div className=''>
                <Dialog.Close asChild>
                    <button
                        className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                        aria-label="Close"
                    >
                        <Cross2Icon />
                    </button>
                </Dialog.Close>
            </div>
            <div className='grid grid-cols-1 p-3 bg-[#FCFCFC] text-[#BDBEC0] rounded-lg mb-5 space-y-4'>

                <div className="grid grid-cols-4 gap-4">
                    <div className='flex justify-between'>
                        <p>User Name</p>
                        <p>:</p>
                    </div>
                    <div>
                        <p className=' text-[#545454]'>User 1</p>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <div className='flex justify-between'>
                        <p>Division</p>
                        <p>:</p>
                    </div>
                    <div>
                        <p className=' text-[#545454]'>Dhaka</p>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <div className='flex justify-between'>
                        <p>District</p>
                        <p>:</p>
                    </div>
                    <div>
                        <p className=' text-[#545454]'>Dhaka</p>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <div className='flex justify-between'>
                        <p>Upzila</p>
                        <p>:</p>
                    </div>
                    <div>
                        <p className=' text-[#545454]'>Gazipur</p>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <div className='flex justify-between'>
                        <p>Mobile No</p>
                        <p>:</p>
                    </div>
                    <div>
                        <p className=' text-[#545454]'>{data?.received_qty}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 border-t-2 border-b-2 p-3 ">
                    <div className="text-[#545454] font-semibold flex gap-2">
                        <h3>Subject</h3>
                        <p>:</p>
                        <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h3>
                    </div>
                </div>
                <div className="grid grid-cols-1 ">
                    <h4 className="text-[#545454] font-semibold">Description :</h4>
                    <p className="text-[#666666] flex text-justify">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam voluptates explicabo modi sint saepe. Omnis vel fugiat porro molestiae dicta hic inventore, numquam quia at reiciendis quod. Quod, nam nostrum?</p>
                </div>
            </div>
        </div>
    )
}

export default FeedbackView
