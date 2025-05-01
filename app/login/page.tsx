'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useRef, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Eye, EyeOff, Loader } from 'lucide-react';
import { userStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Login = () => {
    const {  loading, user, login } = userStore();

    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push('/')
        }
    }, [router, user])

    const clickSubmit = useRef<HTMLInputElement | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [data, setData] = useState({ email: "", password: "" });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login(data);
    };

    return (
        <div className="flex items-center justify-center  min-h-[calc(100vh-73px)] p-6 lg:p-0 md:p-0">
            <Card className="rounded-xl border-primary/50 backdrop-blur p-8 shadow-2xl shadow-primary/80 dark:shadow-primary/20 w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-primary text-shadow-lg dark:text-shadow-primary/50 animate-pulse">Login</CardTitle>
                    <CardDescription>Welcome to <span className='underline underline-offset-1 decoration-primary'>BlogExpress</span>! Log in to unlock the full experience — post your own blogs, like your favorite articles, expert tips, and exclusive updates. Your journey in the automotive world starts here!</CardDescription>
                </CardHeader>
                <CardContent>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Label className="block text-sm font-medium text-primary" htmlFor="email">
                                Email
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 transform hover:scale-105"
                                placeholder="you@example.com"
                                value={data.email}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                required
                            />
                        </div>
                        <div >
                            <Label className="block text-sm font-medium text-primary" htmlFor="password">
                                Password
                            </Label>
                            <div className='relative'>
                                <Input
                                    type={!showPassword ? "password" : "text"}
                                    id="password"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 transform hover:scale-105"
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData({ ...data, password: e.target.value })}
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    {showPassword ? (
                                        <EyeOff
                                            className="dark:text-primary/50 text-primary size-5 cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                        />
                                    ) : (
                                        <Eye
                                            className="dark:text-primary/50 text-primary size-5 cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                        />
                                    )}
                                </div>
                            </div>
                            <div >
                                <p className='text-[0.850rem] text-end pt-2 text-muted-foreground'>Don&apos;t have an account? <Link href="/signup" className='hover:text-primary text-muted-foreground font-semibold underline underline-offset-1 decoration-primary'>Sign Up</Link></p>
                            </div>
                        </div>
                        <input type="submit" hidden={true} ref={clickSubmit} />
                    </form>
                </CardContent>
                <CardFooter >
                    <Button onClick={() => clickSubmit.current?.click()} className="transition duration-200 w-full shadow-lg transform hover:scale-105 cursor-pointer " size={'lg'} disabled={loading}>
                        {loading ?
                            <Loader className='animate-spin' />
                            : 'Login'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
