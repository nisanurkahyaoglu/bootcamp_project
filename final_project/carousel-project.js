(() => {
    const init = () => {
        buildHTML();
        buildCSS();
        setEvents();
        loadProducts();
    };

    const buildHTML = () => {
        const html = `
            <div class="carousel-container">
                <h2>You Might Also Like</h2>

                <div class="carousel-wrapper">    
                <button class="carousel-arrow left"><</button>
                    <div class="product-list-wrapper">
                       <div class="product-list"></div>
                    </div>
                    <button class="carousel-arrow right">></button>
                </div>
            </div>
        `;

        const $productDetail = $('.product-detail').eq(0);
        if ($productDetail.length) {
            $productDetail.after(html);
        }
    };

    const buildCSS = () => {
        const css = `
            .carousel-container {
                margin: 40px auto;
                padding: 20px;
                background: #f9f9f9;
                border: 1px solid #ddd;
                width:80%
        
            }

            .carousel-container h2 {
                font-size: 32px;
                margin-bottom: 16px;
                line-height:43px;
                margin-bottom:5px;
                font-weight:lighter;
                padding:15px 0;
                font-family:'Open Sans', sans-serif;
            }

            .product-list-wrapper {
                overflow: hidden;
                flex: 1;
                width: 100%;
                min-height: 250px;
            }

            .product-list {
                display: flex;
                overflow-x: hidden;
                gap: 5px;
                scroll-behavior: smooth;
                flex: 1;
            }

            .carousel-wrapper {
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;
                gap: 2px;
            }

         .carousel-arrow {
            background-color: #fff;
            border: 1px solid #ccc;
            font-size: 24px;
            cursor: pointer;
            height: 40px;
            width: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            z-index: 10;
            position: relative;
        }

        .carousel-arrow:hover {
            background-color: #eee;
        }


         .carousel-arrow:hover {
             background-color: #eee;
        }

        .carousel-arrow.left {
             margin-right: 10px;
        }

        .carousel-arrow.right {
            margin-left: 10px;
        }

        .product-card {
            min-width: 22rem;
            height:51rem
            border: 1px solid #ccc;
            background: #fff;
            position: relative;
            color:#555;
        }

        .product-card img {
            width: 100%;
            height: auto;
            object-fit: cover;
        }

            .product-card p {
                font-size: 14px;
                margin-top: 5px;
                color: #302e2b;
                padding:8px;
            }

            .product-card strong {
                color: #193db0;
                font-size: 18px;
                display: flex;
                height: 44px;
                align-items: flex-end;
                line-height: 22px;
                font-weight: bold;
                padding:8px;
            }
            
            .image-wrapper {
                position: relative;
            }

            .image-wrapper img {
                width: 100%;
                height: auto;
                display: block;
            }

            .heart {
                position: absolute;
                top: 8px;
                right: 8px;
                font-size: 20px;
                color: #ccc;
                cursor: pointer;
                transition: color 0.3s;
                z-index: 9999;
            }

            .heart.active {
                color: blue;
            }


            @media (max-width: 768px) {
                .product-card {
                    min-width: 130px;
                }
            }
        `;

        $('<style>').addClass('carousel-style').html(css).appendTo('head');
    };

    const url = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";

    const loadProducts = async() => {
        let products = [];

        const storage = localStorage.getItem("product-list");
        if (storage) {
            products = JSON.parse(storage);
        } else {
            try {
                const resp = await fetch(url);
                products = await resp.json();
                localStorage.setItem("product-list", JSON.stringify(products));
            } catch (e) {
                console.log("Error: ", e);
            }
        }

        renderProducts(products);
    };

    const renderProducts = (products) => {
        const $list = $(".product-list");
        $list.empty();

        products.forEach((product) => {
            const isFav = localStorage.getItem("fav-" + product.id);
            const card = `
            <div class="product-card" data-id="${product.id}">
              <div class="image-wrapper">
                <a href="${product.url}" target="_blank">
                    <img src="${product.img}" alt="${product.name}" />
                </a>
                    <span class="heart ${isFav ? 'active' : ''}">&#9829;</span>
                </div>
                <a href="${product.url}" target="_blank">
                  <p>${product.name}</p>
                  <strong>${product.price} TL</strong>
                </a>
            </div>
        `;
            $list.append(card);
        });
    };


    const setEvents = () => {

        const $list = $('.product-list');

        $('.product-list').on('click', '.heart', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const $heart = $(this);
            const $card = $heart.closest(".product-card");
            const id = $card.data("id");
            const isActive = $heart.hasClass("active");

            if (isActive) {
                $heart.removeClass("active");
                localStorage.removeItem("fav-" + id);
            } else {
                $heart.addClass("active");
                localStorage.setItem("fav-" + id, "1");
            }
        });


        $('.carousel-arrow.left').on('click', () => {
            $list.animate({ scrollLeft: '-=300' }, 300);
        });

        $('.carousel-arrow.right').on('click', () => {
            $list.animate({ scrollLeft: '+=300' }, 300);
        });


    };

    init();
})();