import Topbar from "./Topbar";
import MiddleHeader from "./MiddleHeader";
import VerticalMenu from "./VerticalMenu";
import MobileSidebar from "./MobileSidebar";

const Header = () => {
    return (
        <>
            <header id="header" className="u-header u-header-left-aligned-nav">
                <div className="u-header__section">
                    <Topbar />
                    <MiddleHeader />
                    <VerticalMenu />
                </div>
            </header>
            <MobileSidebar />
        </>
    );
};

export default Header;
