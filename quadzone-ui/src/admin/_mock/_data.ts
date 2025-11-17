import { _id, _times, _fullName, _postTitles, _description } from "./_mock";

// ----------------------------------------------------------------------

export const _myAccount = {
    displayName: "Jaydon Frankie",
    email: "demo@minimals.cc",
    photoURL: "/assets/images/avatar/avatar-25.webp"
};

// ----------------------------------------------------------------------

export const _posts = [...Array(23)].map((_, index) => ({
    id: _id(index),
    title: _postTitles(index),
    description: _description(index),
    coverUrl: `/assets/images/cover/cover-${index + 1}.webp`,
    totalViews: 8829,
    totalComments: 7977,
    totalShares: 8556,
    totalFavorites: 8870,
    postedAt: _times(index),
    author: {
        name: _fullName(index),
        avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`
    }
}));

// ----------------------------------------------------------------------

export const _timeline = [...Array(5)].map((_, index) => ({
    id: _id(index),
    title: [
        "1983, orders, $4220",
        "12 Invoices have been paid",
        "Order #37745 from September",
        "New order placed #XF-2356",
        "New order placed #XF-2346"
    ][index],
    type: `order${index + 1}`,
    time: _times(index)
}));
