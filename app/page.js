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
    'total': {desc: 'Total', desc_ch: '总价', price: 0}
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


  let getPrice = (price, pickUp) => {
    let afteTax = (price * (1 + TAX_RATE)).toFixed(2)
    let pickUpDiscount = ((price * (1 + TAX_RATE)) * PICKUP_DISCOUNT).toFixed(2)

    return pickUp? `税前: $${price}, 税后: $${afteTax}, 折扣后: $${pickUpDiscount}` : `税前: $${price}, 税后: $${afteTax}`
  }

  return (
    <>
      <Head>
        <title>餐馆</title>
      </Head>
      <h1 class="text-center text-2xl font-bold mt-2">菜单</h1>
      <div class="flex text-center">
        <div class="basis-1/4">
          <input type="checkbox" id="pickup" name="pickup" checked={pickUp} onChange={handleChangPickup}></input>
          <label htmlFor="pickup"> Pick Up</label>
        </div>
        <div class="basis-1/4">
          <Search allItems={item} onClickSearchResult={handleIncreaseItem}></Search>
        </div>
        <div class="basis-1/4">
          <span class="cursor-pointer font-bold" onClick={handleClear}>清空</span>
        </div>
      </div>


      <h2 class="text-xl font-bold pl-3">总价 Total: </h2>
      <h2 class="text-xl pl-3">{getPrice(Number(item['total'].price), pickUp)}</h2>
      <div class="border-[1px] border-blue-500 border-solid pl-1 ml-2 mt-2">
        <p class="font-bold ">已点：</p>
        { 
          Object.entries(item).filter(([k, v])=> {return v.quantity > 0 && k != 'total'}).map(([k, v]) => 
            <p key={k}>{v.desc_ch} {v.desc} ${v.price}
            <span class='ml-3'>{v.quantity}</span>       
            <span class="ml-5 font-bold cursor-pointer" data-name={k} data-price={v.price} onClick={handleIncreaseItem}>+</span>
            <span class="ml-5 font-bold cursor-pointer" data-name={k} data-price={v.price} onClick={handleDecreaseItem}>-</span>
            </p>
          )
        }
      </div>

      <div class="flex">
          <div class="basis-1/2">
            {MENU.slice(0, Math.ceil(MENU.length / 2)).map((category) => {
              return <Category key={category.cat_name} category={category} onIncreaseItem={handleIncreaseItem}> </Category>
            })}
          </div>
          <div class="basis-1/2">
            {MENU.slice(Math.ceil(MENU.length / 2)).map((category) => {
              return <Category key={category.cat_name} category={category} onIncreaseItem={handleIncreaseItem}> </Category>
            })}
          </div>
      </div>
    </>
  )
}