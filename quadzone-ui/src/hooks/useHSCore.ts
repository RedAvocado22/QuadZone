import { useEffect } from "react";

export const useHSCore = () => {
    useEffect(() => {
        const initHSCore = () => {
            // @ts-expect-error: jQuery is loaded globally via scripts
            if (typeof window.jQuery === "undefined" || !window.jQuery.HSCore) {
                setTimeout(initHSCore, 100);
                return;
            }

            // @ts-expect-error: jQuery is loaded globally via scripts
            const $ = window.jQuery;

            // 1. Bootstrap Tooltips & Popovers
            $('[data-toggle="tooltip"]').tooltip();
            $('[data-toggle="popover"]').popover();

            // 2. HSUnfold (Sidebars)
            const $unfoldElements = $("[data-unfold-target]");
            if ($unfoldElements.length && $.HSCore.components.HSUnfold) {
                $.HSCore.components.HSUnfold.init($unfoldElements);
            }

            // 3. HSHeader (Sticky header)
            const $header = $(".js-header");
            if ($header.length && $.HSCore.components.HSHeader) {
                $.HSCore.components.HSHeader.init($header);
            }

            // 4. HSMegaMenu
            const $megaMenu = $(".js-mega-menu");
            if ($megaMenu.length && $.HSCore.components.HSMegaMenu) {
                $.HSCore.components.HSMegaMenu.init($megaMenu);
            }

            // 5. HSHamburgers (Animated hamburger icons)
            const $hamburgers = $(".hamburger");
            if ($hamburgers.length && $.HSCore.components.HSHamburgers) {
                $.HSCore.components.HSHamburgers.init($hamburgers);
            }

            // 6. HSGoTo (Scroll to top button)
            const $goTo = $(".js-go-to");
            if ($goTo.length && $.HSCore.components.HSGoTo) {
                $.HSCore.components.HSGoTo.init($goTo);
            }

            // 7. HSSlickCarousel (Product sliders)
            const $slickCarousel = $(".js-slick-carousel");
            if ($slickCarousel.length && $.HSCore.components.HSSlickCarousel) {
                $.HSCore.components.HSSlickCarousel.init($slickCarousel);
            }

            // 8. HSMalihuScrollBar (Custom scrollbar)
            const $scrollbar = $(".js-scrollbar");
            if ($scrollbar.length && $.HSCore.components.HSMalihuScrollBar) {
                $.HSCore.components.HSMalihuScrollBar.init($scrollbar);
            }

            // 9. HSShowAnimation (Scroll animations)
            const $showAnimation = $("[data-animation]");
            if ($showAnimation.length && $.HSCore.components.HSShowAnimation) {
                $.HSCore.components.HSShowAnimation.init($showAnimation);
            }

            // 10. HSFancyBox (Lightbox/Image viewer)
            const $fancybox = $(".js-fancybox");
            if ($fancybox.length && $.HSCore.components.HSFancyBox) {
                $.HSCore.components.HSFancyBox.init($fancybox);
            }

            // 11. HSValidation (Form validation)
            const $validation = $(".js-validate");
            if ($validation.length && $.HSCore.components.HSValidation) {
                $.HSCore.components.HSValidation.init($validation);
            }

            // 12. HSFocusState (Input focus effects)
            const $focusState = $(".js-focus-state");
            if ($focusState.length && $.HSCore.components.HSFocusState) {
                $.HSCore.components.HSFocusState.init($focusState);
            }

            // 13. HSCountdown (Countdown timer)
            const $countdown = $(".js-countdown");
            if ($countdown.length && $.HSCore.components.HSCountdown) {
                $.HSCore.components.HSCountdown.init($countdown);
            }

            // 14. HSSelectPicker (Bootstrap Select)
            const $selectpicker = $(".js-select");
            if ($selectpicker.length && $.HSCore.components.HSSelectPicker) {
                $.HSCore.components.HSSelectPicker.init($selectpicker);
            }
        };

        // Delay to ensure React DOM is ready
        const timer = setTimeout(initHSCore, 200);

        return () => {
            clearTimeout(timer);

            // Cleanup
            // @ts-expect-error: jQuery is loaded globally via scripts
            if (typeof window.jQuery !== "undefined") {
                // @ts-expect-error: jQuery is loaded globally via scripts
                const $ = window.jQuery;

                // Remove event listeners
                $(document).off(".HSUnfold");
                $(document).off(".HSHeader");
                $(document).off(".HSMegaMenu");
                $(window).off(".HSUnfold");
                $(window).off(".HSHeader");

                // Destroy tooltips & popovers
                $('[data-toggle="tooltip"]').tooltip("dispose");
                $('[data-toggle="popover"]').popover("dispose");
            }
        };
    }, []);
};
