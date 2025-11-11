import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import MobileSidebar from "./Header/MobileSidebar";
import AccountSidebar from "../shared/AccountSidebar";
import GoToTop from "../shared/GoToTop";
import { useHSCore } from "../../hooks/useHSCore";
import type { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    // Initialize ALL HSCore components (including Unfold, Header, Carousel, etc.)
    useHSCore();

    return (
        <>
            <Header />
            <MobileSidebar />
            <main id="content" role="main">
                {children}
            </main>
            <Footer />
            <AccountSidebar />
            <GoToTop />
        </>
    );
};

export default Layout;
