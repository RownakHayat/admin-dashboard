import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

type PaymentApplicationProps = {
  isOpen: boolean;
  onClose: () => void;
  status: string | null;
  data: any;
};

const PaymentApplication: React.FC<PaymentApplicationProps> = ({
  isOpen,
  onClose,
  status,
  data,
}) => {


  const router = useRouter();

  const handleClick = (id:any) => {
    router.push(`/admin/payment/payment-form?id=${id}`);
  };


  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[75%]">
          <DialogTitle>Application payment</DialogTitle>


          <div className="flex flex-col items-center justify-center text-center w-full h-full mt-8">
            <Image
              priority={true}
              src="/assets/Image/clock.png"
              alt="Logo"
              width={1000}
              height={1000}
              className="w-[200px] mb-4"
            />
            <h2 className="text-[22px]">Waiting For Selection</h2>
            <Button onClick={() => handleClick(data?.id)} className="font-bold text-primary border-primary border mt-2 ">
              Pay Now
            </Button>
          </div>

          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
          <Button onClick={onClose}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentApplication;
