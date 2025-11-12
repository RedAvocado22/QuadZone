import { useState } from "react";

const SearchBar = ({ className = "" }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("all");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery, "in category:", category);
        // Implement search functionality
    };

    return (
        <form className={`js-focus-state ${className}`} onSubmit={handleSearch}>
            <label className="sr-only" htmlFor="searchProduct">
                Search
            </label>
            <div className="input-group">
                <input
                    type="text"
                    className="form-control py-2 pl-5 font-size-15 border-0 height-40 rounded-left-pill"
                    name="search"
                    id="searchProduct"
                    placeholder="Search for Products"
                    aria-label="Search for Products"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="input-group-append">
                    <select
                        className="js-select selectpicker dropdown-select custom-search-categories-select"
                        data-style="btn height-40 text-gray-60 font-weight-normal border-0 rounded-0 bg-white px-5 py-2"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}>
                        <option value="all">All Categories</option>
                        <option value="laptops">Laptops</option>
                        <option value="smartphones">Smartphones</option>
                        <option value="cameras">Cameras</option>
                    </select>
                    <button className="btn btn-dark height-40 py-2 px-3 rounded-right-pill" type="submit">
                        <span className="ec ec-search font-size-24"></span>
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SearchBar;
