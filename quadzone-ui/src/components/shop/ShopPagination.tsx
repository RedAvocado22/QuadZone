interface ShopPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const ShopPagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: ShopPaginationProps) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <nav
            className="d-md-flex justify-content-between align-items-center border-top pt-3"
            aria-label="Page navigation">
            <div className="text-center text-md-left mb-3 mb-md-0">
                Showing {startItem}–{endItem} of {totalItems} results
            </div>
            <ul className="pagination mb-0 pagination-shop justify-content-center justify-content-md-start">
                {[...Array(totalPages)].map((_, index) => (
                    <li key={index + 1} className="page-item">
                        <a
                            className={`page-link ${currentPage === index + 1 ? "current" : ""}`}
                            href="javascript:;"
                            onClick={() => onPageChange(index + 1)}>
                            {index + 1}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default ShopPagination;
