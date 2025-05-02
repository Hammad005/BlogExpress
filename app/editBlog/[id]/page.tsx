"use client";
import { blogStore } from "@/store/blogStore";
import {
    Bold,
    Heading,
    Heading1,
    Heading2,
    Heading3,
    Italic,
    Link2,
    Loader,
    Underline,
    User,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { userStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
interface EditBlogProps {
    params: Promise<{ id: object }>;
}

const EditBlog: React.FC<EditBlogProps> = ({ params }) => {
    const { id } = React.use(params);
    const { blogs, updateBlog, updateBlogLoading } = blogStore();
    const { user } = userStore();
    const router = useRouter();
    const blog = blogs.find((blog) => blog._id === id);
    const [blogData, setBlogData] = useState(blog);
    const [open, setOpen] = useState(false);
    const [savedSelection, setSavedSelection] = useState<Range | null>(null);
    const [urlLink, setUrlLink] = useState("");
    const submitButton = useRef<HTMLInputElement | null>(null);

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
            restoreSelection();
            execCommand("createLink", link);
            setOpen(false);
        }
    };
    useEffect(() => {
        if (!user || !blogs) {
            router.push("/");
        }
    }, [user, blogs, router]);

    useEffect(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = blogData?.blogContent || "";
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    const editorRef = useRef<HTMLDivElement>(null);

    const handleInput = () => {
        if (editorRef.current) {
            const cleanedBio = editorRef.current?.innerHTML.replace(
                /<br\s*\/?>/g,
                ""
            );
            setBlogData((prevData) => prevData ? { ...prevData, blogContent: cleanedBio } : undefined);
        }
    };

    const execCommand = (command: string, value?: string) => {
        const selection = window.getSelection();
        const editor = editorRef.current;

        if (!editor) return;

        // If editor is empty (for commands that require content)
        if (command !== "createLink" && editor.innerText.trim() === "") {
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
            setBlogData((prevData) => prevData ? { ...prevData, blogContent: editor.innerHTML } : prevData);
        } else if (selection && !selection.isCollapsed) {
            document.execCommand(command, false, value);
        } else {
            toast.warning("No text selected.");
        }

        editor.focus();
    };
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if ((blog?.blogPics?.length || 0) === 0 && blogData?.blogContent.trim() === "") {
            toast.warning("Please write something before updating blog.");
            return;
          }
          if (!blogData?.blogCategory) {
            toast.warning("Please select a category.");
            return;
          }
          await updateBlog(blogData);
          router.back();
    };
    return (
        <>
            <div className="max-w-4xl mx-auto p-6">
                <div className="space-y-6">
                    <div className="flex justify-center items-center mb-4">
                        <h1 className="text-5xl font-bold uppercase text-primary">
                            Edit Blog
                        </h1>
                    </div>
                    <div className="p-4 border rounded-lg shadow-xl dark:shadow-2xl dark:shadow-primary/10">
                        <div className="flex flex-col space-y-3">
                            <div className="flex items-center gap-1">
                                <div className="size-10 flex items-center">
                                    {blog?.blogOwner?.profilePics?.[0]?.profileImage ? (
                                        <Link href={`/profile`}>
                                            <div className="relative flex justify-center items-center size-8">
                                                <div className="absolute inset-0 flex justify-center items-center overflow-hidden rounded-full">
                                                    <Image
                                                        src={
                                                            blog.blogOwner?.profilePics?.[0]?.profileImage ||
                                                            ""
                                                        }
                                                        alt="Profile-Pic"
                                                        priority={false}
                                                        width={100}
                                                        height={100}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="bg-transparent size-8 overflow-hidden rounded-full ring-2 dark:ring-primary/50 ring-primary "></div>
                                            </div>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href={`/profile`}>
                                                <div className="relative size-8 cursor-pointer">
                                                    <div className="bg-gray-200 size-8 overflow-hidden rounded-full ring-2 dark:ring-primary/50 ring-primary "></div>
                                                    <div className="absolute  inset-y-0 size-8 flex justify-center items-center">
                                                        <User className="text-primary/80 size-6" />
                                                    </div>
                                                </div>
                                            </Link>
                                        </>
                                    )}
                                </div>
                                <div className="flex justify-between items-end w-full">
                                    <div>
                                        <Link href={`/profile`}>
                                            <h2 className="text-lg font-semibold hover:underline">
                                                {blog?.blogOwner?.name}
                                            </h2>
                                        </Link>
                                        <p className="text-[0.70rem] text-gray-500">
                                            {blog?.createdAt
                                                ? `${new Date(
                                                    blog.createdAt
                                                ).toLocaleDateString()} at ${new Date(
                                                    blog.createdAt
                                                ).toLocaleTimeString()}`
                                                : "Date not available"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="p-4 border rounded-lg shadow flex flex-col gap-2">
                                    <form onSubmit={handleSubmit}>
                                        <div className="flex-col">
                                            <div className="relative">
                                                {/* Optional placeholder */}
                                                {!blogData?.blogContent && (
                                                    <div className="pointer-events-none absolute top-2 left-3 text-muted-foreground z-10">
                                                        What&apos;s on your mind,{" "}
                                                        {user?.name
                                                            ? user.name.charAt(0).toUpperCase() +
                                                            user.name.slice(1).toLowerCase()
                                                            : "Guest"}
                                                        ?
                                                    </div>
                                                )}

                                                <div
                                                    ref={editorRef}
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    className={`px-3 py-2 editor-content focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-20 w-full rounded p-2 outline-none border-none whitespace-pre-wrap break-words ${updateBlogLoading && "pointer-events-none"}`}
                                                    aria-label="Blog content editor"
                                                    onInput={handleInput}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between items-start">
                                                <div className="flex p-2 gap-2 flex-col">
                                                    <div className="flex  gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="size-7"
                                                            type="button"
                                                            onClick={() => execCommand("bold")}
                                                            disabled={updateBlogLoading}
                                                        >
                                                            <Bold />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="size-7"
                                                            type="button"
                                                            onClick={() => execCommand("italic")}
                                                            disabled={updateBlogLoading}
                                                        >
                                                            <Italic />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="size-7"
                                                            type="button"
                                                            onClick={() => execCommand("underline")}
                                                            disabled={updateBlogLoading}
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
                                                                    disabled={updateBlogLoading}
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
                                                                        <Label
                                                                            htmlFor="username"
                                                                            className="text-right"
                                                                        >
                                                                            Link
                                                                        </Label>
                                                                        <Input
                                                                            id="username"
                                                                            placeholder="Enter the link you want to add"
                                                                            className="col-span-3"
                                                                            onChange={(e) =>
                                                                                setUrlLink(e.target.value)
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <DialogFooter>
                                                                    <Button type="submit" onClick={handleLink}>
                                                                        Add URL
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Select
                                                            onValueChange={(value) => {
                                                                execCommand("formatBlock", value);
                                                            }}
                                                            disabled={updateBlogLoading}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Headings" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="h1">
                                                                    <Heading1 className="size-6" /> Heading 1
                                                                </SelectItem>
                                                                <SelectItem value="h2">
                                                                    <Heading2 className="size-5" /> Heading 2
                                                                </SelectItem>
                                                                <SelectItem value="h3">
                                                                    <Heading3 className="size-4" /> Heading 3
                                                                </SelectItem>
                                                                <SelectItem value="p">
                                                                    <Heading className="size-3" /> Normal
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>

                                                        <Select
                                                            onValueChange={(value) =>
                                                                setBlogData((prevData) => prevData ? { ...prevData, blogCategory: value } : undefined)
                                                            }
                                                            defaultValue={blog?.blogCategory}
                                                            disabled={updateBlogLoading}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Category" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem
                                                                    value="Tech"
                                                                    className="hover:cursor-pointer"
                                                                >
                                                                    Tech
                                                                </SelectItem>
                                                                <SelectItem
                                                                    value="Fitness"
                                                                    className="hover:cursor-pointer"
                                                                >
                                                                    Fitness
                                                                </SelectItem>
                                                                <SelectItem
                                                                    value="Travel"
                                                                    className="hover:cursor-pointer"
                                                                >
                                                                    Travel
                                                                </SelectItem>
                                                                <SelectItem
                                                                    value="Food"
                                                                    className="hover:cursor-pointer"
                                                                >
                                                                    Food
                                                                </SelectItem>
                                                                <SelectItem
                                                                    value="Business"
                                                                    className="hover:cursor-pointer"
                                                                >
                                                                    Business
                                                                </SelectItem>
                                                                <SelectItem
                                                                    value="Education"
                                                                    className="hover:cursor-pointer"
                                                                >
                                                                    Education
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <input type="submit" ref={submitButton} hidden />
                                    </form>
                                </div>
                                <div className="flex justify-end gap-2">

                                    <Button
                                        variant="outline"
                                        className="cursor-pointer"
                                        onClick={() => {
                                            router.back();
                                        }}
                                        disabled={updateBlogLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="cursor-pointer"
                                        onClick={() => {
                                            submitButton.current?.click();
                                        }}
                                        disabled={updateBlogLoading}
                                    >
                                        {updateBlogLoading ? <Loader className="animate-spin"/>  : "Update Blog"}
                                    </Button>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditBlog;
