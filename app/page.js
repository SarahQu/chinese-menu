'use client';

import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState, useReducer } from 'react'
import Category from './category';
import Search from './search';
import Nav from './nav';
import itemReducer from './itemReducer';
import { MENU } from './menu';


const inter = Inter({ subsets: ['latin'] })

const initialItem = MENU.reduce((allItems, curValue) => { 
  return {
    ...allItems, 
    ...curValue.items,
    'total': {desc: 'Total', desc_ch: '总价', price: 0},
    'noDiscount': {desc: 'noDiscount', desc_ch: '', price: 0}
  } 
}, {})

const TAX_RATE = 0.05
const PICKUP_DISCOUNT = 0.9


export default function Home() {
  const [pickUp, setPickUp] = useState(false)
  const [item, dispatch] = useReducer(itemReducer, initialItem);

  // 5% 
  // 先打折，先加税
  let pickUpDiscount = 0
  let afterDiscountPrice = 0
  let tax = 0

  let handleIncreaseItem = (e) => {
    dispatch({
        type: 'increase',
        name: e.target.dataset.name,
        price: e.target.dataset.price
    }) 
  }

  let handleDecreaseItem = (e) => {
    dispatch({
        type: 'decrease',
        name: e.target.dataset.name,
        price: e.target.dataset.price
    }) 
  }

  let handleChangPickup = () => {
    setPickUp(!pickUp)
  }

  let handleClear = () => {
    dispatch({
        type: 'clear',
        initialItem: initialItem
    }) 
  }

  let getPickUpDiscount = () => {
    let totalPrice = Number(item['total'].price)
    let noDiscount = Number(item['noDiscount'].price)

    pickUpDiscount = pickUp ? ((totalPrice - noDiscount) * (1 - PICKUP_DISCOUNT)).toFixed(2): 0
    return pickUpDiscount
  }

  let getAfterDiscountPrice = () => {
    afterDiscountPrice = (Number(item['total'].price) - pickUpDiscount).toFixed(2);

    return afterDiscountPrice
  }

  let getTax = () => {
    tax = (afterDiscountPrice * TAX_RATE).toFixed(2)
    return tax
  }

  let getFinalPrice = () => {
    return (Number(afterDiscountPrice) + Number(tax)).toFixed(2)
  }

  return (
    <div>
      <Head>
        <title>餐馆</title>
      </Head>
      <div className='fixed w-full bg-slate-50 p-2'>
        {/* <h1 className="text-center text-2xl font-bold">菜单</h1> */}
        <Nav categories={MENU}></Nav>
        <div class="flex text-center">
          <div class="basis-1/3">
            <input type="checkbox" id="pickup" name="pickup" checked={pickUp} onChange={handleChangPickup}></input>
            <label htmlFor="pickup"> Pick Up</label>
          </div>
          <div class="basis-1/3">
            <Search allItems={item} onClickSearchResult={handleIncreaseItem}></Search>
          </div>
          <div class="basis-1/3">
            <span class="cursor-pointer font-bold" onClick={handleClear}>清空</span>
          </div>
        </div>
      </div>

      <div className="pt-[120px] sm:pt-[60px] bg-white">
          <div className="float-left w-[33%] fixed z-[-1] h-[70%] overflow-y-scroll break-words border-[1px] border-blue-500 border-solid p-1 m-2">
              <div class="sticky top-0 bg-white">
                <p class="sm:text-lg font-bold">价格 Price: </p>
                <p class="sm:text-lg">总价（税前）: ${Number(item['total'].price)}</p>
                <p class="sm:text-lg">自提折扣 Pick Up Discount (10%): ${getPickUpDiscount()}</p>
                <p class="sm:text-lg">折后价: ${getAfterDiscountPrice()}</p>
                <p class="sm:text-lg">5% GST: ${getTax()}</p>
                <p class="sm:text-lg font-bold">总价（税后最终价）: ${getFinalPrice()}</p>
              </div>
              <p className="sm:text-xl font-bold break-all">已点：</p>
              <ul class="list-disc list-inside">
              { 
                Object.entries(item).filter(([k, v])=> {return v.quantity > 0 && k != 'total'}).map(([k, v]) => 
                  <li key={k}>{v.desc_ch} {v.desc} ${v.price}
                    <span class='ml-3'>{v.quantity}</span>       
                    <span class="ml-5 font-bold cursor-pointer" data-name={k} data-price={v.price} onClick={handleIncreaseItem}>+</span>
                    <span class="ml-5 font-bold cursor-pointer" data-name={k} data-price={v.price} onClick={handleDecreaseItem}>-</span>
                  </li>
                )
              }
              </ul>
          </div>

          <div className="float-right w-[66%] sm:flex">
            <div className="sm:basis-1/2">
              {MENU.slice(0, Math.ceil(MENU.length / 2)).map((category) => {
                return <Category key={category.cat_name} category={category} onIncreaseItem={handleIncreaseItem}> </Category>
              })}
            </div>
            <div className="sm:basis-1/2">
              {MENU.slice(Math.ceil(MENU.length / 2)).map((category) => {
                return <Category key={category.cat_name} category={category} onIncreaseItem={handleIncreaseItem}> </Category>
              })}
            </div>
          </div>

          
      </div>
    </div>
  )
}