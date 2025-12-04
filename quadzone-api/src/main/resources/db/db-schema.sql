create table _user
(
    date_of_birth date                                           null,
    created_at    datetime(6)                                    not null,
    id            bigint auto_increment
        primary key,
    updated_at    datetime(6)                                    null,
    address       varchar(255)                                   null,
    avatar_url    varchar(255)                                   null,
    city          varchar(255)                                   null,
    email         varchar(255)                                   not null,
    first_name    varchar(255)                                   not null,
    last_name     varchar(255)                                   not null,
    password      varchar(255)                                   not null,
    phone_number  varchar(255)                                   null,
    role          enum ('ADMIN', 'CUSTOMER', 'SHIPPER', 'STAFF') null,
    status        enum ('ACTIVE', 'SUSPENDED', 'UNACTIVE')       null,
    constraint UKk11y3pdtsrjgy8w9b6q4bjwrx
        unique (email)
);

create table blog
(
    author_id     bigint                                  null,
    created_at    datetime(6)                             null,
    id            bigint auto_increment
        primary key,
    slug          varchar(200)                            not null,
    title         varchar(200)                            not null,
    thumbnail_url varchar(500)                            null,
    content       text                                    not null,
    status        enum ('ARCHIVED', 'DRAFT', 'PUBLISHED') not null,
    constraint UKrse7kjvydwev63jjbsm0dw4ey
        unique (slug),
    constraint FKfqgg9lw17ibbiq98j3e2dq9y9
        foreign key (author_id) references _user (id)
);

create table cart
(
    created_at  datetime(6) not null,
    customer_id bigint      not null,
    id          bigint auto_increment
        primary key,
    updated_at  datetime(6) null,
    constraint UK867x3yysb1f3jk41cv3vsoejj
        unique (customer_id),
    constraint FKci7iy52408eoa32qfj3lllg3p
        foreign key (customer_id) references _user (id)
);

create table category
(
    is_active bit          null,
    id        bigint auto_increment
        primary key,
    image_url varchar(255) not null,
    name      varchar(255) null
);

create table chat_room
(
    closed_at       datetime(6)                           null,
    created_at      datetime(6)                           not null,
    customer_id     bigint                                not null,
    id              bigint auto_increment
        primary key,
    last_message_at datetime(6)                           null,
    staff_id        bigint                                null,
    status          enum ('ACTIVE', 'ASSIGNED', 'CLOSED') not null,
    constraint FKorfu6d88bjlalbp7gymfj6om6
        foreign key (staff_id) references _user (id),
    constraint FKsfq6ax27on2nohetv5f8bbdfy
        foreign key (customer_id) references _user (id)
);

create table chat_message
(
    is_read      bit                                      not null,
    chat_room_id bigint                                   not null,
    id           bigint auto_increment
        primary key,
    sender_id    bigint                                   null,
    sent_at      datetime(6)                              not null,
    content      text                                     not null,
    message_type enum ('FILE', 'IMAGE', 'SYSTEM', 'TEXT') not null,
    constraint FKj52yap2xrm9u0721dct0tjor9
        foreign key (chat_room_id) references chat_room (id),
    constraint FKq6kwrlsfuetx2jhubr09cc7oa
        foreign key (sender_id) references _user (id)
);

create table comments
(
    blog_id      bigint       not null,
    created_at   datetime(6)  null,
    id           bigint auto_increment
        primary key,
    author_email varchar(150) not null,
    author_name  varchar(150) not null,
    content      text         not null,
    constraint FKdbueb2umo93l6hbt66d8ueo2l
        foreign key (blog_id) references blog (id)
);

create table contacts
(
    created_at datetime(6)   not null,
    id         bigint auto_increment
        primary key,
    message    varchar(1000) not null,
    email      varchar(255)  not null,
    name       varchar(255)  not null,
    subject    varchar(255)  not null
);

