import { useState } from "react";

const SearchBar = ({ className = "" }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
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
                    
                />
                <div className="input-group-append">
                    
                    <button className="btn btn-dark height-40 py-2 px-3 rounded-right-pill" type="submit">
                        <span className="ec ec-search font-size-24"></span>
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SearchBar;
