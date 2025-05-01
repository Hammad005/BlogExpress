'use client';
import Link from "next/link";
import { Dock, Home, Loader, LogIn, LogOut, LucideChartBarIncreasing, Menu, User, UserPlus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "./ModeToggle";
import { Button, buttonVariants } from "@/components/ui/button"
import LoadingBar from "react-top-loading-bar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { userStore } from "@/store/userStore";



const Navbar = () => {

  const [progress, setProgress] = useState(0);
  const pathName = usePathname()
  const { user, logout, loading } = userStore();
  useEffect(() => {
    setProgress(30)

    setTimeout(() => {
      setProgress(70)
    }, 100);

    setTimeout(() => {
      setProgress(100)
    }, 300);
  }, [pathName])


  return (
    <>
      <LoadingBar
        color="#7f22fe"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        height={3}
      />
      <nav className="flex justify-between items-center p-4 bg-background/30 sticky border-b top-0 backdrop-blur z-10">
        <div className="container mx-auto flex justify-between  items-center">
          <Link href="/" className="text-2xl font-bold text-primary text-shadow-lg animate-bounce">
            BlogExpress
          </Link>
          <div className={`hidden md:flex flex-col md:flex-row items-center`}>
            <Link href={'/'} className={`${buttonVariants({ variant: "outline", size: "icon" })} mx-1.5 cursor-pointer overflow-hidden flex justify-start pl-2.5 hover:overflow-visible   hover:w-fit  hover:p-2`}>
              <Home className="text-primary" />Home
            </Link>
            <Link href={'/about'} className={`${buttonVariants({ variant: "outline", size: "icon" })} mx-1.5 cursor-pointer overflow-hidden flex justify-start pl-2.5 hover:overflow-visible   hover:w-fit  hover:p-2 `}>
              <Dock className="text-primary" />About
            </Link>
            <Link href={'/categories'} className={`${buttonVariants({ variant: "outline", size: "icon" })} mx-1.5 cursor-pointer overflow-hidden flex justify-start pl-2.5 hover:overflow-visible   hover:w-fit  hover:p-2 `}>
              <LucideChartBarIncreasing className="text-primary" />Categories
            </Link>
            {user &&
            <>
            <Link href={'/profile'} className={`${buttonVariants({ variant: "outline", size: "icon" })} mx-1.5 cursor-pointer overflow-hidden flex justify-start pl-2.5 hover:overflow-visible   hover:w-fit  hover:p-2 `}>
              <User className="text-primary" />Profile
            </Link> 
            <Button variant="outline" className={`mx-1.5 cursor-pointer overflow-hidden flex justify-start pl-2.5 hover:overflow-visible   hover:w-fit hover:pl-0 hover:p-2 `} size={'icon'} onClick={logout} disabled={loading}>
              {loading ? <Loader className="text-primary animate-spin" /> : <><LogOut className="text-primary" />Logout</>}
            </Button>
            </>
            }
            {/* login/signup */}
            {!user && 
            <>
            <Link href={'/login'} className={`${buttonVariants({ variant: "outline", size: "icon" })} mx-1.5 cursor-pointer overflow-hidden flex justify-start pl-2.5 hover:overflow-visible   hover:w-fit  hover:p-2 `}>
            <LogIn className="text-primary"/>
            Login
            </Link>
            <Link href={'/signup'} className={`${buttonVariants({ variant: "outline", size: "icon" })} mx-1.5 cursor-pointer overflow-hidden flex justify-start pl-2.5 hover:overflow-visible   hover:w-fit  hover:p-2 `}>
            <UserPlus className="text-primary"/>
            Signup
            </Link>
            </>}
            <div className="ml-1.5 cursor-pointer">
              <ModeToggle />
            </div>
          </div>

          <div className="md:hidden cursor-pointer flex items-center gap-2">
            <ModeToggle />
            {user && <Link href={'/profile'} className={`${buttonVariants({ variant: "outline" })}`}>
              <User className="text-primary" />
            </Link>}
            <Sheet>
              <SheetTrigger
                className={
                  "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded flex justify-center items-center size-9"
                }
              >
                <Menu className="text-primary" />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className={"font-bold my-4 text-primary animate-pulse text-shadow-lg"}>
                    BlogExpress
                  </SheetTitle>
                  <SheetDescription className={"flex flex-col gap-6"}>
                    <Link href="/" className="p-2 text-accent-foreground">
                      Home
                    </Link>
                    <Link href="/about" className="p-2 text-accent-foreground">
                      About
                    </Link>
                    <Link href="/categories" className="p-2 text-accent-foreground">
                    Categories
                    </Link>
                    {!user && <><Link
                      href="/login"
                      className={`${buttonVariants({ variant: "outline" })} mx-1 text-accent-foreground`}
                    >
                      Login
                    </Link>

                      <Link href={'/signup'} className={`${buttonVariants({ variant: "outline" })} mx-1 text-accent-foreground`}>Signup</Link></>}
                    {user && <Button variant="outline" className={`mx-1`} onClick={logout} disabled={loading}>
                      {loading ? <Loader className="text-primary animate-spin" /> : <><LogOut className="text-primary" />Logout</>}
                    </Button>}

                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
