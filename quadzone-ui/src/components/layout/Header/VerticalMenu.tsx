import SearchBar from "../../shared/SearchBar";
import CartIcon from "../../shared/CartIcon";

const VerticalMenu = () => {

    return (
        <>
            <style>{`
                .vertical-menu.v1 .u-header__nav-item.hs-mega-menu-opened .u-header__sub-menu,
                .vertical-menu.v1 .u-header__nav-item.hs-sub-menu-opened .u-header__sub-menu,
                .u-header .vertical-menu.v1 .u-header__nav-item.hs-mega-menu-opened .u-header__sub-menu,
                .u-header .vertical-menu.v1 .u-header__nav-item.hs-sub-menu-opened .u-header__sub-menu,
                .u-header + main .vertical-menu.v1 .u-header__nav-item.hs-mega-menu-opened .u-header__sub-menu,
                .u-header + main .vertical-menu.v1 .u-header__nav-item.hs-sub-menu-opened .u-header__sub-menu {
                    border-bottom: 2px solid #667eea !important;
                    border-right: 2px solid #667eea !important;
                }
                #basicsHeadingOne.card-collapse,
                #basicsHeadingOne.card-collapse:hover,
                #basicsHeadingOne.card-collapse:active,
                #basicsHeadingOne.card-collapse:focus {
                    background-color: #667eea !important;
                }
                #basicsHeadingOne .card-btn,
                #basicsHeadingOne .card-btn:hover,
                #basicsHeadingOne .card-btn:active,
                #basicsHeadingOne .card-btn:focus {
                    background-color: #667eea !important;
                    color: #fff !important;
                }
            `}</style>
            <div className="d-none d-xl-block" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            <div className="container">
                <div className="row align-items-stretch min-height-50">
                    {/* Vertical Menu */}
                    <div className="col-md-auto d-none d-xl-flex align-items-end">
                        <div className="max-width-270 min-width-270">

                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="col align-self-center">
                        <SearchBar />
                    </div>

                    {/* Header Icons */}
                    <div className="col-md-auto align-self-center">
                        <div className="d-flex">
                            <ul className="d-flex list-unstyled mb-0">
                                <li className="col">
                                    <a
                                        href="/compare"
                                        className="text-gray-90"
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="Compare">
                                        <i className="font-size-22 ec ec-compare"></i>
                                    </a>
                                </li>
                                <li className="col">
                                    <a
                                        href="/wishlist"
                                        className="text-gray-90"
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="Favorites">
                                        <i className="font-size-22 ec ec-favorites"></i>
                                    </a>
                                </li>
                                <CartIcon />
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default VerticalMenu;
