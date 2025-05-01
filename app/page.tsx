'use client'
import SkeletonForProfile from "@/components/SkeletonForProfile";
import { userStore } from "@/store/userStore";
import { Bold, BookImage, Heading, Heading1, Heading2, Heading3, Italic, Link2, Loader, Underline, User, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import LiveTime from "@/components/LiveTime";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { blogStore } from "@/store/blogStore";
import BlogFeed from "@/components/BlogFeed";
import { commentStore } from "@/store/commentStore";
import { likeStore } from "@/store/likeStore";


export default function Home() {
  const { createBlog, blogLoading, fetchBlogs, fetchBlogLoading } = blogStore()
  const router = useRouter()
  const { user, getAllUsers } = userStore()
  const handleGoToProfile = () => {
    router.push('/profile');
  }
  const openPostDialog = useRef<HTMLButtonElement | null>(null)
  const openImageInput = useRef<HTMLInputElement | null>(null)
  const submitButton = useRef<HTMLInputElement | null>(null)

  const [blogData, setBlogData] = useState<{ blogPics: string[]; blogContent: string; blogCategory: string }>({
    blogPics: [],
    blogContent: "",
    blogCategory: "",
  });
  const [open, setOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  const [urlLink, setUrlLink] = useState("")


  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedSelection(selection.getRangeAt(0));
    }
  };
  const restoreSelection = () => {
    const selection = window.getSelection();
    if (savedSelection && selection) {
      selection.removeAllRanges();
      selection.addRange(savedSelection);
    }
  };
  const handleLink = () => {
    const link = urlLink;
    if (link) {
      restoreSelection()
      execCommand("createLink", link)
      setOpen(false)
    }
  }
  const execCommand = (command: string, value?: string) => {
    const selection = window.getSelection();
    const editor = editorRef.current;

    if (!editor) return;

    // If editor is empty (for commands that require content)
    if (command !== "createLink" && editor.innerText.trim() === '') {
      toast.warning("Field is empty. Write something first.");
      return;
    }

    if (command === "createLink" && value) {
      document.execCommand(command, false, value);

      // Update links in the editor after executing the command
      const links = editor.querySelectorAll("a");
      links.forEach((link: HTMLAnchorElement) => {
        if (link.href == value) {
          // Set target="_blank" and rel="noopener noreferrer" attributes
          link.setAttribute("target", "_blank");
          link.setAttribute("rel", "noopener noreferrer");
        }
      });

      // Reflect the changes in the state (editData.bio)
      setBlogData({ ...blogData, blogContent: editor.innerHTML });
    }
    else if (selection && !selection.isCollapsed) {
      document.execCommand(command, false, value);
    }
    else {
      toast.warning("No text selected.");
    }

    editor.focus();
  };

  useEffect(() => {
    getAllUsers()
    fetchBlogs()
  }, [getAllUsers, fetchBlogs])

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = blogData.blogContent || "";
    }
  }, []); // don't include editData.bio here to avoid cursor jump on every keystroke

  const handleInput = () => {
    if (editorRef.current) {
      const cleanedBio = editorRef.current?.innerHTML.replace(/<br\s*\/?>/g, '');
      setBlogData({ ...blogData, blogContent: cleanedBio });
    }
  };

  const handleBlogPics = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 6) {
      toast.warning("You can upload a maximum of 6 images.");
      return;
    }
    if (blogData.blogPics.length + (files ? files.length : 0) > 6) {
      toast.warning("You can upload a maximum of 6 images.");
      return;
    }
    if (!files || files.length === 0) return;

    const fileReaders: Promise<string>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      const filePromise = new Promise<string>((resolve) => {
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });

      fileReaders.push(filePromise);
    }

    Promise.all(fileReaders).then((base64Images) => {
      setBlogData((prevData) => ({
        ...prevData,
        blogPics: [...prevData.blogPics, ...base64Images],
      }));
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (blogData.blogPics.length === 0 && blogData.blogContent.trim() === "") {
      toast.warning("Please write something or upload images before posting.");
      return;
    }
    if (!blogData.blogCategory) {
      toast.warning("Please select a category.");
      return;
    }
    await createBlog(blogData);
    setBlogData({
      blogPics: [],
      blogContent: "",
      blogCategory: "",
    });
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
    if (openPostDialog.current) {
      openPostDialog.current.click();
    }
  };

  const { fetchComments, } = commentStore();
  const { fetchLikes } = likeStore();
  useEffect(() => {
    if (user) {
      fetchComments()
      fetchLikes()
    }
  },[user, fetchComments, fetchLikes])


  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          <h1 className="text-xl md:text-2xl font-bold text-center text-accent-foreground/40 dark:text-neutral-50 text-shadow-lg">Welcome to <span className="text-primary animate-pulse">BlogExpress</span></h1>
          {user && <>
            <div className="border rounded-full p-4 min-h-20 flex items-center justify-between shadow-xl dark:shadow-2xl dark:shadow-primary/10">

              {user?.profilePics?.[0]?.profileImage ?
                <div className='relative flex justify-center items-center w-10 md:w-14 h-10 md:h-14 mr-4 cursor-pointer' onClick={handleGoToProfile}>
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
                  <div className='bg-transparent animate-spin w-10 md:w-14 h-10 md:h-14 overflow-hidden rounded-full ring-2 dark:ring-primary/50 ring-primary '>
                    <div className='bg-gradient-to-b from-purple-900 to-primary/80 animate-spin size-2.5 md:size-3 rounded-full' />
                  </div>
                </div>
                :
                <>
                  <div className='relative w-10 md:w-14 mr-4 cursor-pointer' onClick={handleGoToProfile}>
                    <div className='bg-gray-200 animate-spin  w-10 md:w-14 h-10 md:h-14 overflow-hidden rounded-full ring-2 dark:ring-primary/50 ring-primary mr-4 '>
                      <div className='bg-gradient-to-b from-purple-900 to-primary/80 animate-spin size-2.5 md:size-3 rounded-full ' />
                    </div>
                    <div className="absolute  inset-y-0 w-10 md:w-14 h-10 md:h-14 flex justify-center items-center">
                      <User className="text-primary/80 size-8 md:size-12" />
                    </div>
                  </div>
                </>
              }
              <div className="border border-primary/30 bg-input/50 hover:bg-input rounded-full w-full p-4 pl-5 text-xs md:text-[1rem] text-accent-foreground/40 cursor-pointer" onClick={() => openPostDialog?.current?.click()}>
                What&apos;s on your mind, {(user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase() : 'Guest')}?
              </div>

            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="size-7"
                  type="button"
                  hidden
                  ref={openPostDialog}
                >
                </button>
              </DialogTrigger>
              <DialogContent className="flex flex-col max-h-[90vh] overflow-y-auto p-4 sm:max-w-lg w-full">
                <DialogTitle className="text-lg text-primary dark:text-neutral-50 font-semibold flex items-center">
                  {user?.profilePics?.[0]?.profileImage ?
                    <div className='relative flex justify-center items-center w-10 md:w-14 h-10 md:h-14 mr-4 cursor-pointer' onClick={handleGoToProfile}>
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
                      <div className='bg-transparent animate-spin w-10 md:w-14 h-10 md:h-14 overflow-hidden rounded-full ring-2 dark:ring-primary/50 ring-primary '>
                        <div className='bg-gradient-to-b from-purple-900 to-primary/80 animate-spin size-2.5 md:size-3 rounded-full' />
                      </div>
                    </div>
                    :
                    <>
                      <div className='relative w-10 md:w-14 mr-4 cursor-pointer' onClick={handleGoToProfile}>
                        <div className='bg-gray-200 animate-spin  w-10 md:w-14 h-10 md:h-14 overflow-hidden rounded-full ring-2 dark:ring-primary/50 ring-primary mr-4 '>
                          <div className='bg-gradient-to-b from-purple-900 to-primary/80 animate-spin size-2.5 md:size-3 rounded-full ' />
                        </div>
                        <div className="absolute  inset-y-0 w-10 md:w-14 h-10 md:h-14 flex justify-center items-center">
                          <User className="text-primary/80 size-8 md:size-12" />
                        </div>
                      </div>
                    </>
                  }
                  <div className="flex flex-col">
                    {user?.name}
                    <LiveTime />
                  </div>
                </DialogTitle>
                <Card>
                  <form onSubmit={handleSubmit}>
                    <div className='flex-col'>

                      <div className="relative">
                        {/* Optional placeholder */}
                        {!blogData.blogContent && (
                          <div className="pointer-events-none absolute top-2 left-3 text-muted-foreground z-10">
                            What&apos;s on your mind, {(user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase() : 'Guest')}?
                          </div>
                        )}

                        <div
                          ref={editorRef}
                          contentEditable
                          suppressContentEditableWarning
                          className="px-3 py-2 editor-content focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-20 w-full rounded p-2 outline-none border-none whitespace-pre-wrap break-words"
                          aria-label="Blog content editor"
                          onInput={handleInput}
                        ></div>
                      </div>
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col justify-between items-start">
                          <Button
                            variant="outline"
                            className="m-2"
                            type="button"
                            onClick={() => openImageInput.current?.click()}
                          >
                            <BookImage /> Upload Images
                          </Button>
                          <div className="grid grid-cols-3 gap-2 m-2">
                            {blogData.blogPics.map((image, index: number) => (
                              <div key={index} className="relative">
                                <div className="w-12 h-12 ">
                                  <Image
                                    src={image}
                                    alt={`Blog Image ${index + 1}`}
                                    priority={false}
                                    fill
                                    className="object-cover animate-pulse"
                                  />
                                </div>
                                <div className="absolute inset-y-0 right-0">
                                  <div
                                    className={`size-4 rounded-full bg-primary border flex items-center justify-center border-primary/50 hover:bg-primary/50 cursor-pointer ${blogLoading && "cursor-not-allowed"}`}
                                    onClick={() => {
                                      setBlogData((prevData) => ({
                                        ...prevData,
                                        blogPics: prevData.blogPics.filter((_, i) => i !== index),
                                      }));
                                    }}
                                  >
                                    <X className="size-2" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex p-2 gap-2 flex-col">
                          <div className="flex  gap-2">

                            <Button
                              variant="outline"
                              size="icon"
                              className="size-7"
                              type="button"
                              onClick={() => execCommand("bold")}
                            >
                              <Bold />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-7"
                              type="button"
                              onClick={() => execCommand("italic")}
                            >
                              <Italic />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-7"
                              type="button"
                              onClick={() => execCommand("underline")}
                            >
                              <Underline />
                            </Button>
                            <Dialog open={open} onOpenChange={setOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="size-7"
                                  type="button"
                                  onClick={saveSelection}
                                >
                                  <Link2 />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Add Link</DialogTitle>
                                  <DialogDescription>
                                    Enter the link you want to add
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-right">
                                      Link
                                    </Label>
                                    <Input id="username" placeholder='Enter the link you want to add' className="col-span-3" onChange={(e) => setUrlLink(e.target.value)} />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button type="submit" onClick={handleLink}>Save changes</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Select onValueChange={(value) => {
                              execCommand("formatBlock", value);
                            }}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Headings" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="h1"><Heading1 className="size-6" /> Heading 1</SelectItem>
                                <SelectItem value="h2"><Heading2 className="size-5" /> Heading 2</SelectItem>
                                <SelectItem value="h3"><Heading3 className="size-4" /> Heading 3</SelectItem>
                                <SelectItem value="p"><Heading className="size-3" /> Normal</SelectItem>
                              </SelectContent>
                            </Select>

                            <Select onValueChange={(value) =>
                              setBlogData((prevData) => ({
                                ...prevData,
                                blogCategory: value,
                              }))
                            }>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Tech" className="hover:cursor-pointer">Tech</SelectItem>
                                <SelectItem value="Fitness" className="hover:cursor-pointer">Fitness</SelectItem>
                                <SelectItem value="Travel" className="hover:cursor-pointer">Travel</SelectItem>
                                <SelectItem value="Food" className="hover:cursor-pointer">Food</SelectItem>
                                <SelectItem value="Business" className="hover:cursor-pointer">Business</SelectItem>
                                <SelectItem value="Education" className="hover:cursor-pointer">Education</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <input
                      type="file"
                      multiple
                      ref={openImageInput}
                      onChange={handleBlogPics}
                      accept='image/jpeg, image/png'
                      hidden />
                    <input type="submit" ref={submitButton} hidden />
                  </form>
                </Card>
                <DialogFooter>
                  <Button type="button" className="w-full cursor-pointer uppercase" disabled={blogLoading} onClick={() => submitButton.current?.click()}>
                    {blogLoading ? (<><Loader className="animate-spin" /> Posting...</>) : "Post"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>}

          {fetchBlogLoading ? <SkeletonForProfile /> :
            <BlogFeed />
          }
        </div>
      </div>
    </>
  );
}
