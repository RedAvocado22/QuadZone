import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ className = "" }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Only navigate if search query is not empty
        if (searchQuery.trim()) {
            // Navigate to shop page with search query parameter
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery(""); // Clear input after search
        }
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
                    
                    <button className="btn btn-dark height-40 py-2 px-3 rounded-right-pill" type="submit">
                        <span className="ec ec-search font-size-24"></span>
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SearchBar;
