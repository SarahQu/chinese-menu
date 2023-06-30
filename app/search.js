import { useState } from 'react'; 

export default function Search({allItems, onClickSearchResult}) {
    const [inputValue, setInputValue] = useState('')
    const [searchResults, setSearchResults] = useState([])
    

    let search = (e) => {
        let searchInput = e.target.value
        let searchKey = searchInput.toLowerCase()

        let results = []
        if(searchKey !== undefined && searchKey !== '') {
            results = Object.entries(allItems).filter(
                ([k, v]) => {
                    return v.desc.toLowerCase().indexOf(searchKey) !== -1 || v.desc_ch.indexOf(searchKey) !== -1
                })
        }
        
        setSearchResults(results)
        setInputValue(searchInput)
    }   

    let onClickResult = (e) => {
        onClickSearchResult(e)
        setSearchResults([])
        setInputValue('')
    }

    return (
        <div className=''>
            <input 
                type="text" 
                class="border-[1px] pl-1 border-solid border-black rounded" 
                value={inputValue}
                onChange={search} 
                placeholder="搜索...">
            </input>
            {searchResults.length > 0 && (
                <div class="">
                    <ul class="absolute bg-slate-100 w-1/2 sm:w-1/3 max-h-[250px] overflow-auto">
                        {searchResults.map(([name, value])=> {
                            return (
                                <li 
                                    class="cursor-pointer hover:bg-slate-300"
                                    key={name} 
                                    data-name={name}
                                    data-price={value.price}
                                    onClick={onClickResult}
                                >
                                {value.desc_ch} {value.desc} ${value.price}
                            </li>)
                        })}
                    </ul>
                </div>
            )}
        </div>
    )
}