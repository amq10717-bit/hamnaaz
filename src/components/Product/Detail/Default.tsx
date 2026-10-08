'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ProductType } from '@/type/ProductType'
import Product from '../Product'
import Rate from '@/components/Other/Rate'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
// @ts-ignore
import 'swiper/css/bundle';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import SwiperCore from 'swiper/core';
import { useCart } from '@/context/CartContext'
import { useModalCartContext } from '@/context/ModalCartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useModalWishlistContext } from '@/context/ModalWishlistContext'
import { useCompare } from '@/context/CompareContext'
import { useModalCompareContext } from '@/context/ModalCompareContext'

SwiperCore.use([Navigation, Thumbs]);

interface Props {
    data: Array<ProductType>
    productId: string | number | null
}

const Default: React.FC<Props> = ({ data, productId }) => {
    const swiperRef: any = useRef();
    const [openPopupImg, setOpenPopupImg] = useState(false)
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);
    const [activeTab, setActiveTab] = useState<string | undefined>('description')
    const [isDescExpanded, setIsDescExpanded] = useState<boolean>(false)

    const { addToCart, updateCart, cartState } = useCart()
    const { openModalCart } = useModalCartContext()
    const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist()
    const { openModalWishlist } = useModalWishlistContext()
    const { addToCompare, removeFromCompare, compareState } = useCompare();
    const { openModalCompare } = useModalCompareContext()

    let productMain = data.find(product => product.id === productId) as ProductType
    if (productMain === undefined) {
        productMain = data[0]
    }

    // Dynamic Fabric & Category Logic
    const getFabric = (product: any) => {
        const tags = (product.tags || []).map((t: string) => t.toLowerCase());
        const name = (product.name || '').toLowerCase();
        if (tags.includes('lawn') || name.includes('lawn')) return 'Lawn';
        if (tags.includes('linen') || name.includes('linen')) return 'Linen';
        if (tags.includes('khaddar') || name.includes('khaddar')) return 'Khaddar';
        if (tags.includes('dhanak') || name.includes('dhanak')) return 'Dhanak';
        return 'Premium Fabric';
    };

    const fabric = getFabric(productMain);
    const is3Piece = productMain.name?.toLowerCase().includes('3 piece') || productMain.name?.toLowerCase().includes('3-piece');
    const is2Piece = productMain.name?.toLowerCase().includes('2 piece') || productMain.name?.toLowerCase().includes('2-piece');

    const pieceText = is3Piece ? '3 Piece' : (is2Piece ? '2 Piece' : 'Unstitched');
    const exactCategory = `${fabric} ${pieceText}`;
    const isSummer = fabric === 'Lawn';
    const collectionName = isSummer ? 'Summer Collection' : 'Winter Collection';

    const availableSizes = is3Piece
        ? ["2.5m Shirt / 2.25m Trouser / 2.25m Dupatta"]
        : is2Piece ? ["3.5 Meters"] : ["Unstitched Fabric"];

    const [activeSize, setActiveSize] = useState<string>(availableSizes[0])
    const percentSale = Math.floor(100 - ((productMain?.price / (productMain?.originPrice || 1)) * 100))

    const handleSwiper = (swiper: SwiperCore) => {
        setThumbsSwiper(swiper);
    };

    const handleActiveSize = (item: string) => {
        setActiveSize(item)
    }

    const handleIncreaseQuantity = () => {
        productMain.quantityPurchase += 1
        updateCart(productMain.id, productMain.quantityPurchase + 1, activeSize, '');
    };

    const handleDecreaseQuantity = () => {
        if (productMain.quantityPurchase > 1) {
            productMain.quantityPurchase -= 1
            updateCart(productMain.id, productMain.quantityPurchase - 1, activeSize, '');
        }
    };

    const handleAddToCart = () => {
        if (!cartState.cartArray.find(item => item.id === productMain.id)) {
            addToCart({ ...productMain });
            updateCart(productMain.id, productMain.quantityPurchase, activeSize, '')
        } else {
            updateCart(productMain.id, productMain.quantityPurchase, activeSize, '')
        }
        openModalCart()
    };

    const handleAddToWishlist = () => {
        if (wishlistState.wishlistArray.some(item => item.id === productMain.id)) {
            removeFromWishlist(productMain.id);
        } else {
            addToWishlist(productMain);
        }
        openModalWishlist();
    };

    const handleAddToCompare = () => {
        if (compareState.compareArray.length < 3) {
            if (compareState.compareArray.some(item => item.id === productMain.id)) {
                removeFromCompare(productMain.id);
            } else {
                addToCompare(productMain);
            }
        } else {
            alert('Compare up to 3 products')
        }
        openModalCompare();
    };

    const handleActiveTab = (tab: string) => {
        setActiveTab(tab)
    }

    // Pre-filled WhatsApp Message
    const whatsappMessage = `Hi Hamnaaz! I want to order this product: ${productMain.name}`;
    const whatsappLink = `https://wa.me/923195021902?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <>
            <div className="product-detail default">
                <div className="featured-product underwear md:py-20 py-10">
                    <div className="container flex justify-between gap-y-6 flex-wrap">
                        <div className="list-img md:w-1/2 md:pr-[45px] w-full">
                            <Swiper
                                slidesPerView={1}
                                spaceBetween={0}
                                thumbs={{ swiper: thumbsSwiper }}
                                modules={[Thumbs]}
                                className="mySwiper2 rounded-2xl overflow-hidden"
                            >
                                {productMain.images.map((item, index) => (
                                    <SwiperSlide
                                        key={index}
                                        onClick={() => {
                                            swiperRef.current?.slideTo(index);
                                            setOpenPopupImg(true)
                                        }}
                                    >
                                        <Image
                                            src={item}
                                            width={1000}
                                            height={1000}
                                            alt='prd-img'
                                            className='w-full aspect-[3/4] object-cover'
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <Swiper
                                onSwiper={(swiper) => {
                                    handleSwiper(swiper)
                                }}
                                spaceBetween={12}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[Navigation, Thumbs]}
                                className="mySwiper mt-3"
                            >
                                {productMain.images.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <Image
                                            src={item}
                                            width={1000}
                                            height={1000}
                                            alt='prd-img'
                                            className='w-full aspect-[3/4] object-cover rounded-xl cursor-pointer'
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <div className={`popup-img ${openPopupImg ? 'open' : ''}`}>
                                <span
                                    className="close-popup-btn absolute top-4 right-4 z-[2] cursor-pointer"
                                    onClick={() => { setOpenPopupImg(false) }}
                                >
                                    <Icon.X className="text-3xl text-white" />
                                </span>
                                <Swiper
                                    spaceBetween={0}
                                    slidesPerView={1}
                                    modules={[Navigation, Thumbs]}
                                    navigation={true}
                                    loop={true}
                                    className="popupSwiper"
                                    onSwiper={(swiper) => {
                                        swiperRef.current = swiper
                                    }}
                                >
                                    {productMain.images.map((item, index) => (
                                        <SwiperSlide
                                            key={index}
                                            onClick={() => { setOpenPopupImg(false) }}
                                        >
                                            <Image
                                                src={item}
                                                width={1000}
                                                height={1000}
                                                alt='prd-img'
                                                className='w-full aspect-[3/4] object-cover rounded-xl'
                                                onClick={(e) => { e.stopPropagation(); }}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                        <div className="product-infor md:w-1/2 w-full lg:pl-[15px] md:pl-2">
                            <div className="flex justify-between">
                                <div>
                                    <div className="caption2 text-secondary font-semibold uppercase">{collectionName}</div>
                                    <div className="heading4 mt-1">{productMain.name}</div>
                                </div>
                                <div
                                    className={`add-wishlist-btn w-12 h-12 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white ${wishlistState.wishlistArray.some(item => item.id === productMain.id) ? 'active' : ''}`}
                                    onClick={handleAddToWishlist}
                                >
                                    {wishlistState.wishlistArray.some(item => item.id === productMain.id) ? (
                                        <Icon.Heart size={24} weight='fill' className='text-white' />
                                    ) : (
                                        <Icon.Heart size={24} />
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center mt-3">
                                <Rate currentRate={4.8} size={14} />
                                <span className='caption1 text-secondary ml-2'>(24 reviews)</span>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap mt-5 pb-6 border-b border-line">
                                <div className="product-price heading5">Rs. {productMain.price}</div>
                                {productMain.originPrice && productMain.originPrice > productMain.price && (
                                    <>
                                        <div className='w-px h-4 bg-line'></div>
                                        <div className="product-origin-price font-normal text-secondary2"><del>Rs. {productMain.originPrice}</del></div>
                                        <div className="product-sale caption2 font-semibold bg-green px-3 py-0.5 inline-block rounded-full">
                                            -{percentSale}%
                                        </div>
                                    </>
                                )}

                                {/* Expanding Description */}
                                <div className="description-container mt-3 w-full">
                                    <div
                                        className={`desc text-secondary transition-all overflow-hidden ${!isDescExpanded ? 'line-clamp-3' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: productMain.description }}
                                    />
                                    <div
                                        className="text-black font-semibold text-sm mt-2 cursor-pointer inline-flex items-center gap-1 hover:underline"
                                        onClick={() => setIsDescExpanded(!isDescExpanded)}
                                    >
                                        {isDescExpanded ? 'Read Less' : 'Read More'}
                                        <Icon.CaretDown className={`transition-transform ${isDescExpanded ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                            </div>
                            <div className="list-action mt-6">
                                <div className="choose-size">
                                    <div className="heading flex items-center justify-between">
                                        <div className="text-title">Fabric Cut: <span className='text-title size font-semibold text-black'>{activeSize}</span></div>
                                    </div>
                                    <div className="list-size flex items-center gap-2 flex-wrap mt-3">
                                        {availableSizes.map((item, index) => (
                                            <div
                                                className={`size-item px-4 py-2 flex items-center justify-center text-button rounded-lg bg-white border border-line cursor-pointer ${activeSize === item ? 'active !border-black !bg-black !text-white' : ''}`}
                                                key={index}
                                                onClick={() => handleActiveSize(item)}
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-title mt-5">Quantity:</div>
                                <div className="choose-quantity flex items-center lg:justify-between gap-5 gap-y-3 mt-3">
                                    <div className="quantity-block md:p-3 max-md:py-1.5 max-md:px-3 flex items-center justify-between rounded-lg border border-line sm:w-[180px] w-[120px] flex-shrink-0">
                                        <Icon.Minus
                                            size={20}
                                            onClick={handleDecreaseQuantity}
                                            className={`${productMain.quantityPurchase === 1 ? 'disabled text-line' : ''} cursor-pointer`}
                                        />
                                        <div className="body1 font-semibold">{productMain.quantityPurchase}</div>
                                        <Icon.Plus
                                            size={20}
                                            onClick={handleIncreaseQuantity}
                                            className='cursor-pointer'
                                        />
                                    </div>
                                    <div onClick={handleAddToCart} className="button-main w-full text-center bg-white text-black border border-black cursor-pointer hover:bg-black hover:text-white duration-300">Add To Cart</div>
                                </div>
                                <div className="button-block mt-3">
                                    <div className="button-main w-full text-center cursor-pointer" onClick={handleAddToCart}>Buy It Now</div>
                                </div>
                                <div className="button-block mt-3">
                                    <Link href={whatsappLink} target="_blank" className="w-full bg-[#25D366] text-white hover:bg-[#128C7E] duration-300 flex items-center justify-center gap-2 py-3.5 rounded-lg font-semibold cursor-pointer text-button-uppercase">
                                        <Icon.WhatsappLogo size={24} weight="fill" />
                                        Order via WhatsApp
                                    </Link>
                                </div>
                                <div className="flex items-center gap-8 mt-5 pb-6 border-b border-line">
                                    <div className="compare flex items-center gap-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleAddToCompare() }}>
                                        <div className="compare-btn md:w-12 md:h-12 w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white">
                                            <Icon.ArrowsCounterClockwise className='heading6' />
                                        </div>
                                        <span>Compare</span>
                                    </div>
                                    <div className="share flex items-center gap-3 cursor-pointer">
                                        <div className="share-btn md:w-12 md:h-12 w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white">
                                            <Icon.ShareNetwork weight='fill' className='heading6' />
                                        </div>
                                        <span>Share Product</span>
                                    </div>
                                </div>
                                <div className="more-infor mt-6">
                                    <div className="flex items-center gap-1 mt-3">
                                        <Icon.Truck className='body1' />
                                        <div className="text-title">Delivery:</div>
                                        <div className="text-secondary">2-4 Working Days</div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-3">
                                        <Icon.Eye className='body1 text-green' />
                                        <div className="text-title text-green">14</div>
                                        <div className="text-secondary text-green">people viewing this product right now!</div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-3">
                                        <div className="text-title">SKU:</div>
                                        <div className="text-secondary uppercase">{productMain.id.substring(0, 8)}</div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-3">
                                        <div className="text-title">Categories:</div>
                                        <div className="text-secondary capitalize">{exactCategory}</div>
                                    </div>
                                </div>
                                <div className="get-it mt-6">
                                    <div className="heading5">Store Guarantees</div>
                                    <div className="item flex items-center gap-3 mt-4">
                                        <div className="icon-delivery-truck text-4xl"></div>
                                        <div>
                                            <div className="text-title">Free Delivery</div>
                                            <div className="caption1 text-secondary mt-1">Free shipping in Rawalpindi and Islamabad.</div>
                                        </div>
                                    </div>
                                    <div className="item flex items-center gap-3 mt-4">
                                        <div className="icon-phone-call text-4xl"></div>
                                        <div>
                                            <div className="text-title">24/7 Support</div>
                                            <div className="caption1 text-secondary mt-1">We are available 24/7 on WhatsApp for your queries.</div>
                                        </div>
                                    </div>
                                    <div className="item flex items-center gap-3 mt-4">
                                        <div className="icon-return text-4xl"></div>
                                        <div>
                                            <div className="text-title">Exchange Policy</div>
                                            <div className="caption1 text-secondary mt-1">7 Days hassle-free exchange policy for unstitched suits.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="desc-tab md:pb-20 pb-10">
                <div className="container">
                    <div className="flex items-center justify-center w-full border-b border-line pb-4">
                        <div className="menu-tab flex items-center md:gap-[60px] gap-8">
                            <div
                                className={`tab-item heading5 has-line-before text-secondary2 hover:text-black duration-300 cursor-pointer ${activeTab === 'description' ? 'active text-black' : ''}`}
                                onClick={() => handleActiveTab('description')}
                            >
                                Full Description
                            </div>
                            <div
                                className={`tab-item heading5 has-line-before text-secondary2 hover:text-black duration-300 cursor-pointer ${activeTab === 'specifications' ? 'active text-black' : ''}`}
                                onClick={() => handleActiveTab('specifications')}
                            >
                                Specifications
                            </div>
                        </div>
                    </div>
                    <div className="desc-block mt-8">
                        <div className={`desc-item description ${activeTab === 'description' ? 'block' : 'hidden'}`}>
                            <div className='w-full lg:w-3/4 mx-auto'>
                                <div className="text-secondary mt-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: productMain.description }} />
                            </div>
                        </div>
                        <div className={`desc-item specifications flex items-center justify-center ${activeTab === 'specifications' ? 'block' : 'hidden'}`}>
                            <div className='lg:w-1/2 sm:w-3/4 w-full'>
                                <div className="item bg-surface flex items-center gap-8 py-3 px-10 rounded-t-lg">
                                    <div className="text-title sm:w-1/3 w-1/2">Collection</div>
                                    <p className="capitalize">{collectionName}</p>
                                </div>
                                <div className="item flex items-center gap-8 py-3 px-10">
                                    <div className="text-title sm:w-1/3 w-1/2">Fabric</div>
                                    <p className="capitalize">{fabric}</p>
                                </div>
                                <div className="item bg-surface flex items-center gap-8 py-3 px-10">
                                    <div className="text-title sm:w-1/3 w-1/2">Category</div>
                                    <p className="capitalize">{exactCategory}</p>
                                </div>
                                <div className="item flex items-center gap-8 py-3 px-10">
                                    <div className="text-title sm:w-1/3 w-1/2">Measurements</div>
                                    <p>{availableSizes[0]}</p>
                                </div>
                                <div className="item bg-surface flex items-center gap-8 py-3 px-10 rounded-b-lg">
                                    <div className="text-title sm:w-1/3 w-1/2">Care Instructions</div>
                                    <div className="flex items-center gap-2">
                                        <p>Do not bleach. Hand wash recommended. Iron at moderate temperature.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="review-block md:py-20 py-10 bg-surface">
                <div className="container">
                    <div className="heading flex items-center justify-between flex-wrap gap-4">
                        <div className="heading4">Customer Reviews</div>
                        <Link href={'#form-review'} className='button-main bg-white text-black border border-black'>Write a Review</Link>
                    </div>
                    <div className="top-overview flex justify-between py-6 max-md:flex-col gap-y-6">
                        <div className="rating lg:w-1/4 md:w-[30%] lg:pr-[75px] md:pr-[35px]">
                            <div className="heading flex items-center justify-center flex-wrap gap-3 gap-y-4">
                                <div className="text-display">4.8</div>
                                <div className='flex flex-col items-center'>
                                    <Rate currentRate={5} size={18} />
                                    <div className='text-secondary text-center mt-1'>(24 Ratings)</div>
                                </div>
                            </div>
                            <div className="list-rating mt-3">
                                <div className="item flex items-center justify-between gap-1.5">
                                    <div className="flex items-center gap-1">
                                        <div className="caption1">5</div>
                                        <Icon.Star size={14} weight='fill' />
                                    </div>
                                    <div className="progress bg-line relative w-3/4 h-2 rounded-full overflow-hidden">
                                        <div className="progress-percent absolute bg-yellow w-[85%] h-full left-0 top-0"></div>
                                    </div>
                                    <div className="caption1">85%</div>
                                </div>
                                <div className="item flex items-center justify-between gap-1.5 mt-1">
                                    <div className="flex items-center gap-1">
                                        <div className="caption1">4</div>
                                        <Icon.Star size={14} weight='fill' />
                                    </div>
                                    <div className="progress bg-line relative w-3/4 h-2 rounded-full overflow-hidden">
                                        <div className="progress-percent absolute bg-yellow w-[15%] h-full left-0 top-0"></div>
                                    </div>
                                    <div className="caption1">15%</div>
                                </div>
                            </div>
                        </div>

                        <div className="list-review lg:w-3/4 md:w-[70%]">
                            {/* Realistic Review 1 */}
                            <div className="item flex max-lg:flex-col gap-y-4 w-full py-6 border-t border-line">
                                <div className="left lg:w-1/4 w-full lg:pr-[15px]">
                                    <div className="user mt-3">
                                        <div className="text-title">Ayesha K.</div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-secondary2">2 days ago</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="right lg:w-3/4 w-full lg:pl-[15px]">
                                    <Rate currentRate={5} size={16} />
                                    <div className="heading5 mt-3">Bohat acha fabric hai!</div>
                                    <div className="body1 mt-3">Delivery was very fast in Islamabad. Fabric quality is premium and the print is exactly like the picture. Highly recommended, will definitely order again!</div>
                                </div>
                            </div>
                            {/* Realistic Review 2 */}
                            <div className="item flex max-lg:flex-col gap-y-4 w-full py-6 border-t border-line">
                                <div className="left lg:w-1/4 w-full lg:pr-[15px]">
                                    <div className="user mt-3">
                                        <div className="text-title">Fatima R.</div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-secondary2">1 week ago</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="right lg:w-3/4 w-full lg:pl-[15px]">
                                    <Rate currentRate={5} size={16} />
                                    <div className="heading5 mt-3">Beautiful Print</div>
                                    <div className="body1 mt-3">Stuff bohat acha aur soft hai. Color fade nahi hua wash karne ke baad. Great value for money. Thanks Hamnaaz!</div>
                                </div>
                            </div>
                            {/* Realistic Review 3 */}
                            <div className="item flex max-lg:flex-col gap-y-4 w-full py-6 border-t border-line">
                                <div className="left lg:w-1/4 w-full lg:pr-[15px]">
                                    <div className="user mt-3">
                                        <div className="text-title">Sana A.</div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-secondary2">2 weeks ago</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="right lg:w-3/4 w-full lg:pl-[15px]">
                                    <Rate currentRate={4} size={16} />
                                    <div className="heading5 mt-3">Good Quality</div>
                                    <div className="body1 mt-3">Design bohat pyara hai aur fabric ki width theek thi tailoring ke liye. Overall a very good experience shopping online.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="form-review" className='form-review pt-6 border-t border-line'>
                        <div className="heading4">Leave A Review</div>
                        <form className="grid sm:grid-cols-2 gap-4 gap-y-5 mt-6">
                            <div className="name ">
                                <input className="border border-line px-4 pt-3 pb-3 w-full rounded-lg" id="username" type="text" placeholder="Your Name *" required />
                            </div>
                            <div className="mail ">
                                <input className="border border-line px-4 pt-3 pb-3 w-full rounded-lg" id="email" type="email" placeholder="Your Email *" required />
                            </div>
                            <div className="col-span-full message">
                                <textarea className="border border-line px-4 py-3 w-full rounded-lg" id="message" name="message" placeholder="Your review *" required rows={4}></textarea>
                            </div>
                            <div className="col-span-full sm:pt-3">
                                <button className='button-main bg-black text-white border border-black hover:bg-white hover:text-black duration-300'>Submit Review</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="related-product md:py-20 py-10">
                <div className="container">
                    <div className="heading3 text-center">Related Products</div>
                    <div className="list-product hide-product-sold grid lg:grid-cols-4 grid-cols-2 md:gap-[30px] gap-5 md:mt-10 mt-6">
                        {data.slice(Number(productId), Number(productId) + 4).map((item, index) => (
                            <Product key={index} data={item} type='grid' style='style-1' />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Default