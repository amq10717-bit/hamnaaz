'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
// @ts-ignore
import 'swiper/css/bundle';

const Instagram = () => {
    return (
        <>
            <div className="instagram-block md:pt-20 pt-10">
                <div className="container">
                    <div className="heading flex flex-col items-center text-center">
                        <div className="heading3">Hamnaaz On Instagram</div>
                        <div className="text-secondary mt-2">#HamnaazOfficial</div>
                    </div>
                </div>
                <div className="list-instagram mt-7">
                    <Swiper
                        slidesPerView={2}
                        spaceBetween={0}
                        loop={true}
                        autoplay={{
                            delay: 4000,
                        }}
                        modules={[Autoplay]}
                        breakpoints={{
                            576: {
                                slidesPerView: 3,
                            },
                            768: {
                                slidesPerView: 4,
                            },
                            1200: {
                                slidesPerView: 5,
                            },
                        }}
                    >
                        {/* We use an array of 5 to loop through placeholder images. 
                            You can replace these numbered images in public/images/instagram/ 
                            with your real Instagram posts later */}
                        {[1, 2, 3, 4, 5].map((item, index) => (
                            <SwiperSlide key={index}>
                                <Link href={'https://www.instagram.com/hamnaaz.official'} target='_blank' className="item relative block overflow-hidden group">
                                    <Image
                                        src={`/images/instagram/${item}.png`}
                                        width={384}
                                        height={384}
                                        alt='Instagram Post'
                                        className='w-full aspect-square object-cover duration-500 group-hover:scale-110'
                                        onError={(e) => { e.currentTarget.src = '/images/product/1000x1000.png' }}
                                    />
                                    <div className="icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-3xl opacity-0 duration-300 group-hover:opacity-100 z-[1]">
                                        <i className="ph ph-instagram-logo"></i>
                                    </div>
                                    <div className="bg-black/20 absolute inset-0 opacity-0 duration-300 group-hover:opacity-100"></div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </>
    )
}

export default Instagram