'use client'
import { blogStore } from '@/store/blogStore'
import { Edit, Ellipsis, EllipsisVertical, Loader, MessageCircleMore, SendHorizonal, ThumbsUp, Trash2, User } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from './ui/button';
import { userStore } from '@/store/userStore';
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
import { useRouter } from 'next/navigation';
import { Textarea } from './ui/textarea';
import { commentStore } from '@/store/commentStore';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { likeStore } from '@/store/likeStore';


const ProfileBlogFeed = ({ id }: { id: object | undefined }) => {
    interface Blog {
        _id: object;
        blogPics?: [{
            picId?: string;
            picUrl?: string;
            dateTime?: Date;
        }];
        blogOwner?: {
            _id: object;
            name: string;
            profilePics?: [
                {
                    profileId?: string;
                    profileImage?: string;
                    dateTime?: Date;
                }
            ];
        };
        blogContent: string;
        blogCategory?: string;
        createdAt: Date;
        updatedAt: Date;
    }
    const { blogs, deleteBlog, deleteBlogLoading } = blogStore();
    const { user } = userStore();
    const userBlogs = blogs.filter((blog: Blog) => blog.blogOwner?._id === id);
    const { createComment, postCommentLoading, comments, deleteComment } = commentStore();
    const { likes, createLike, removeLike } = likeStore();

    const [expandedBlogId, setExpandedBlogId] = useState<object | null>(null);
    const lastPostId = blogs.length > 0 ? blogs[blogs.length - 1]._id : null;
    const isEndReached = blogs.length > 0 && blogs[blogs.length - 1]._id === lastPostId;
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
    const [openAlert, setOpenAlert] = useState(false)
    const [openTextArea, setOpenTextArea] = useState<object | null>(null)
    interface CommentData {
        blogOwner: string | object;
        commentBlog: string | object;
        comment: string;
    }

    const [commentData, setCommentData] = useState<CommentData>({ blogOwner: "", commentBlog: "", comment: "" });

    const handleDeleteBlog = async () => {
        if (selectedBlog) {
            await deleteBlog(selectedBlog);
            setOpenAlert(false);
            setSelectedBlog(null);
        }
    }
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createComment(commentData);
        setCommentData({ blogOwner: "", commentBlog: "", comment: "" });
    }
    const router = useRouter();
    const openCommentDialogRef = React.useRef<HTMLButtonElement>(null);
    const openLikeDialogRef = React.useRef<HTMLButtonElement>(null);



    const handleLike = async (blogId: object) => {
        const isLiked = likes?.filter(
            like => like.likeBlog === blogId && like.likeOwner?._id === user?._id
        ).length > 0;
        if (isLiked) {
            const likeToRemove = likes?.filter(like => like.likeBlog === blogId && like.likeOwner?._id === user?._id);

            if (likeToRemove) {
                if (likeToRemove.length > 0) {
                    await removeLike(likeToRemove[0]._id);
                }
            }
        }
        else {
            await createLike(blogId.toString());
        }
    };

    return (
        <>
            {userBlogs?.map((blog, index) => (
                <div key={index} className="p-4 border rounded-lg shadow-xl dark:shadow-2xl dark:shadow-primary/10">
                    <div className="flex flex-col space-y-3">
                        <div className='flex items-center gap-1'>
                            <div className='size-10 flex items-center'>
                                {blog.blogOwner?.profilePics?.[0]?.profileImage ?
                                    <Link
                                        href={user?._id === blog.blogOwner?._id ? `/profile` : `/viewProfile/${blog.blogOwner?._id}`}
                                    >
                                        <div className='relative flex justify-center items-center size-8'>
                                            <div className="absolute inset-0 flex justify-center items-center overflow-hidden rounded-full">
                                                <Image
                                                    src={blog.blogOwner?.profilePics?.[0]?.profileImage || ''}
                                                    alt="Profile-Pic"
                                                    width={100}
                                                    priority={false}
                                                    height={100}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className='bg-transparent size-8 overflow-hidden rounded-full ring-2 dark:ring-primary/50 ring-primary '>
                                            </div>
                                        </div>
                                    </Link>
                                    :
                                    <>
                                        <Link
                                            href={user?._id === blog.blogOwner?._id ? `/profile` : `/viewProfile/${blog.blogOwner?._id}`}
                                        >
                                            <div className='relative size-8 cursor-pointer'>
                                                <div className='bg-gray-200 size-8 overflow-hidden rounded-full ring-2 dark:ring-primary/50 ring-primary '>
                                                </div>
                                                <div className="absolute  inset-y-0 size-8 flex justify-center items-center">
                                                    <User className="text-primary/80 size-6" />
                                                </div>
                                            </div>
                                        </Link>
                                    </>
                                }
                            </div>
                            <div className='flex justify-between items-end w-full'>
                                <div>
                                    <Link
                                        href={user?._id === blog.blogOwner?._id ? `/profile` : `/viewProfile/${blog.blogOwner?._id}`}
                                    >
                                        <h2 className='text-lg font-semibold hover:underline'>{blog.blogOwner?.name}</h2>
                                    </Link>
                                    <p className='text-[0.70rem] text-gray-500'>{new Date(blog.createdAt).toLocaleDateString()} at {new Date(blog.createdAt).toLocaleTimeString()}</p>
                                </div>
                                <div className='flex flex-col items-end gap-3'>
                                    {user?._id === blog.blogOwner?._id && <DropdownMenu modal={false}>
                                        <DropdownMenuTrigger asChild className='flex text-center cursor-pointer'>
                                            <EllipsisVertical className='text-gray-500 size-5' />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>

                                            <DropdownMenuItem
                                                className="cursor-pointer text-xs hover:bg-background/10"
                                                onClick={() => {
                                                    router.push(`/editBlog/${blog._id}`)
                                                }}
                                            >
                                                <Edit className="text-primary" /> {(blog.blogPics?.length ?? 0) > 0 ? "Edit Description" : "Edit Blog"}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="cursor-pointer text-xs hover:bg-background/10"
                                                onClick={() => {
                                                    setOpenAlert(true)
                                                    setSelectedBlog(blog)
                                                }}
                                            >
                                                <Trash2 className="text-primary" /> Delete Blog
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>}
                                    <Link href={`category/${blog.blogCategory}`}>
                                    <h2 className='text-sm font-semibold hover:underline'>({blog.blogCategory})</h2>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className='p-4 border rounded-lg shadow flex flex-col gap-2'>
                                {blog.blogContent?.length > 350 ? (
                                    expandedBlogId === blog._id ? (
                                        <>
                                            <div className='editor-content' dangerouslySetInnerHTML={{ __html: blog.blogContent || "" }} />
                                            <span
                                                className='text-xs text-primary underline cursor-pointer'
                                                onClick={() => setExpandedBlogId(null)} // Collapse
                                            >
                                                Show Less
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <div className='editor-content' dangerouslySetInnerHTML={{ __html: blog.blogContent.slice(0, 350) || "" }} />
                                            <span
                                                className='text-xs text-primary underline cursor-pointer'
                                                onClick={() => setExpandedBlogId(blog._id)} // Expand only this blog
                                            >
                                                Read More
                                            </span>
                                        </>
                                    )
                                ) : (
                                    <div className='editor-content' dangerouslySetInnerHTML={{ __html: blog.blogContent || "" }} />
                                )}

                                <Carousel className="w-[90%]  flex justify-center mx-auto">
                                    <CarouselContent className='flex items-center'>
                                        {blog.blogPics?.map((pic) => (
                                            <CarouselItem key={pic.picId} className="relative">
                                                <Card className="bg-transparent border-none p-0 flex items-center justify-center rounded-none gap-0 shadow-none">
                                                    <CardContent className="p-0 flex items-center justify-center">
                                                        <div className='relative'>
                                                            <Link
                                                                href={pic.picUrl || ""}
                                                                target="_blank">
                                                                <Image
                                                                    src={pic.picUrl || ""}
                                                                    alt="Blog Image"
                                                                    priority={false}
                                                                    width={400}
                                                                    height={400}
                                                                    className="w-full h-auto object-cover"
                                                                />
                                                            </Link>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                                {(blog.blogPics?.length ?? 0) > 1 && <div className="flex justify-center mt-2 gap-2">
                                                    {blog.blogPics?.map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-2 h-2 rounded-full ${i === blog.blogPics?.indexOf(pic) ? 'bg-primary' : 'bg-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>}
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    {(blog.blogPics?.length ?? 0) > 1 &&
                                        (<>
                                            <CarouselPrevious className='hidden md:flex' />
                                            <CarouselNext className='hidden md:flex' />
                                        </>)}
                                </Carousel>
                            </div>
                            {user &&
                                <>
                                    <div className="p-2.5 border rounded-lg shadow flex items-center justify-between gap-2">
                                        <div className='flex items-center gap-2'>
                                            <Button variant='outline' size={"icon"} className='cursor-pointer overflow-hidden flex justify-start pl-2 hover:overflow-visible  hover:w-fit  hover:p-2'
                                                onClick={() => handleLike(blog._id)}
                                            >
                                                {
                                                    likes.some((like) => like.likeBlog === blog._id && like.likeOwner?._id === user?._id)
                                                        ?
                                                        <ThumbsUp className='size-5 text-primary dark:fill-primary/55 fill-primary/85' strokeWidth={2} absoluteStrokeWidth />
                                                        :
                                                        <ThumbsUp className='size-5 text-primary' strokeWidth={2} absoluteStrokeWidth />
                                                }
                                                <p className='text-sm font-semibold m-0'>Like</p>
                                            </Button>
                                            <Button variant='outline' size={"icon"} className='cursor-pointer overflow-hidden flex justify-start pl-2 hover:overflow-visible  hover:w-fit  hover:p-2'
                                                onClick={() => {
                                                    setOpenTextArea(openTextArea === blog._id ? null : blog._id)
                                                }}
                                            >
                                                {openTextArea === blog._id ?
                                                    <MessageCircleMore className='size-5 text-primary dark:fill-primary/40 fill-primary/70' strokeWidth={2} absoluteStrokeWidth />
                                                    :
                                                    <MessageCircleMore className='size-5 text-primary' strokeWidth={2} absoluteStrokeWidth />
                                                }
                                                <p className='text-sm font-semibold m-0'>Comment</p>
                                            </Button>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <Button className='p-0 h-fit text-sm font-semibold m-0 cursor-pointer hover:border-b hover:border-b-primary bg-transparent hover:bg-transparent rounded-none text-gray-600'
                                                disabled={likes.filter((like) => like.likeBlog === blog._id).length === 0}
                                                onClick={() => {
                                                    openLikeDialogRef.current?.click()
                                                    setSelectedBlog(blog)
                                                }}
                                            >
                                                <span className='text-primary'>{
                                                    likes.filter((like) => like.likeBlog === blog._id).length
                                                }</span> Likes
                                            </Button>
                                            <Button className='p-0 h-fit text-sm font-semibold m-0 cursor-pointer hover:border-b hover:border-b-primary bg-transparent hover:bg-transparent rounded-none text-gray-600'
                                                onClick={() => {
                                                    openCommentDialogRef.current?.click()
                                                    setSelectedBlog(blog)
                                                }
                                                }
                                                disabled={comments.filter((comment) => comment.commentBlog === blog._id).length === 0}
                                            >
                                                <span className='text-primary'>{
                                                    comments.filter((comment) => comment.commentBlog === blog._id).length
                                                }</span> Comments
                                            </Button>
                                        </div>
                                    </div>
                                    {openTextArea === blog._id &&
                                        <div className="p-2.5 border rounded-lg shadow">
                                            <form className='flex items-center justify-between gap-2' onSubmit={handleCommentSubmit}>
                                                <Textarea
                                                    placeholder='Write your comment'
                                                    required
                                                    onChange={(e) => setCommentData({ ...commentData, blogOwner: blog.blogOwner?._id || "", commentBlog: blog._id, comment: e.target.value })}
                                                    value={commentData.comment}
                                                />
                                                <Button
                                                    className='min-h-16 cursor-pointer'
                                                    type='submit'
                                                    disabled={postCommentLoading}
                                                >
                                                    {
                                                        postCommentLoading ? <Loader className='animate-spin' /> : <>
                                                            <SendHorizonal />
                                                        </>
                                                    }
                                                </Button>
                                            </form>
                                        </div>}
                                </>
                            }
                        </div>
                    </div>
                </div>
            ))}
            <AlertDialog open={openAlert} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete this blog?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action is permanent and cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                setOpenAlert(false)
                                setSelectedBlog(null)
                            }}
                            disabled={deleteBlogLoading}
                        >Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteBlog}
                            disabled={deleteBlogLoading}
                        >
                            {deleteBlogLoading ? <Loader className='animate-spin' /> : "Continue"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Dialog modal={false}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-7"
                        type="button"
                        hidden
                        ref={openCommentDialogRef}
                    >
                    </Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center">
                    <DialogTitle className="text-center text-lg font-semibold">Comments</DialogTitle>
                    <div className="flex flex-col gap-4 mt-4 w-full max-h-[400px] overflow-y-auto">
                        {comments.filter((comment) => comment.commentBlog === selectedBlog?._id).length > 0 ? (
                            comments.filter((comment) => comment.commentBlog === selectedBlog?._id).map((comment, index) => (
                                <div key={index} className="p-2 border rounded-lg shadow flex items-center gap-2">
                                    <div className='size-8'>
                                        {comment.commentOwner?.profilePics?.[0]?.profileImage ?
                                            <Link
                                                href={user?._id === comment.commentOwner?._id ? `/profile` : `/viewProfile/${comment.commentOwner?._id}`}
                                            >
                                                <div className='relative flex justify-center items-center size-8'>
                                                    <div className="absolute inset-0 flex justify-center items-center overflow-hidden rounded-full">
                                                        <Image
                                                            src={comment.commentOwner?.profilePics?.[0]?.profileImage || ''}
                                                            alt="Profile-Pic"
                                                            priority={false}
                                                            width={100}
                                                            height={100}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className='bg-transparent size-8 overflow-hidden rounded-full ring-2 dark:ring-primary/50 ring-primary '>
                                                    </div>
                                                </div>
                                            </Link>
                                            :
                                            <>
                                                <Link
                                                    href={user?._id === comment.commentOwner?._id ? `/profile` : `/viewProfile/${comment.commentOwner?._id}`}
                                                >
                                                    <div className='relative size-8 cursor-pointer'>
                                                        <div className='bg-gray-200 size-8 overflow-hidden rounded-full ring-2 dark:ring-primary/50 ring-primary '>
                                                        </div>
                                                        <div className="absolute  inset-y-0 size-8 flex justify-center items-center">
                                                            <User className="text-primary/80 size-6" />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </>
                                        }
                                    </div>
                                    <div className='flex flex-col w-full'>
                                        <div className='flex justify-between '>
                                            <div>
                                                <Link
                                                    href={user?._id === comment.commentOwner?._id ? `/profile` : `/viewProfile/${comment.commentOwner?._id}`}
                                                    className='w-fit'
                                                >
                                                    <h2 className='text-sm font-semibold hover:underline'>{comment.commentOwner?.name} {user?._id === comment.commentOwner?._id && "(You)"}</h2>
                                                </Link>
                                                <p className='text-[0.70rem] text-gray-500'>{new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString()}</p>
                                            </div>
                                            {(user?._id === comment.commentOwner?._id || user?._id === comment.blogOwner) && <DropdownMenu modal={false}>
                                                <DropdownMenuTrigger asChild className='flex text-center cursor-pointer'>
                                                    <Ellipsis className='text-gray-500 cursor-pointer size-4' />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer text-xs hover:bg-background/10"
                                                        onClick={() => {
                                                            deleteComment(comment._id);
                                                            openCommentDialogRef.current?.click();
                                                        }}
                                                    >
                                                        <Trash2 className="text-primary" /> Delete Comment
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>}
                                        </div>
                                        <Textarea
                                            className='w-full h-fit resize-none bg-gray-400/60 border-none min-h-fit'
                                            value={comment.comment}
                                            disabled
                                            placeholder='Write your comment'
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No comments yet.</p>
                        )}
                    </div>

                </DialogContent>
            </Dialog>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-7"
                        type="button"
                        hidden
                        ref={openLikeDialogRef}
                    >
                    </Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center">
                    <DialogTitle className="text-center text-lg font-semibold">Likes</DialogTitle>
                    <div className="flex flex-col gap-4 mt-4 w-full max-h-[400px] overflow-y-auto">
                        {likes?.filter((like) => like.likeBlog === selectedBlog?._id).length > 0 ? (
                            likes?.filter((like) => like.likeBlog === selectedBlog?._id).map((like, index) => (
                                <div key={index} className="p-2 border rounded-lg shadow flex items-center gap-2">
                                    <div className='size-8'>
                                        {like.likeOwner?.profilePics?.[0]?.profileImage ?
                                            <Link
                                                href={user?._id === like.likeOwner?._id ? `/profile` : `/viewProfile/${like.likeOwner?._id}`}
                                            >
                                                <div className='relative flex justify-center items-center size-8'>
                                                    <div className="absolute inset-0 flex justify-center items-center overflow-hidden rounded-full">
                                                        <Image
                                                            src={like.likeOwner?.profilePics?.[0]?.profileImage || ''}
                                                            alt="Profile-Pic"
                                                            priority={false}
                                                            width={100}
                                                            height={100}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className='bg-transparent size-8 overflow-hidden rounded-full ring-2 dark:ring-primary/50 ring-primary '>
                                                    </div>
                                                </div>
                                            </Link>
                                            :
                                            <>
                                                <Link
                                                    href={user?._id === like.likeOwner?._id ? `/profile` : `/viewProfile/${like.likeOwner?._id}`}
                                                >
                                                    <div className='relative size-8 cursor-pointer'>
                                                        <div className='bg-gray-200 size-8 overflow-hidden rounded-full ring-2 dark:ring-primary/50 ring-primary '>
                                                        </div>
                                                        <div className="absolute  inset-y-0 size-8 flex justify-center items-center">
                                                            <User className="text-primary/80 size-6" />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </>
                                        }
                                    </div>
                                    <div className='flex flex-col w-full'>
                                        <div className='flex justify-between '>
                                                <Link
                                                    href={user?._id === like.likeOwner?._id ? `/profile` : `/viewProfile/${like.likeOwner?._id}`}
                                                    className='w-fit'
                                                >
                                                    <h2 className='text-sm font-semibold hover:underline'>{like.likeOwner?.name} {user?._id === like.likeOwner?._id && "(You)"}</h2>
                                                </Link>
                                                <p className='text-[0.70rem] text-gray-500'>{new Date(like.createdAt).toLocaleDateString()} at {new Date(like.createdAt).toLocaleTimeString()}</p></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No Likes yet.</p>
                        )}
                    </div>

                </DialogContent>
            </Dialog>

            {isEndReached &&
                <div className='flex flex-col items-center justify-center mt-4'>
                    <p className="text-gray-500 border-b border-primary font-semibold">You&apos;ve reached the end of the blogs!</p>
                </div>}
        </>
    )
}

export default ProfileBlogFeed