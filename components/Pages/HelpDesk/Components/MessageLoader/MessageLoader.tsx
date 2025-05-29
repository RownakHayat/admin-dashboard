import { Skeleton } from '@/components/ui/skeleton'

type Props = {
    length: number
}

const MessageLoder = ({ length }: Props) => {
    return (
        <div className=''>
            {[...Array(length || 5)].map((_: any, i: number) => (
                <div key={i} className="flex items-center space-x-4 my-2">
                    <Skeleton className="h-10 w-10 rounded-full bg-gray-300 dark:bg-slate-700" />
                    <div className="space-y-2 w-full">
                        <Skeleton className="h-8 w-11/12 bg-gray-300 dark:bg-slate-700" />
                        <Skeleton className="h-8 w-1/2 bg-gray-300 dark:bg-slate-700" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default MessageLoder