create table coupons
(
    coupon_value        double                              not null,
    is_active           bit                                 not null,
    max_discount_amount double                              not null,
    max_usage           int                                 null,
    min_order_amount    double                              not null,
    usage_count         int                                 null,
    end_date            datetime(6)                         null,
    id                  bigint auto_increment
        primary key,
    start_date          datetime(6)                         null,
    code                varchar(255)                        not null,
    discount_type       enum ('FIXED_AMOUNT', 'PERCENTAGE') null,
    constraint UKeplt0kkm9yf2of2lnx6c1oy9b
        unique (code)
);

create table notifications
(
    is_unread   bit          not null,
    id          bigint auto_increment
        primary key,
    posted_at   datetime(6)  not null,
    user_id     bigint       not null,
    type        varchar(50)  not null,
    avatar_url  varchar(500) null,
    description text         null,
    title       varchar(255) not null,
    constraint FKj3cxfyal6fn73tgnpfb4dbice
        foreign key (user_id) references _user (id)
);

create table orders
(
    discount_amount     double                                                                null,
    shipping_cost       double                                                                null,
    subtotal            double                                                                null,
    tax_amount          double                                                                null,
    total_amount        double                                                                null,
    id                  bigint auto_increment
        primary key,
    order_date          datetime(6)                                                           null,
    user_id             bigint                                                                null,
    address             text                                                                  null,
    customer_email      varchar(255)                                                          null,
    customer_first_name varchar(255)                                                          null,
    customer_last_name  varchar(255)                                                          null,
    customer_phone      varchar(255)                                                          null,
    notes               text                                                                  null,
    order_status        enum ('CANCELLED', 'COMPLETED', 'CONFIRMED', 'PENDING', 'PROCESSING') null,
    constraint FKgnfp6cq7wuhg8yec9j2d026m4
        foreign key (user_id) references _user (id)
);

create table deliveries
(
    signature_required      bit                                                                                             null,
    actual_delivery_date    datetime(6)                                                                                     null,
    created_at              datetime(6)                                                                                     null,
    estimated_delivery_date datetime(6)                                                                                     null,
    id                      bigint auto_increment
        primary key,
    order_id                bigint                                                                                          not null,
    staff_id                bigint                                                                                          null,
    updated_at              datetime(6)                                                                                     null,
    carrier                 varchar(255)                                                                                    null,
    delivery_notes          text                                                                                            null,
    tracking_number         varchar(255)                                                                                    null,
    delivery_status         enum ('CANCELLED', 'DELIVERED', 'OUT_FOR_DELiVERY', 'PACKED', 'PENDING', 'RETURNED', 'SHIPPED') null,
    constraint UKk36n9p5v7dd96hpgkwybvbogt
        unique (order_id),
    constraint UKsxjjhx1w78xjss4g25gahe5s9
        unique (tracking_number),
    constraint FK7isx0rnbgqr1dcofd5putl6jw
        foreign key (order_id) references orders (id),
    constraint FKjwhg1adbycjfves2pj9mpbhga
        foreign key (staff_id) references _user (id)
);

create table payment
(
    amount         double                                                                    not null,
    created_at     datetime(6)                                                               null,
    id             bigint auto_increment
        primary key,
    order_id       bigint                                                                    not null,
    payment_date   datetime(6)                                                               null,
    transaction_id varchar(255)                                                              null,
    payment_method enum ('BANK_TRANSFER', 'CASH_ON_DELIVERY', 'CREDIT_CARD', 'VNPAY')        null,
    payment_status enum ('COMPLETED', 'FAILED', 'PARTIALLY_REFUNDED', 'PENDING', 'REFUNDED') null,
    constraint UKmf7n8wo2rwrxsd6f3t9ub2mep
        unique (order_id),
    constraint UKtacis04bqalsngo46yvxlo7yb
        unique (transaction_id),
    constraint FKlouu98csyullos9k25tbpk4va
        foreign key (order_id) references orders (id)
);

