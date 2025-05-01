import React from 'react'
import { Skeleton } from './ui/skeleton'

const SkeletonForProfile = () => {
  return (
    <>
      <div className="p-4 border rounded-lg shadow-xl dark:shadow-2xl dark:shadow-primary/10">
        <div className="flex flex-col space-y-3">
          <div className='flex  gap-2'>
            <Skeleton className="size-7 rounded-full" />
            <div className='flex flex-col gap-2'>
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
          </div>
          <div className="space-y-2">
            <div className='p-4 border rounded-lg shadow flex flex-col gap-2'>
              <Skeleton className="h-7 w-45" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 border rounded-lg shadow-xl dark:shadow-2xl dark:shadow-primary/10">
        <div className="flex flex-col space-y-3">
          <div className='flex  gap-2'>
            <Skeleton className="size-7 rounded-full" />
            <div className='flex flex-col gap-2'>
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
          </div>
          <div className="space-y-2">
            <div className='p-4 border rounded-lg shadow flex flex-col gap-2'>
              <Skeleton className="h-7 w-45" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-[325px] w-full rounded-ms" />
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default SkeletonForProfile