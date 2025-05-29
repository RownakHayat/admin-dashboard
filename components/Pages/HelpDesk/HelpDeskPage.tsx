"use client"
import React, { useEffect } from 'react'
import Sidebar from './Components/Sidebar/Sidebar'
import Content from './Components/Content/Content'

const HelpDeskPage = () => {

  return (
    <>
      <div className="grid grid-cols-12 gap-2 sm:gap-2 max-h-full min-h-fit">
          <div className="col-span-3 sm:col-span-4 md:col-span-4 lg:col-span-4 2xl:col-span-3">
            <Sidebar />
          </div>
          <div className="col-span-9 sm:col-span-8 md:col-span-8 lg:col-span-8 2xl:col-span-9">
            <Content />
          </div>
        </div>
    </>
  )
}

export default HelpDeskPage