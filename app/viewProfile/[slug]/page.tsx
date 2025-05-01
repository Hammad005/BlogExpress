'use client';
import { Button } from '@/components/ui/button';
import { userStore } from '@/store/userStore';
import { User } from 'lucide-react';
import Image from 'next/image';
import React, { useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import ProfileBlogFeed from '@/components/ProfileBlogFeed';

interface ViewProfileProps {
    params: Promise<{ slug: object | number }>;
}

const ViewProfile: React.FC<ViewProfileProps> = ({ params }) => {
    const { slug } = React.use(params);
    const { allUsers} = userStore();
    const user = allUsers?.find((user) => user._id === slug)
      const seeImageButton = useRef<HTMLButtonElement | null>(null)

      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex-col md:flex-row items-center justify-between mb-6">
            <div className='flex flex-col md:flex-row md:items-center p-4 gap-4'>
              <div className='relative w-fit'>
                {user?.profilePics?.[0]?.profileImage ?
                  <div className='relative flex justify-center items-center w-34 h-34 mr-4 rounded-full cursor-pointer' onClick={() => seeImageButton.current?.click()}>
                    <div className="absolute inset-0 flex justify-center items-center overflow-hidden rounded-full">
                      <Image
                        src={user?.profilePics?.[0]?.profileImage || ''}
                        alt="Profile-Pic"
                        priority={false}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className='bg-transparent animate-spin w-34 h-34 overflow-hidden rounded-full ring-4 dark:ring-primary/50 ring-primary '>
                      <div className='bg-gradient-to-b from-purple-900 to-primary/80 animate-spin size-7 rounded-full' />
                    </div>
                  </div>
                  :
                  <>
                    <div className='relative w-fit rounded-full mr-4'>
                      <div className='bg-gray-200 animate-spin  w-34 h-34 overflow-hidden rounded-full ring-4 dark:ring-primary/50 ring-primary'>
                        <div className='bg-gradient-to-b from-purple-900 to-primary/80 animate-spin size-7 rounded-full ' />
                      </div>
                      <div className="absolute inset-y-0 w-34 h-34 flex justify-center items-center">
                        <User className="text-primary/80 size-28" />
                      </div>
                    </div>
                  </>
                }
              </div>
    
    
              <Dialog >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-7"
                    type="button"
                    hidden
                    ref={seeImageButton}
                  >
                  </Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center">
                  <DialogTitle className='w-full text-primary'>{user?.name}</DialogTitle>
                  <Carousel className="w-full max-w-[20rem]">
                    <CarouselContent className='flex items-center'>
                      {user?.profilePics?.map((pic) => (
                        <CarouselItem key={pic.profileId} className='flex items-center justify-center'>
                          <Card className="bg-transparent border-none p-0 flex items-center justify-center rounded-none gap-0 shadow-none w-fit">
                            <CardContent className="p-0 flex items-center justify-center">
                              <div className='relative'>
                                <Image
                                  src={pic.profileImage || ""}
                                  alt="Profile Pic"
                                  width={400}
                                  height={400}
                                  priority={false}
                                  className="w-auto h-auto object-contain"
                                />
    
                              </div>
                            </CardContent>
                            <CardFooter className='flex justify-end w-full p-0 pt-2'>
                              <p className="text-xs text-primary/80 font-semibold">
                                {pic.dateTime
                                  ? new Date(user.createdAt).toLocaleString('en-US', {
                                    day: "2-digit",
                                    month: 'long',
                                    year: 'numeric',
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true
                                  })
                                  : "Date not available"}
                              </p>
                            </CardFooter>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {(user?.profilePics?.length ?? 0) > 1 &&
                      (<>
                        <CarouselPrevious />
                        <CarouselNext />
                      </>)}
                  </Carousel>
                  <DialogFooter>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
    
    
              <div className='w-full md:flex justify-between'>
                <div className='flex-col'>
                  <h1 className="text-3xl font-bold text-primary">{user?.name}</h1>
                  {user?.bio &&
                    <div className='text-gray-500 dark:text-accent-foreground text-sm pb-3' dangerouslySetInnerHTML={{ __html: user?.bio || "" }}></div>
                  }
                  <p className='text-primary font-semibold'>Joined:<span className="text-gray-500 pl-1 text-sm">
                    {user?.createdAt ?
                      new Date(user.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' })
                      : "Date not available"}
                  </span></p>
                </div>
              </div>
            </div>
    
          </div>
          <h2 className="text-2xl font-bold dark:text-accent-foreground text-gray-800 mb-4">{user?.name}&apos;s Blog Posts:</h2>
          
          <div className="space-y-6">
            <ProfileBlogFeed id={user?._id}/>
    
          </div>
          {/* {isEndReached && <p className="mt-4 text-green-600">You&apos;ve reached the end of the posts!</p>} */}
        </div>
      );
}

export default ViewProfile;