export default function Category({category, onIncreaseItem}) {

    return (
        <div class="border-[1px] border-solid border-black m-2 p-1">
          <h2 class="font-bold">{category.cat_desc_ch} {category.cat_desc}</h2>
          <ul>
            {
              Object.entries(category.items).map(([name, value])=> {
                return (<li 
                  onClick={onIncreaseItem} 
                  class="hover:bg-slate-300 cursor-pointer"
                  key={name} 
                  data-name={name}
                  data-price={value.price}
                  >
                    {value.desc_ch} {value.desc} ${value.price}
                </li>)
              })
            }
          </ul>
        </div>
    )
  }