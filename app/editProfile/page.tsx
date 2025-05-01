'use client';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userStore } from '@/store/userStore';
import { Bold, CheckCircle2,  Italic, Link2, Loader, Underline, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';

const EditProfile = () => {
  const { user, successLoading, checkEmail, checkEmailLoading, updateProfile } = userStore();
  const [editData, setEditData] = useState({ name: user?.name, email: user?.email, bio: user?.bio || "" })
  const [urlLink, setUrlLink] = useState("")
  const [open, setOpen] = useState(false);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);

  const router = useRouter()
  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

  

  const editorRef = useRef<HTMLDivElement>(null);

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
      setEditData({ ...editData, bio: editor.innerHTML });
    }
    else if (selection && !selection.isCollapsed) {
      document.execCommand(command, false, value);
    }
    else {
      toast.warning("No text selected.");
    }

    editor.focus();
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile(editData)
  };
  // Set initial bio content only once or when needed
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = editData.bio || "";
    }
  }, []); // don't include editData.bio here to avoid cursor jump on every keystroke

  const handleInput = () => {
    if (editorRef.current) {
      const cleanedBio = editorRef.current?.innerHTML.replace(/<br\s*\/?>/g, '');
      setEditData({ ...editData, bio: cleanedBio });
    }
  };
  return (
    <div className="max-w-4xl  mx-auto p-6 flex justify-center items-center flex-col min-h-[calc(100vh-73px)]">
      <h1 className='text-center text-primary text-5xl font-bold uppercase'>Edit Profile</h1>
      <div className="flex-col md:flex-row items-center justify-center mt-6">
        <div>
          <div className='flex items-center justify-center flex-col md:flex-row gap-10 md:gap-20'>
            <div className='w-full flex ite justify-between'>
              <form onSubmit={handleSubmit} >
                <div className='flex-col'>
                 
                  <Label className='text-primary p-1 text-sm'>Name:</Label>
                  <Input
                    type='text'
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className='md:min-w-3xl min-w-[20rem] border border-primary/50 dark:border-none transition duration-200 transform hover:scale-102'
                    required
                  />
                  <Label className='text-primary p-1 text-sm'>Email:</Label>

                  <div className='relative'>
                    <Input
                      type='email'
                      value={editData.email}
                      onBlur={(e) => checkEmail(e.target.value)}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className='md:min-w-3xl min-w-[20rem] border border-primary/50 dark:border-none transition duration-200 transform hover:scale-102'
                      required
                    />
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                      {
                        checkEmailLoading ? <CheckCircle2 className='text-emerald-500 size-4' /> : <XCircle className='text-red-500 size-4' />
                      }
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Label className='text-primary text-sm p-1'>About Me:</Label>
                    <div className="flex gap-2 p-2">
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
                  </div>

                  <div className="relative">
                    {/* Optional placeholder */}
                    {!editData.bio && (
                      <div className="pointer-events-none absolute top-2 left-3 text-muted-foreground text-sm z-10">
                        Write your bio here...
                      </div>
                    )}

                    <div
                      ref={editorRef}
                      contentEditable
                      suppressContentEditableWarning
                      className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 w-full bg-transparent px-3 py-2 text-base shadow-xs focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-40 md:min-w-3xl max-w-[20rem] border border-primary/50 rounded p-2 dark:border-none transition duration-200 transform hover:scale-102 outline-none whitespace-pre-wrap break-words"
                      aria-label="Bio editor"
                      data-placeholder="Write your bio here..."
                      onInput={handleInput}
                    ></div>
                  </div>
                </div>
                <div className='flex justify-between mt-3'>
                  <Link href={'/profile'} className={`${buttonVariants({ variant: "outline" })} transition duration-200 shadow-lg transform hover:scale-105 cursor-pointer`}>Cancel</Link>
                  <Button type='submit' size={"default"} className="transition duration-200 shadow-lg transform hover:scale-105 cursor-pointer" disabled={successLoading}>
                    {successLoading ? <><Loader className='animate-spin' />Saving...</> : "Save Profile"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default EditProfile