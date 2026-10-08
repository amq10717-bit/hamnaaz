'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { ProductType } from '@/type/ProductType'
import Product from '../Product/Product';
import Slider from 'rc-slider';
// @ts-ignore
import 'rc-slider/assets/index.css'
import HandlePagination from '../Other/HandlePagination';
import { useSearchParams } from 'next/navigation';

interface Props {
    data: Array<ProductType>
    productPerPage: number
    dataType: string | null | undefined
    gender: string | null
    category: string | null
}

const ShopBreadCrumb1: React.FC<Props> = ({ data, productPerPage, gender, category }) => {
    const searchParams = useSearchParams();
    const collectionParam = searchParams.get('collection');
    const typeParam = searchParams.get('type');

    const [showOnlySale, setShowOnlySale] = useState(false)
    const [sortOption, setSortOption] = useState('');
    const [type, setType] = useState<string | null>(typeParam)
    const [size, setSize] = useState<string | null>()
    const [color, setColor] = useState<string | null>()
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 5000 });
    const [currentPage, setCurrentPage] = useState(0);
    const productsPerPage = productPerPage;
    const offset = currentPage * productsPerPage;

    // Ensure state updates properly if the user navigates via homepage links
    useEffect(() => {
        setType(typeParam);
        setCurrentPage(0);
    }, [typeParam]);

    const handleShowOnlySale = () => {
        setShowOnlySale(toggleSelect => !toggleSelect)
        setCurrentPage(0);
    }

    const handleSortChange = (option: string) => {
        setSortOption(option);
        setCurrentPage(0);
    };

    const handleType = (selectedType: string | null) => {
        setType((prevType) => (prevType === selectedType ? null : selectedType))
        setCurrentPage(0);
    }

    const handleSize = (selectedSize: string) => {
        setSize((prevSize) => (prevSize === selectedSize ? null : selectedSize))
        setCurrentPage(0);
    }

    const handlePriceChange = (values: number | number[]) => {
        if (Array.isArray(values)) {
            setPriceRange({ min: values[0], max: values[1] });
            setCurrentPage(0);
        }
    };

    const handleClearAll = () => {
        setShowOnlySale(false);
        setSortOption('');
        setType(null);
        setSize(null);
        setColor(null);
        setPriceRange({ min: 0, max: 5000 });
        setCurrentPage(0);
    };

    // Filter product
    let filteredData = data.filter(product => {
        let isShowOnlySaleMatched = true;
        if (showOnlySale) {
            isShowOnlySaleMatched = product.sale
        }

        let isCollectionMatched = true;
        if (collectionParam === 'summer') {
            isCollectionMatched = (product as any).tags?.some((tag: string) => tag.toLowerCase().includes('lawn')) || false;
        } else if (collectionParam === 'winter') {
            isCollectionMatched = (product as any).tags?.some((tag: string) =>
                tag.toLowerCase().includes('linen') ||
                tag.toLowerCase().includes('khaddar') ||
                tag.toLowerCase().includes('dhanak')
            ) || false;
        }

        let isTypeMatched = true;
        if (type) {
            // Split "lawn-3-piece" into ["lawn", "3", "piece"] and check if ALL words exist in the title/tags
            const searchTerms = type.replace(/-/g, ' ').toLowerCase().split(' ');
            const productName = product.name?.toLowerCase() || '';
            const productTags = (product as any).tags || [];

            isTypeMatched = searchTerms.every(term =>
                productName.includes(term) ||
                productTags.some((tag: string) => tag.toLowerCase().includes(term))
            );
        }

        let isSizeMatched = true;
        if (size) {
            isSizeMatched = product.sizes.includes(size)
        }

        let isPriceRangeMatched = true;
        if (priceRange.min !== 0 || priceRange.max !== 5000) {
            isPriceRangeMatched = product.price >= priceRange.min && product.price <= priceRange.max;
        }

        let isColorMatched = true;
        if (color) {
            isColorMatched = product.variation.some(item => item.color === color)
        }

        return isShowOnlySaleMatched && isCollectionMatched && isTypeMatched && isSizeMatched && isColorMatched && isPriceRangeMatched
    })

    // Create a copy array filtered to sort
    let sortedData = [...filteredData];

    if (sortOption === 'soldQuantityHighToLow') {
        filteredData = sortedData.sort((a, b) => b.sold - a.sold)
    } else if (sortOption === 'discountHighToLow') {
        filteredData = sortedData
            .sort((a, b) => (
                (Math.floor(100 - ((b.price / (b.originPrice || 1)) * 100))) - (Math.floor(100 - ((a.price / (a.originPrice || 1)) * 100)))
            ))
    } else if (sortOption === 'priceHighToLow') {
        filteredData = sortedData.sort((a, b) => b.price - a.price)
    } else if (sortOption === 'priceLowToHigh') {
        filteredData = sortedData.sort((a, b) => a.price - b.price)
    }

    const totalProducts = filteredData.length
    const selectedType = type
    const selectedSize = size

    // Find page number based on filteredData
    const pageCount = Math.ceil(filteredData.length / productsPerPage);

    // Get product data for current page safely
    let currentProducts: ProductType[] = [];
    if (filteredData.length > 0) {
        currentProducts = filteredData.slice(offset, offset + productsPerPage);
    }

    const handlePageChange = (selected: number) => {
        setCurrentPage(selected);
    };

    return (
        <>
            <div className="breadcrumb-block style-img">
                <div className="breadcrumb-main bg-linear overflow-hidden">
                    <div className="container lg:pt-[134px] pt-24 pb-10 relative">
                        <div className="main-content w-full h-full flex flex-col items-center justify-center relative z-[1]">
                            <div className="text-content">
                                <div className="heading2 text-center capitalize">
                                    {collectionParam ? `${collectionParam} Collection` : (typeParam ? typeParam.replace(/-/g, ' ') : 'Shop')}
                                </div>
                                <div className="link flex items-center justify-center gap-1 caption1 mt-3">
                                    <Link href={'/'}>Homepage</Link>
                                    <Icon.CaretRight size={14} className='text-secondary2' />
                                    <div className='text-secondary2 capitalize'>
                                        {collectionParam ? `${collectionParam} Collection` : (typeParam ? typeParam.replace(/-/g, ' ') : 'Shop')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
                <div className="container">
                    <div className="flex max-md:flex-wrap max-md:flex-col-reverse gap-y-8">
                        <div className="sidebar lg:w-1/4 md:w-1/3 w-full md:pr-12">
                            <div className="filter-type pb-8 border-b border-line">
                                <div className="heading6">Fabric & Style</div>
                                <div className="list-type mt-4">
                                    {['Lawn 3 Piece', 'Lawn 2 Piece', 'Linen 3 Piece', 'Linen 2 Piece', 'Khaddar 3 Piece', 'Khaddar 2 Piece', 'Dhanak 3 Piece'].map((item, index) => {
                                        const slugFormat = item.toLowerCase().replace(/ /g, '-');
                                        return (
                                            <div
                                                key={index}
                                                className={`item flex items-center justify-between cursor-pointer ${type === slugFormat ? 'active' : ''}`}
                                                onClick={() => handleType(slugFormat)}
                                            >
                                                <div className={`text-secondary has-line-before hover:text-black ${type === slugFormat ? 'text-black font-semibold' : ''}`}>{item}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="filter-price pb-8 border-b border-line mt-8">
                                <div className="heading6">Price Range</div>
                                <Slider
                                    range
                                    defaultValue={[0, 5000]}
                                    min={0}
                                    max={5000}
                                    onChange={handlePriceChange}
                                    className='mt-5'
                                />
                                <div className="price-block flex items-center justify-between flex-wrap mt-4">
                                    <div className="min flex items-center gap-1">
                                        <div>Min:</div>
                                        <div className='price-min'>Rs
                                            <span>{priceRange.min}</span>
                                        </div>
                                    </div>
                                    <div className="min flex items-center gap-1">
                                        <div>Max:</div>
                                        <div className='price-max'>Rs
                                            <span>{priceRange.max}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="list-product-block lg:w-3/4 md:w-2/3 w-full md:pl-3">
                            <div className="filter-heading flex items-center justify-between gap-5 flex-wrap">
                                <div className="left flex has-line items-center flex-wrap gap-5">
                                    <div className="choose-layout flex items-center gap-2">
                                        <div className="item three-col w-8 h-8 border border-line rounded flex items-center justify-center cursor-pointer active">
                                            <div className='flex items-center gap-0.5'>
                                                <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                                <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                                <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="check-sale flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="filterSale"
                                            id="filter-sale"
                                            className='border-line cursor-pointer'
                                            onChange={handleShowOnlySale}
                                        />
                                        <label htmlFor="filter-sale" className='caption1 cursor-pointer'>Show only products on sale</label>
                                    </div>
                                </div>
                                <div className="right flex items-center gap-3">
                                    <div className="select-block relative">
                                        <select
                                            id="select-filter"
                                            name="select-filter"
                                            className='caption1 py-2 pl-3 md:pr-20 pr-10 rounded-lg border border-line cursor-pointer'
                                            onChange={(e) => { handleSortChange(e.target.value) }}
                                            defaultValue={'Sorting'}
                                        >
                                            <option value="Sorting" disabled>Sorting</option>
                                            <option value="soldQuantityHighToLow">Best Selling</option>
                                            <option value="discountHighToLow">Best Discount</option>
                                            <option value="priceHighToLow">Price High To Low</option>
                                            <option value="priceLowToHigh">Price Low To High</option>
                                        </select>
                                        <Icon.CaretDown size={12} className='absolute top-1/2 -translate-y-1/2 md:right-4 right-2 pointer-events-none' />
                                    </div>
                                </div>
                            </div>

                            <div className="list-filtered flex items-center gap-3 mt-4">
                                <div className="total-product">
                                    {totalProducts}
                                    <span className='text-secondary pl-1'>Products Found</span>
                                </div>
                                {
                                    (selectedType || selectedSize) && (
                                        <>
                                            <div className="list flex items-center gap-3">
                                                <div className='w-px h-4 bg-line'></div>
                                                {selectedType && (
                                                    <div className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer" onClick={() => { setType(null) }}>
                                                        <Icon.X />
                                                        <span>{selectedType.replace(/-/g, ' ')}</span>
                                                    </div>
                                                )}
                                                {selectedSize && (
                                                    <div className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer" onClick={() => { setSize(null) }}>
                                                        <Icon.X />
                                                        <span>{selectedSize}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div
                                                className="clear-btn flex items-center px-2 py-1 gap-1 rounded-full border border-red cursor-pointer"
                                                onClick={handleClearAll}
                                            >
                                                <Icon.X color='rgb(219, 68, 68)' />
                                                <span className='text-button-uppercase text-red'>Clear All</span>
                                            </div>
                                        </>
                                    )
                                }
                            </div>

                            <div className="list-product hide-product-sold grid lg:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px] mt-7">
                                {currentProducts.length === 0 ? (
                                    <div className="col-span-full text-center text-secondary py-10">
                                        No products match the selected criteria. Try removing a filter or adjusting the price range.
                                    </div>
                                ) : (
                                    currentProducts.map((item) => (
                                        <Product key={item.id} data={item} type='grid' style='style-1' />
                                    ))
                                )}
                            </div>

                            {pageCount > 1 && (
                                <div className="list-pagination flex items-center md:mt-10 mt-7">
                                    <HandlePagination pageCount={pageCount} onPageChange={handlePageChange} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default ShopBreadCrumb1