'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useModalCartContext } from '@/context/ModalCartContext';
import { useModalWishlistContext } from '@/context/ModalWishlistContext';
import { useModalSearchContext } from '@/context/ModalSearchContext';
import useLoginPopup from '@/store/useLoginPopup';
import useMenuMobile from '@/store/useMenuMobile';
import { useRouter } from 'next/navigation';

interface Props {
    props: string;
}

const MenuOne: React.FC<Props> = ({ props }) => {
    const router = useRouter()
    const pathname = usePathname()
    const { openLoginPopup, handleLoginPopup } = useLoginPopup()
    const { openMenuMobile, handleMenuMobile } = useMenuMobile()
    const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null)
    const { openModalCart } = useModalCartContext()
    const { cartState } = useCart()
    const { openModalWishlist } = useModalWishlistContext()
    const { openModalSearch } = useModalSearchContext()

    const handleOpenSubNavMobile = (index: number) => {
        setOpenSubNavMobile(openSubNavMobile === index ? null : index)
    }

    const [fixedHeader, setFixedHeader] = useState(false)
    const [lastScrollPosition, setLastScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setFixedHeader(scrollPosition > 0 && scrollPosition < lastScrollPosition);
            setLastScrollPosition(scrollPosition);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollPosition]);

    const handleTypeClick = (type: string) => {
        router.push(`/shop/breadcrumb1?type=${type}`);
        if (openMenuMobile) handleMenuMobile();
    };

    return (
        <>
            <div className={`header-menu style-one ${fixedHeader ? 'fixed' : 'absolute'} top-0 left-0 right-0 w-full md:h-[74px] h-[56px] ${props} z-50`}>
                <div className="container mx-auto h-full">
                    <div className="header-main flex justify-between h-full">
                        <div className="menu-mobile-icon lg:hidden flex items-center" onClick={handleMenuMobile}>
                            <Icon.List className="text-2xl cursor-pointer" />
                        </div>
                        <div className="left flex items-center gap-16">
                            <Link href={'/'} className='flex items-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2'>
                                <div className="heading4">ہمناز</div>
                            </Link>
                            <div className="menu-main h-full max-lg:hidden">
                                <ul className='flex items-center gap-8 h-full'>
                                    <li className='h-full relative'>
                                        <Link href="/" className={`text-button-uppercase duration-300 h-full flex items-center justify-center gap-1 ${pathname === '/' ? 'active' : ''}`}>
                                            Home
                                        </Link>
                                    </li>
                                    <li className='h-full relative'>
                                        <Link href="/shop/breadcrumb1?collection=summer" className={`text-button-uppercase duration-300 h-full flex items-center justify-center gap-1`}>
                                            Summer Collection <Icon.CaretDown size={14} />
                                        </Link>
                                        <div className="sub-menu py-3 px-5 -left-4 w-max absolute bg-white rounded-b-xl shadow-lg">
                                            <ul>
                                                <li>
                                                    <div onClick={() => handleTypeClick('lawn-3-piece')} className="link text-secondary duration-300 cursor-pointer py-1 hover:text-black">Lawn 3 Piece Unstitched</div>
                                                </li>
                                                <li>
                                                    <div onClick={() => handleTypeClick('lawn-2-piece')} className="link text-secondary duration-300 cursor-pointer py-1 hover:text-black">Lawn 2 Piece Unstitched</div>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li className='h-full relative'>
                                        <Link href="/shop/breadcrumb1?collection=winter" className={`text-button-uppercase duration-300 h-full flex items-center justify-center gap-1`}>
                                            Winter Collection <Icon.CaretDown size={14} />
                                        </Link>
                                        <div className="sub-menu py-3 px-5 -left-4 w-max absolute bg-white rounded-b-xl shadow-lg">
                                            <ul>
                                                <li><div onClick={() => handleTypeClick('linen-3-piece')} className="link text-secondary duration-300 cursor-pointer py-1 hover:text-black">Linen 3 Piece Unstitched</div></li>
                                                <li><div onClick={() => handleTypeClick('linen-2-piece')} className="link text-secondary duration-300 cursor-pointer py-1 hover:text-black">Linen 2 Piece Unstitched</div></li>
                                                <li><div onClick={() => handleTypeClick('khaddar-3-piece')} className="link text-secondary duration-300 cursor-pointer py-1 hover:text-black">Khaddar 3 Piece Unstitched</div></li>
                                                <li><div onClick={() => handleTypeClick('khaddar-2-piece')} className="link text-secondary duration-300 cursor-pointer py-1 hover:text-black">Khaddar 2 Piece Unstitched</div></li>
                                                <li><div onClick={() => handleTypeClick('dhanak-3-piece')} className="link text-secondary duration-300 cursor-pointer py-1 hover:text-black">Dhanak 3 Piece Unstitched</div></li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li className='h-full relative'>
                                        <Link href="/pages/contact" className={`text-button-uppercase duration-300 h-full flex items-center justify-center gap-1 ${pathname === '/pages/contact' ? 'active' : ''}`}>
                                            Contact Us
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="right flex gap-12">
                            <div className="max-md:hidden search-icon flex items-center cursor-pointer relative">
                                <Icon.MagnifyingGlass size={24} color='black' onClick={openModalSearch} />
                                <div className="line absolute bg-line w-px h-6 -right-6"></div>
                            </div>
                            <div className="list-action flex items-center gap-4">
                                <div className="user-icon flex items-center justify-center cursor-pointer" onClick={handleLoginPopup}>
                                    <Icon.User size={24} color='black' />
                                </div>
                                <div className="cart-icon flex items-center relative cursor-pointer" onClick={openModalCart}>
                                    <Icon.Handbag size={24} color='black' />
                                    <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">{cartState.cartArray.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div id="menu-mobile" className={`${openMenuMobile ? 'open' : ''}`}>
                <div className="menu-container bg-white h-full">
                    <div className="container h-full">
                        <div className="menu-main h-full overflow-hidden">
                            <div className="heading py-2 relative flex items-center justify-center border-b border-line">
                                <div className="close-menu-mobile-btn absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface flex items-center justify-center cursor-pointer" onClick={handleMenuMobile}>
                                    <Icon.X size={14} />
                                </div>
                                <Link href={'/'} className='logo text-2xl font-semibold text-center'>ہمناز</Link>
                            </div>
                            <div className="list-nav mt-6">
                                <ul>
                                    <li>
                                        <Link href="/" onClick={handleMenuMobile} className="text-xl font-semibold flex items-center justify-between py-3 border-b border-line">
                                            Home
                                        </Link>
                                    </li>
                                    <li className={`${openSubNavMobile === 1 ? 'open' : ''} py-3 border-b border-line`}>
                                        <div onClick={() => handleOpenSubNavMobile(1)} className="text-xl font-semibold flex items-center justify-between cursor-pointer">
                                            Summer Collection
                                            <Icon.CaretRight size={20} />
                                        </div>
                                        <div className="sub-nav-mobile">
                                            <div className="back-btn flex items-center gap-3 cursor-pointer py-4 font-semibold" onClick={() => handleOpenSubNavMobile(1)}>
                                                <Icon.CaretLeft size={20} /> Back
                                            </div>
                                            <ul className="pl-4">
                                                <li className="py-2 text-secondary cursor-pointer hover:text-black" onClick={() => handleTypeClick('lawn-3-piece')}>Lawn 3 Piece Unstitched</li>
                                                <li className="py-2 text-secondary cursor-pointer hover:text-black" onClick={() => handleTypeClick('lawn-2-piece')}>Lawn 2 Piece Unstitched</li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li className={`${openSubNavMobile === 2 ? 'open' : ''} py-3 border-b border-line`}>
                                        <div onClick={() => handleOpenSubNavMobile(2)} className="text-xl font-semibold flex items-center justify-between cursor-pointer">
                                            Winter Collection
                                            <Icon.CaretRight size={20} />
                                        </div>
                                        <div className="sub-nav-mobile">
                                            <div className="back-btn flex items-center gap-3 cursor-pointer py-4 font-semibold" onClick={() => handleOpenSubNavMobile(2)}>
                                                <Icon.CaretLeft size={20} /> Back
                                            </div>
                                            <ul className="pl-4">
                                                <li className="py-2 text-secondary cursor-pointer hover:text-black" onClick={() => handleTypeClick('linen-3-piece')}>Linen 3 Piece Unstitched</li>
                                                <li className="py-2 text-secondary cursor-pointer hover:text-black" onClick={() => handleTypeClick('linen-2-piece')}>Linen 2 Piece Unstitched</li>
                                                <li className="py-2 text-secondary cursor-pointer hover:text-black" onClick={() => handleTypeClick('khaddar-3-piece')}>Khaddar 3 Piece Unstitched</li>
                                                <li className="py-2 text-secondary cursor-pointer hover:text-black" onClick={() => handleTypeClick('khaddar-2-piece')}>Khaddar 2 Piece Unstitched</li>
                                                <li className="py-2 text-secondary cursor-pointer hover:text-black" onClick={() => handleTypeClick('dhanak-3-piece')}>Dhanak 3 Piece Unstitched</li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li>
                                        <Link href="/pages/contact" onClick={handleMenuMobile} className="text-xl font-semibold flex items-center justify-between py-3 border-b border-line">
                                            Contact Us
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="menu_bar fixed bg-white bottom-0 left-0 w-full h-[70px] sm:hidden z-[101] border-t border-line">
                <div className="menu_bar-inner grid grid-cols-4 items-center h-full">
                    <Link href={'/'} className='menu_bar-link flex flex-col items-center gap-1'>
                        <Icon.House weight='bold' className='text-2xl' />
                        <span className="menu_bar-title caption2 font-semibold">Home</span>
                    </Link>
                    <div onClick={openModalSearch} className='menu_bar-link flex flex-col items-center gap-1 cursor-pointer'>
                        <Icon.MagnifyingGlass weight='bold' className='text-2xl' />
                        <span className="menu_bar-title caption2 font-semibold">Search</span>
                    </div>
                    <div onClick={handleLoginPopup} className='menu_bar-link flex flex-col items-center gap-1 cursor-pointer'>
                        <Icon.User weight='bold' className='text-2xl' />
                        <span className="menu_bar-title caption2 font-semibold">Account</span>
                    </div>
                    <Link href={'/cart'} className='menu_bar-link flex flex-col items-center gap-1'>
                        <div className="icon relative">
                            <Icon.Handbag weight='bold' className='text-2xl' />
                            <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">{cartState.cartArray.length}</span>
                        </div>
                        <span className="menu_bar-title caption2 font-semibold">Cart</span>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default MenuOne