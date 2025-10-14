"use client";
import { useEffect, useState } from "react";
import React from 'react';
import ImageCard from "@/components/ImageCard";

interface Product {
    id: string;
    name: string;
    description: string[];
    imageUrl: string;
}

const ProductList: React.FC = () => {

    const [products, setProducts] = useState<Product[] | null>(null);

    const getContent = async () => {
        try {
            const response = await fetch("/models/products.json", {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error in Footer getContent:', error);
            throw error;
        }
    };

    const fetchData = async () => {
        if (!products) {
            try {
                const oData = await getContent();
                setProducts(oData.products);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="">
            <div className="mx-auto max-w-[90%] md:pb-8 pb-4 md:pt-4 pt-1">
                <div className="rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm inset-shadow-indigo-200/50 space-y-1">
                    <h1 className="text-3xl font-bold text-white mb-8 text-center">
                        Product Catalog 🌾
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {products && products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-green-100 rounded-lg shadow-xl overflow-hidden border border-green-200 hover:shadow-2xl transition-shadow duration-300"
                            >
                                <ImageCard imageUrl={product.imageUrl} altText={product.name} title={product.id}></ImageCard>
                                <div className="p-5">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                        {product.name}
                                    </h2>
                                    <p className="text-sm text-blue-600 font-mono mb-3">
                                        ID: {product.id}
                                    </p>
                                    <div className="mt-4 p-3 rounded-lg border border-gray-100 bg-green-50">
                                        <h3 className="text-md font-medium text-gray-700 mb-2 border-b pb-1">
                                            Key Features:
                                        </h3>
                                        <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
                                            {product.description.map((desc, index) => (
                                                <li key={index} className="pl-2">
                                                    {desc}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;