"use client"

import Notice from '@/components/home/notice/notice'
import AboutFoundation from '../aboutFoundation/aboutFoundation'
import TotalUsers from './TotalUsers'

const TotalUser = () => {
    return (
        <div className="grid grid-cols-12 rounded-lg gap-4">
            <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-8">
                <div className="bg-white rounded-lg border border-borderColor px-4 py-4  text-start shadow">
                    <TotalUsers />
                </div>

                <div className="bg-white border border-borderColor px-4 mt-4 rounded-lg text-start shadow">
                    <Notice />
                </div>
            </div>
            <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-4">
                <div className="bg-white rounded-lg border border-borderColor px-4 py-4 text-start shadow">
                    <AboutFoundation />
                </div>
            </div>

        </div>
    )
}

export default TotalUser