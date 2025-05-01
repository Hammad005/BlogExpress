import React from 'react'

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const Categories = () => {
    const categories = [
        { name: 'Tech', description: 'Stay updated with the latest trends and innovations in technology.', link: 'Tech' },
        { name: 'Fitness', description: 'Discover tips and advice for a healthier lifestyle.', link: 'Fitness' },
        { name: 'Travel', description: 'Embark on a journey through our travel stories and guides.', link: 'Travel' },
        { name: 'Food', description: 'Savor delicious recipes and culinary adventures.', link: 'Food' },
        { name: 'Business', description: 'Gain insights and strategies for business success.', link: 'Business' },
        { name: 'Education', description: 'Explore resources and tips for lifelong learning.', link: 'Education' },
    ];
    return (
        <div className="min-h-[calc(100vh-73px)] p-6 flex flex-col items-center justify-center">
            <div className="text-center mb-8">
                <h1 className="text-5xl font-extrabold animate-pulse text-primary">Categories</h1>
                <p className="text-gray-600 mt-2">
                    Your one-stop destination for diverse topics and insights.
                </p>
            </div>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {categories.map((category, index) => (
                    <Link key={index} href={`category/${category.link}`} className="w-full h-full">
                    <Card className="bg-input dark:bg-card h-40 flex justify-center hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg">
                        <CardContent>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-2 text-primary animate-bounce">{category.name}</h2>
                                <p className="text-gray-600 text-xs">
                                    {category.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Categories