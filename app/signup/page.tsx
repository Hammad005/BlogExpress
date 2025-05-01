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
import { toast } from 'sonner';

const Signup = () => {
    const { signup, loading, user } = userStore();

    const router = useRouter()

    const handleGoBack = () => {
        router.back()
    }

    useEffect(() => {
        if (user) {
            router.push('/')
        }
    }, [router, user])
    
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const clickSubmit = useRef<HTMLInputElement | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showCPassword, setShowCPassword] = useState(false)
    const [data, setData] = useState({ name: "", email: "", password: "" });
    const [cPassword, setCPassword] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (data.password !== cPassword) {
            toast.warning("Passwords do not match!");
            return;
        }
        signup(data);
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-6 lg:p-0 md:p-0">
            <Card className="rounded-xl border-primary/50 backdrop-blur p-8 shadow-2xl shadow-primary/80 dark:shadow-primary/20 w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-primary text-shadow-lg animate-pulse dark:text-shadow-primary/50">Sign Up</CardTitle>
                    <CardDescription>Ready to join the <span className='underline underline-offset-1 decoration-primary'>BlogExpress</span> community? Sign up now to connect with fellow enthusiasts, like others’ blogs, and gain access to the latest expert insights and exclusive updates. Your voice matters here!</CardDescription>
                </CardHeader>
                <CardContent>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Label className="block text-sm font-medium text-primary" htmlFor="name">
                                Name
                            </Label>
                            <Input
                                type="text"
                                id="name"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 transform hover:scale-105"
                                placeholder="John Doe"
                                value={data.name}
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                required
                            />
                        </div>
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
                        <div className="mb-4">
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
                        </div>
                        <div className="mb-4">
                            <Label className="block text-sm font-medium text-primary" htmlFor="cpassword">
                                Confirm Password
                            </Label>
                            <div className='relative'>
                                <Input
                                    type={!showCPassword ? "password" : "text"}
                                    id="cpassword"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 transform hover:scale-105"
                                    placeholder="••••••••"
                                    value={cPassword}
                                    onChange={(e) => setCPassword(e.target.value)}
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    {showCPassword ? (
                                        <EyeOff
                                            className="dark:text-primary/50 text-primary size-5 cursor-pointer"
                                            onClick={() => setShowCPassword(!showCPassword)}
                                        />
                                    ) : (
                                        <Eye
                                            className="dark:text-primary/50 text-primary size-5 cursor-pointer"
                                            onClick={() => setShowCPassword(!showCPassword)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <input type="submit" hidden={true} ref={clickSubmit} />
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" className='transition duration-200 shadow-lg transform hover:scale-105 cursor-pointer' onClick={handleGoBack}>Cancel</Button>
                    <Button onClick={() => clickSubmit.current?.click()} className="transition duration-200 shadow-lg transform hover:scale-105 cursor-pointer" size={'default'} disabled={loading}>
                        {loading ?
                            <Loader className='animate-spin' />
                            : 'Sign Up'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Signup;
