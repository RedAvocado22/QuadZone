import type { ViewMode, SortOption } from '../../types/shop';

interface ShopControlBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onToggleSidebar: () => void;
}

const ShopControlBar = ({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  itemsPerPage,
  onItemsPerPageChange,
  currentPage,
  totalPages,
  onPageChange,
  onToggleSidebar
}: ShopControlBarProps) => {
  return (
    <div className="bg-gray-1 flex-center-between borders-radius-9 py-1">
      {/* Mobile Filter Toggle */}
      <div className="d-xl-none">
        <a 
          className="btn btn-sm py-1 font-weight-normal"
          href="javascript:;"
          onClick={onToggleSidebar}
        >
          <i className="fas fa-sliders-h"></i> <span className="ml-1">Filters</span>
        </a>
      </div>

      {/* View Mode Tabs */}
      <div className="px-3 d-none d-xl-block">
        <ul className="nav nav-tab-shop" role="tablist">
          <li className="nav-item">
            <a 
              className={`nav-link ${viewMode === 'grid' ? 'active' : ''}`}
              href="javascript:;"
              onClick={() => onViewModeChange('grid')}
            >
              <div className="d-md-flex justify-content-md-center align-items-md-center">
                <i className="fa fa-th"></i>
              </div>
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${viewMode === 'grid-details' ? 'active' : ''}`}
              href="javascript:;"
              onClick={() => onViewModeChange('grid-details')}
            >
              <div className="d-md-flex justify-content-md-center align-items-md-center">
                <i className="fa fa-align-justify"></i>
              </div>
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${viewMode === 'list' ? 'active' : ''}`}
              href="javascript:;"
              onClick={() => onViewModeChange('list')}
            >
              <div className="d-md-flex justify-content-md-center align-items-md-center">
                <i className="fa fa-list"></i>
              </div>
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${viewMode === 'list-small' ? 'active' : ''}`}
              href="javascript:;"
              onClick={() => onViewModeChange('list-small')}
            >
              <div className="d-md-flex justify-content-md-center align-items-md-center">
                <i className="fa fa-th-list"></i>
              </div>
            </a>
          </li>
        </ul>
      </div>

      {/* Sorting and Items per Page */}
      <div className="d-flex">
        {/* Sort By */}
        <form method="get">
          <select 
            className="js-select selectpicker dropdown-select max-width-200 max-width-160-sm right-dropdown-0 px-2 px-xl-0"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
          >
            <option value="default">Default sorting</option>
            <option value="popularity">Sort by popularity</option>
            <option value="rating">Sort by average rating</option>
            <option value="latest">Sort by latest</option>
            <option value="price-low">Sort by price: low to high</option>
            <option value="price-high">Sort by price: high to low</option>
          </select>
        </form>

        {/* Items per Page */}
        <form method="POST" className="ml-2 d-none d-xl-block">
          <select 
            className="js-select selectpicker dropdown-select max-width-120"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          >
            <option value="20">Show 20</option>
            <option value="40">Show 40</option>
            <option value="100">Show All</option>
          </select>
        </form>
      </div>

      {/* Page Navigation */}
      <nav className="px-3 flex-horizontal-center text-gray-20 d-none d-xl-flex">
        <form method="post" className="min-width-50 mr-1">
          <input 
            size={2}
            min={1}
            max={totalPages} 
            step={1}
            type="number" 
            className="form-control text-center px-2 height-35" 
            value={currentPage}
            onChange={(e) => onPageChange(Number(e.target.value))}
          />
        </form>
        of {totalPages}
        <a 
          className={`text-gray-30 font-size-20 ml-2 ${currentPage >= totalPages ? 'disabled' : ''}`}
          href="javascript:;"
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        >
          →
        </a>
      </nav>
    </div>
  );
};

export default ShopControlBar;

