'use client';

import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState, useReducer } from 'react'
import Category from './category';
import Search from './search';
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

const TAX_RATE = 0.07
const PICKUP_DISCOUNT = 0.9


export default function Home() {
  const [pickUp, setPickUp] = useState(false)
  const [item, dispatch] = useReducer(itemReducer, initialItem);

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


  let getPrice = (price, noDiscount, pickUp) => {
    let afteTax = (price * (1 + TAX_RATE)).toFixed(2)
    let pickUpDiscount = (((price - noDiscount) * PICKUP_DISCOUNT + noDiscount) * (1 + TAX_RATE)).toFixed(2)

    return pickUp? `税前: $${price}, 税后: $${afteTax}, 折扣后: $${pickUpDiscount}` : `税前: $${price}, 税后: $${afteTax}`
  }

  return (
    <>
      <Head>
        <title>餐馆</title>
      </Head>
      <div className='fixed w-full bg-slate-50 p-1'>
        <h1 className="text-center text-2xl font-bold">菜单</h1>
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

      

      <div className="flex flex-wrap-reverse pt-[70px]">
          <div className="basis-1/3 order-1">
            {MENU.slice(0, Math.ceil(MENU.length / 2)).map((category) => {
              return <Category key={category.cat_name} category={category} onIncreaseItem={handleIncreaseItem}> </Category>
            })}
          </div>
          <div className="basis-1/3 order-2">
            {MENU.slice(Math.ceil(MENU.length / 2)).map((category) => {
              return <Category key={category.cat_name} category={category} onIncreaseItem={handleIncreaseItem}> </Category>
            })}
          </div>

          <div class="basis-1/3 order-3">
            <div class="fixed w-[33%] border-[1px] border-blue-500 border-solid p-1 mt-2">
              <p className="text-xl font-bold break-all">已点：</p>
              { 
                Object.entries(item).filter(([k, v])=> {return v.quantity > 0 && k != 'total'}).map(([k, v]) => 
                  <p key={k}>{v.desc_ch} {v.desc} ${v.price}
                    <span class='ml-3'>{v.quantity}</span>       
                    <span class="ml-5 font-bold cursor-pointer" data-name={k} data-price={v.price} onClick={handleIncreaseItem}>+</span>
                    <span class="ml-5 font-bold cursor-pointer" data-name={k} data-price={v.price} onClick={handleDecreaseItem}>-</span>
                  </p>
                )
              }
              <p class="text-lg font-bold">总价 Total: </p>
              <p class="text-lg">{getPrice(Number(item['total'].price), Number(item['noDiscount'].price), pickUp)}</p>
            </div>
          </div>
      </div>
    </>
  )
}