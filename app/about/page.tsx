import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import { Card, CardContent, CardFooter } from '@/components/ui/card';
const About = () => {
    const categories = [
        { name: 'Tech', description: 'Stay updated with the latest trends and innovations in technology.', link: 'Tech' },
        { name: 'Fitness', description: 'Discover tips and advice for a healthier lifestyle.', link: 'Fitness' },
        { name: 'Travel', description: 'Embark on a journey through our travel stories and guides.', link: 'Travel' },
        { name: 'Food', description: 'Savor delicious recipes and culinary adventures.', link: 'Food' },
        { name: 'Business', description: 'Gain insights and strategies for business success.', link: 'Business' },
        { name: 'Education', description: 'Explore resources and tips for lifelong learning.', link: 'Education' },
    ];
    return (
        <div className="p-6 min-h-[calc(100vh-73px)] flex flex-col items-center justify-center">
            <div className="text-center mb-8">
                <h1 className="text-5xl font-extrabold animate-pulse text-primary">BlogExpress</h1>
                <p className="text-gray-600 mt-2">
                    Your one-stop destination for diverse topics and insights.
                </p>
            </div>
            <Carousel className="w-full max-w-3xl">
                <CarouselContent>
                    {categories.map((category, index) => (
                        <CarouselItem key={index}>
                            <Card className="bg-input dark:bg-card">
                                <CardContent>
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold mb-2 text-primary animate-bounce">{category.name}</h2>
                                        <p className="text-gray-600">
                                            {category.description}
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-center mt-4">
                                    <Link href={`category/${category.link}`} className={`${buttonVariants()}`}>Explore {category.name}</Link>
                                </CardFooter>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default About