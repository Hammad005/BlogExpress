'use client';
import { Button, buttonVariants } from '@/components/ui/button';
import { userStore } from '@/store/userStore';
import { BookImage, Camera, Edit, EllipsisVertical, FileImage, Loader, Loader2, LogOut, Trash2, User, UserCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import ProfileBlogFeed from '@/components/ProfileBlogFeed';
import { toast } from 'sonner';


const Profile = () => {
  const { user, loading, logout, updateProfilePic, successLoading, deletePhotoLoading, deletePhoto } = userStore();
  const router = useRouter()
  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

  const handleImageUploadButton = useRef<HTMLInputElement | null>(null)
  const seeImageButton = useRef<HTMLButtonElement | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [openAlert, setOpenAlert] = useState(false)
  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // ✅ Validate file size
  if (file.size > 2.5 * 1024 * 1024) {
    toast.warning("File size exceeds 2.5MB. Please choose a smaller file.");
    return;
  }

  // ✅ Validate image type
  if (!file.type.startsWith("image/")) {
    toast.warning("Only image files are allowed.");
    return;
  }

  try {
    const reader = new FileReader();

    reader.onload = async () => {
      const base64Image = reader.result as string;

      try {
        await updateProfilePic({ profilePics: base64Image });
        toast.success("Profile picture uploaded successfully!");
      } catch (error) {
        toast.error("Failed to upload profile picture.");
        console.error("Upload error:", error);
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read the image.");
      console.error("FileReader error:", reader.error);
    };

    reader.readAsDataURL(file);
  } catch (err) {
    toast.error("Unexpected error during image handling.");
    console.error("Error:", err);
  }
};


  const handleDeletePhoto = async () => {
    if (selectedPhoto) {
      await deletePhoto(selectedPhoto);
    }
    if (!deletePhotoLoading) {
      setOpenAlert(false)
      setSelectedPhoto(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex-col md:flex-row items-center justify-between mb-6">
        <div className='flex flex-col md:flex-row md:items-center p-4 gap-4'>
          <div className='relative w-fit'>
            {user?.profilePics?.[0]?.profileImage ?
              <div className='relative flex justify-center items-center w-34 h-34 mr-4'>
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
                <div className='relative w-fit'>
                  <div className='bg-gray-200 animate-spin  w-34 h-34 overflow-hidden rounded-full ring-4 dark:ring-primary/50 ring-primary mr-4 '>
                    <div className='bg-gradient-to-b from-purple-900 to-primary/80 animate-spin size-7 rounded-full ' />
                  </div>
                  <div className="absolute  inset-y-0 w-34 h-34 flex justify-center items-center">
                    <User className="text-primary/80 size-28" />
                  </div>
                </div>
              </>
            }

            <div className='absolute inset-y-0 right-0 mr-5 mt-26 flex items-center'>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild className='flex text-center'>
                  <Button
                    size={"icon"}
                    variant={"outline"}
                    disabled={successLoading}
                    className='dark:text-primary dark:bg-gray-950 dark:hover:bg-gray-950/90 border text-primary cursor-pointer rounded-full'
                  >
                    {
                      successLoading || deletePhotoLoading ? <Loader className='animate-spin' /> : <Camera />
                    }
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Profile Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className='cursor-pointer' onClick={() => seeImageButton.current?.click()} disabled={!user?.profilePics?.[0]?.profileImage}>
                      <UserCircle2 className='text-primary' /> See profile pictures
                    </DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer' onClick={() => handleImageUploadButton.current?.click()}>
                      <BookImage className='text-primary' /> Choose profile picture
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <input
                type="file"
                accept='image/jpeg, image/png'
                hidden={true}
                ref={handleImageUploadButton}
                onChange={handlePictureChange}
              />
            </div>
          </div>


          <Dialog modal={false}>
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
                            <div className='absolute inset-y-0 right-0 h-fit m-1 mt-2'>
                              <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild className='flex text-center text-white cursor-pointer'>
                                  <EllipsisVertical className='size-3.5' />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <Link href={pic.profileImage || ""} target='_blank'>
                                    <DropdownMenuItem className='cursor-pointer text-xs hover:bg-background/10'>
                                      <FileImage className='text-primary' /> View Photo
                                    </DropdownMenuItem>
                                  </Link>
                                  <DropdownMenuItem
                                    className="cursor-pointer text-xs hover:bg-background/10"
                                    onClick={() => {
                                      setSelectedPhoto(pic.profileId || ""); // or pic.profileImage
                                      setOpenAlert(true);
                                    }}
                                    disabled={deletePhotoLoading}
                                  >
                                    <Trash2 className="text-primary" /> Delete Photo
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

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
          <AlertDialog open={openAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this photo?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action is permanent and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setOpenAlert(false)
                    setSelectedPhoto(null)
                  }}
                >Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeletePhoto}
                  disabled={deletePhotoLoading}
                >
                  {deletePhotoLoading ? <Loader2 className='animate-spin' /> : "Continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>


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
            <div className='flex md:justify-end items-end mt-2 gap-2'>
              <Link href={'/editProfile'} className={`${buttonVariants({ variant: "outline" })} text-accent-foreground`}><Edit className='text-primary' />Edit Profile</Link>
              <Button variant="outline" className={`text-accent-foreground cursor-pointer`} onClick={logout} disabled={loading}>
                {loading ? <Loader className="text-primary animate-spin" /> : <><LogOut className="text-primary" />Logout</>}
              </Button>
            </div>
          </div>
        </div>

      </div>
      <h2 className="text-2xl font-bold dark:text-accent-foreground text-gray-800 mb-4">My Blog Posts:</h2>
      
      <div className="space-y-6">
        <ProfileBlogFeed id={user?._id}/>

      </div>
    </div>
  );
}

export default Profile