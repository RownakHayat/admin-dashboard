'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'

import FormContainer from '@/components/common/Form/FormContainer'
import FormInput from '@/components/common/Form/FormInput'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
    email: z
        .string()
        .min(3, { message: "Email must be at least 3 characters long." })
        .refine(
            (value) => /^\d+$/.test(value) || /\S+@\S+\.\S+/.test(value),
            { message: "Invalid email format or not a valid number." }
        ),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
})

type Props = {
    setIsRegistering?: (val: boolean) => void
}

const LoginForm = ({ setIsRegistering }: Props) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [errorMessages, setErrorMessages] = useState<string[]>([])

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmitLogin = (values: z.infer<typeof formSchema>) => {
        // Fake logic (no dispatch)
        if (values.email === '123456' && values.password === 'password') {
            router.push('/admin')
        } else {
            setErrorMessages(['Invalid mobile number or password'])

            setTimeout(() => {
                setErrorMessages([])
            }, 3000)
        }
    }


    useEffect(() => {
        if (errorMessages.length > 0) {
            const timer = setTimeout(() => setErrorMessages([]), 3000)
            return () => clearTimeout(timer)
        }
    }, [errorMessages])



    return (
        <>
            <h5 className="text-primary font-bold text-[20px] mb-3">Sign In</h5>

            <FormContainer form={form} onSubmit={form.handleSubmit(onSubmitLogin)} autoComplete="off">
                <div className="w-full">
                    <FormInput
                        name="email"
                        label="Mobile or Email"
                        placeholder="Enter Your Mobile Number or Email"
                        className="bg-white w-full rounded border border-[#Gray-sd-1]"
                    />

                    <div className="flex justify-between relative mt-3">
                        <FormInput
                            type={isPasswordVisible ? 'text' : 'password'}
                            name="password"
                            label="Password"
                            placeholder="Enter Your Password"
                            className="bg-white w-full rounded border border-[#Gray-sd-1]"
                        />
                        <span
                            className="cursor-pointer p-3 absolute top-7 right-2"
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                            {isPasswordVisible ? <EyeOff /> : <Eye />}
                        </span>
                    </div>

                    {/* {errorMessages.length > 0 && (
  <div className="text-red-500 text-sm mb-2 mt-2">
    {errorMessages.map((msg, idx) => (
      <div key={idx}>{msg}</div>
    ))}
  </div>
)} */}


                    <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50"
                            />
                            <label htmlFor="remember" className="ms-2 text-[12px] text-gray-900">
                                Remember me
                            </label>
                        </div>

                        <button type="button" className="text-primary text-[12px] underline">
                            Forgot Password
                        </button>
                    </div>

                    <div className="grid grid-cols-12 gap-3 mt-3">
                        <div className="col-span-12 xl:col-span-6">
                            <Button
                                type="submit"
                                className="bg-[#0CB04D] hover:bg-primary w-full text-white py-1 text-sm rounded"
                            >
                                Sign In
                            </Button>
                        </div>
                        <div className="col-span-12 xl:col-span-6">
                            <Button
                                type="button"
                                onClick={() => setIsRegistering?.(true)}
                                className="bg-[#2b51b2] hover:bg-[#2b51b2] w-full text-white py-1 text-sm rounded"
                            >
                                Create an account
                            </Button>
                        </div>
                    </div>
                </div>
            </FormContainer>

            <p className="text-sm text-red-600 pt-5 font-bold w-full">
                এসএমই ফাউন্ডেশনের সেবা গ্রহণের জন্য ‘Create an account’ এর মাধ্যমে অন্তর্ভুক্ত হবার জন্য আপনাকে অনুরোধ করা হলো।
                ইতিমধ্যে এই প্ল্যাটফর্মে অন্তর্ভুক্ত হয়ে থাকলে 'Sign In' করুন।
            </p>
        </>
    )
}

export default LoginForm
