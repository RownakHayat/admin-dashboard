import PaymentBkashNagadForm from "@/components/Pages/Payment/PaymentbKashNagadForm/paymentBkashNagadForm"
import { Suspense } from "react"
import Spinner from "@/components/common/Spinner/Spinner";

const PaymentFormPage = () => {
  return (
    <Suspense fallback={<div><Spinner/></div>}>
      <div>
        <PaymentBkashNagadForm /></div>
    </Suspense>
  )
}

export default PaymentFormPage