create table sub_category
(
    is_active   bit          null,
    category_id bigint       not null,
    id          bigint auto_increment
        primary key,
    name        varchar(100) not null,
    description text         null,
    constraint FKl65dyy5me2ypoyj8ou1hnt64e
        foreign key (category_id) references category (id)
);

create table product
(
    cost_price     double       null,
    is_active      bit          null,
    price          double       not null,
    stock_quantity int          not null,
    weight         double       null,
    created_at     datetime(6)  null,
    id             bigint auto_increment
        primary key,
    subcategory_id bigint       not null,
    updated_at     datetime(6)  null,
    brand          varchar(255) null,
    color          varchar(255) null,
    description    text         null,
    image_url      varchar(255) null,
    model_number   varchar(255) null,
    name           varchar(255) not null,
    constraint FKniucpti15id7jc1gqsnlcpd0b
        foreign key (subcategory_id) references sub_category (id)
);

create table cart_item
(
    quantity   int         not null,
    added_at   datetime(6) not null,
    cart_id    bigint      not null,
    id         bigint auto_increment
        primary key,
    product_id bigint      not null,
    constraint FK1uobyhgl1wvgt1jpccia8xxs3
        foreign key (cart_id) references cart (id),
    constraint FKjcyd5wv4igqnw413rgxbfu4nv
        foreign key (product_id) references product (id)
);

create table order_items
(
    price_at_purchase decimal(38, 2) not null,
    quantity          int            not null,
    id                bigint auto_increment
        primary key,
    order_id          bigint         not null,
    product_id        bigint         not null,
    constraint FKbioxgbv59vetrxe0ejfubep1w
        foreign key (order_id) references orders (id),
    constraint FKlf6f9q956mt144wiv6p1yko16
        foreign key (product_id) references product (id)
);

create table review
(
    rating        int          not null,
    created_at    datetime(6)  null,
    customer_id   bigint       not null,
    id            bigint auto_increment
        primary key,
    order_item_id bigint       null,
    product_id    bigint       not null,
    updated_at    datetime(6)  null,
    review_title  varchar(200) null,
    text          text         null,
    constraint UKfi19ihqypou1atahgbq3a0508
        unique (order_item_id),
    constraint FK43etapjxmlhdpmf1rhcchvqbl
        foreign key (customer_id) references _user (id),
    constraint FKayarlhrlpo6aar4prnvdy56j8
        foreign key (order_item_id) references order_items (id),
    constraint FKiyof1sindb9qiqr9o8npj8klt
        foreign key (product_id) references product (id)
);

create table token
(
    logged_out bit          not null,
    revoked    bit          not null,
    id         bigint auto_increment
        primary key,
    user_id    bigint       null,
    token      varchar(512) null,
    constraint UKpddrhgwxnms2aceeku9s2ewy5
        unique (token),
    constraint FKiblu4cjwvyntq3ugo31klp1c6
        foreign key (user_id) references _user (id)
);

create table uploads
(
    file_size     bigint        not null,
    id            bigint auto_increment
        primary key,
    uploaded_at   datetime(6)   not null,
    description   varchar(500)  null,
    image_url     varchar(1000) not null,
    thumbnail_url varchar(1000) not null,
    file_name     varchar(255)  not null,
    imgbb_id      varchar(255)  not null,
    mime_type     varchar(255)  not null
);

create table wishlist
(
    id      bigint auto_increment
        primary key,
    user_id bigint not null,
    constraint UKrcuy9aqx9c6q56x1xdoty8r3q
        unique (user_id),
    constraint FKj4a83t93qh1sbo10g51i2lloo
        foreign key (user_id) references _user (id)
);

create table wishlist_products
(
    product_id  bigint not null,
    wishlist_id bigint not null,
    constraint FKfx1kub09qhl8g1w6j563ghgy0
        foreign key (product_id) references product (id),
    constraint FKhlq0ylq5sxd70s0pembuumc1d
        foreign key (wishlist_id) references wishlist (id)
);

