export default function Nav({categories}) {
    return (
        <div className="flex justify-around flex-wrap gap-1">
            {categories.map((category) => {
                return (
                    <a key={category.cat_name} href={'#' + category.cat_name} className="italic">
                        {category.cat_short_desc}
                    </a>
                )
            })}
        </div>
    )
}