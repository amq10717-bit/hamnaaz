'use client'

import React from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
// @ts-ignore
import 'swiper/css/bundle';
import { useRouter } from 'next/navigation';

const Collection = () => {
    const router = useRouter()

    const handleTypeClick = (type: string) => {
        router.push(`/shop/breadcrumb1?type=${type}`);
    };

    const collections = [
        { name: 'Lawn 3 Piece', slug: 'lawn-3-piece', img: 'lawn-3-piece.jpg' },
        { name: 'Lawn 2 Piece', slug: 'lawn-2-piece', img: 'lawn-2-piece.jpg' },
        { name: 'Linen 3 Piece', slug: 'linen-3-piece', img: 'linen-3-piece.jpg' },
        { name: 'Linen 2 Piece', slug: 'linen-2-piece', img: 'linen-2-piece.jpg' },
        { name: 'Khaddar 3 Piece', slug: 'khaddar-3-piece', img: 'khaddar-3-piece.jpg' },
        { name: 'Khaddar 2 Piece', slug: 'khaddar-2-piece', img: 'khaddar-2-piece.jpg' },
        { name: 'Dhanak 3 Piece', slug: 'dhanak-3-piece', img: 'dhanak-3-piece.jpg' }
    ];

    return (
        <>
            <div className="collection-block md:pt-20 pt-10">
                <div className="container">
                    <div className="heading3 text-center">Shop By Fabric</div>
                </div>
                <div className="list-collection section-swiper-navigation md:mt-10 mt-6 sm:px-5 px-4">
                    <Swiper
                        spaceBetween={12}
                        slidesPerView={2}
                        navigation
                        loop={true}
                        modules={[Navigation, Autoplay]}
                        breakpoints={{
                            576: { slidesPerView: 2, spaceBetween: 12 },
                            768: { slidesPerView: 3, spaceBetween: 20 },
                            1200: { slidesPerView: 4, spaceBetween: 20 },
                        }}
                        className='h-full'
                    >
                        {collections.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="collection-item block relative rounded-2xl overflow-hidden cursor-pointer group" onClick={() => handleTypeClick(item.slug)}>
                                    <div className="bg-img bg-surface aspect-[3/4] flex items-center justify-center">
                                        <Image
                                            src={`/images/collection/${item.img}`}
                                            width={1000} height={1200} alt={item.name}
                                            className='w-full h-full object-cover duration-500 group-hover:scale-105'
                                            onError={(e) => { e.currentTarget.src = '/images/product/1000x1000.png' }}
                                        />
                                    </div>
                                    <div className="collection-name heading5 text-center sm:bottom-8 bottom-4 lg:w-[200px] md:w-[160px] w-11/12 mx-auto md:py-3 py-1.5 bg-white rounded-xl duration-500 absolute left-1/2 -translate-x-1/2">
                                        {item.name}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </>
    )
}

export default Collection