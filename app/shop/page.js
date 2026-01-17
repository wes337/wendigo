"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { box, smallBox, insetShadow, dropShadow } from "@/app/styles";
import { createPortal } from "react-dom";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const PRODUCTS = [
  {
    id: "1",
    name: "Something",
    description: "The description of the product would go here.",
    price: 9999,
  },
  {
    id: "2",
    name: "T-Shirt",
    description: "This is a T-Shirt, describe the T-Shirt here.",
    price: 2499,
  },
  {
    id: "3",
    name: "Debris",
    description: "A pile of debris for sale.",
    price: 999,
  },
  {
    id: "4",
    name: "Box",
    description: "A cardboard box for sale.",
    price: 1499,
  },
];

export default function Shop() {
  const [currentProduct, setCurrentProduct] = useState(null);

  return (
    <>
      <div className="mt-5 w-[600px] max-w-[90vw]">
        <div className="flex font-bold text-sm mb-2.5">
          <Image
            className="w-[16px] h-[16px] mr-1"
            src={`/icons/small/shop.png`}
            width={16}
            height={16}
            alt=""
            unoptimized
          />
          Shop
          <button className="group flex items-center ml-auto text-xs cursor-pointer">
            <Image
              className="w-[16px] h-[16px] mr-1"
              src={`/icons/small/cart.png`}
              width={16}
              height={16}
              alt=""
            />
            <div className="text-zinc-600 group-hover:text-blue-600">
              Cart (0)
            </div>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {PRODUCTS.map((product) => {
            return (
              <button
                key={product.id}
                className={`relative group ${smallBox} h-[200px] md:h-[300px] cursor-pointer hover:border-blue-600/75`}
                onClick={() => setCurrentProduct(product)}
              >
                <div className="flex flex-col drop-shadow h-full w-full shadow-md">
                  <div
                    className={`flex items-center justify-center bg-zinc-500/25 h-full rounded-[4px] border-1 border-zinc-500/50 ${insetShadow}`}
                  >
                    <Image
                      className="opacity-75 group-hover:opacity-100"
                      src={`/icons/help.png`}
                      width={32}
                      height={32}
                      alt=""
                    />
                  </div>
                </div>
                <div className="flex w-full items-center leading-none">
                  <div className="text-blue-600 font-bold group-hover:underline">
                    {product.name}
                  </div>
                  <div className="ml-auto">
                    {currencyFormatter.format(product.price / 100)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {currentProduct &&
        createPortal(
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-zinc-800/50 z-100">
            <div className={`relative ${box} rounded-[4px]`}>
              <button
                className="absolute top-[4px] right-[4px] cursor-pointer z-1"
                onClick={() => setCurrentProduct(null)}
              >
                <Image
                  className="w-[16px] h-[16px]"
                  src={`/icons/small/cross.png`}
                  width={16}
                  height={16}
                  alt=""
                  unoptimized
                />
              </button>
              <div className="h-[600px] max-h-[60vh]">
                <div className="flex flex-col drop-shadow h-full w-full shadow-md">
                  <div
                    className={`flex items-center justify-center bg-zinc-500/25 h-full rounded-[4px] border-1 border-zinc-500/50 ${insetShadow}`}
                  >
                    <Image
                      className="opacity-75 group-hover:opacity-100"
                      src={`/icons/help.png`}
                      width={32}
                      height={32}
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <div className="font-bold">{currentProduct.name}</div>
                  <div className="text-zinc-800 ml-auto">
                    {currencyFormatter.format(currentProduct.price / 100)}
                  </div>
                </div>
                <div className="text-sm">{currentProduct.description}</div>
              </div>
              <div className="flex gap-5 ml-auto">
                <button
                  className={`flex items-center justify-center cursor-pointer text-blue-600 text-sm px-[12px] py-[8px] bg-zinc-300 hover:bg-zinc-200 active:bg-zinc-200 border-1 border-zinc-500/50 rounded-[4px] ${insetShadow} ${dropShadow}`}
                >
                  <Image
                    className="h-[16px] w-[16px] mr-1"
                    src={`/icons/small/cart_put.png`}
                    width={16}
                    height={16}
                    alt=""
                  />
                  Add to Cart
                </button>
                <button
                  className={`flex items-center justify-center cursor-pointer text-blue-600 text-sm px-[12px] py-[8px] bg-zinc-300 hover:bg-zinc-200 active:bg-zinc-200 border-1 border-zinc-500/50 rounded-[4px] ${insetShadow} ${dropShadow}`}
                >
                  <Image
                    className="h-[16px] w-[16px] mr-1"
                    src={`/icons/small/basket_go.png`}
                    width={16}
                    height={16}
                    alt=""
                  />
                  Buy It Now
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
