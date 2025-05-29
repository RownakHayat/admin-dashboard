import { Input } from '@/components/ui/input'
import React from 'react'

const Search = ({ change }: any) => {
    return (
        <div className='py-4 px-2'>
            <Input placeholder='Search ..' onChange={change} className='bg-white px-3' />
        </div>
    )
}

export default Search