<template>
  <Layout>
    <div class="products-page">
      <!-- 顶部横幅 -->

      <!-- 渐变横幅 + 标题 -->
      <div class="hero-section" style="margin-top: 131.19px;">
        <div class="hero-content">
          <h1 class="hero-title">EXPLORE OUR PRODUCTS</h1>
        </div>
      </div>

      <!-- 整段内容渐变背景 -->
      <div class="content-background">
        <div class="content-container">
          <!-- Category Capsules -->
          <div class="category-filters">
            <button v-for="category in categories" :key="category.value" @click="setSelectedCategory(category.value)"
              :class="['category-button', { active: selectedCategory === category.value }]">
              {{ category.label }}
            </button>
          </div>

          <!-- Products Grid -->
          <div class="products-grid">
            <div v-for="(item, index) in withBundleCard" :key="item.__bundleCard ? `bundle-${index}` : item.id"
              class="product-card">
              <!-- Bundle Card -->
              <div v-if="item.__bundleCard" class="bundle-card">
                <img src="~@/assets/products/shop-all-byob.png"
                  alt="Build Your Own" class="bundle-image desktop" />
                <img src="~@/assets/products/shop-all-byob-mobile.png"
                  alt="Build Your Own" class="bundle-image mobile" />
                <div class="bundle-cta">
                  <button class="bundle-button" @click="$router.push('/products')">
                    GET STARTED
                  </button>
                </div>
              </div>

              <!-- Product Card -->
              <div v-else class="product-content">

                <!-- Product Image -->
                <div class="product-image-container" @click="navigateToProductDetail(item)">
                  <div class="product-image">
                    <img :src="getProductImage(item, currentImageIndex[item.id] || 0)" :alt="item.name"
                      class="product-img" />
                  </div>

                  <!-- 可点击的轮播小圆点 -->
                  <div class="image-dots" v-if="getProductImages(item).length > 1">
                    <button v-for="(_, i) in getProductImages(item).slice(0, 4)" :key="i"
                      @click.stop="switchProductImage(item.id, i)"
                      :class="['dot', { active: i === (currentImageIndex[item.id] || 0) }]" />
                  </div>
                </div>

                <!-- Product Info -->
                <div class="product-info">
                  <h3 class="product-name">{{ item.description }}</h3>
                  <!-- <p class="product-description">{{ item.name }}</p> -->
                  <div class="product-pricing">
                    <span class="current-price">${{ item.price }}</span>
                    <span class="original-price" v-if="item.original_price">${{ item.original_price }}</span>
                  </div>
                  <button class="shop-button" @click.stop="navigateToProductDetail(item)" :disabled="item.stock === 0"
                    :class="{ 'out-of-stock': item.stock === 0 }">
                    <svg v-if="item.stock !== 0" class="cart-icon" xmlns="http://www.w3.org/2000/svg" width="16"
                      height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span v-if="item.stock === 0">OUT OF STOCK</span>
                    <span v-else>SHOP NOW</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- No Products Found State -->
          <div v-if="filteredProducts.length === 0" class="no-products">
            <div class="no-products-icon">🛒</div>
            <h3>No products found</h3>
            <p>Try browsing other categories</p>
            <button @click="setSelectedCategory('all')" class="reset-button">
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/components/Layout.vue'

export default {
  name: 'Products',
  components: {
    Layout
  },
  data() {
    return {
      selectedCategory: 'all',
      currentImageIndex: {},
      products: [
        {
          "id": 1,
          "name": "Mars Variety Pack",
          "description": "SNICKERS, TWIX, MILKY WAY & 3 MUSKETEERS, Bulk Milk Chocolate Full Size Candy Bars, Halloween Chocolate Candy Variety Pack, 53.68 oz, 30 Bars",
          "price": 0.01,
          "original_price": 45.54,
          "variants": [
            {
              "option1": "30 COUNT",
              "price": 0.01,
              "image": "https://m.media-amazon.com/images/I/61FBDKvhUFL._SL1000_.jpg"
            },
            {
              "option1": "60 COUNT",
              "price": 0.02,
              "image": "https://m.media-amazon.com/images/I/61VN4e-f+bL._SL1000_.jpg"
            },
            {
              "option1": "90 COUNT",
              "price": 0.03,
              "image": "https://m.media-amazon.com/images/I/619wM8FXMyL._SL1000_.jpg"
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/61FBDKvhUFL._SL1000_.jpg",
            "https://m.media-amazon.com/images/I/61VN4e-f+bL._SL1000_.jpg",
            "https://m.media-amazon.com/images/I/619wM8FXMyL._SL1000_.jpg",
            "https://m.media-amazon.com/images/I/61JHs-Rp2IL._SL1000_.jpg",
            "https://m.media-amazon.com/images/I/61dIY6svQnL._SL1000_.jpg",
            "https://m.media-amazon.com/images/I/7185Xz1zmuL._SL1000_.jpg",
            "https://m.media-amazon.com/images/I/617QxnCjHRL._SL1000_.jpg"
          ],
          "star_rating": 4.9,
          "Star_review_count": 2347,
          "category": "candy",
          "stock": 10
        },
        {
          "id": 2,
          "name": "HARIBO Gummi Candy",
          "description": "HARIBO Gummi Candy, Original Goldbears Gummy Bears, 3 Pound Party Size Bag (Pack of 4) Delicious Soft & Chewy Sweet Snacks, Assorted Fruity Flavors",
          "price": 0.01,
          "original_price": 43.44,
          "variants": [
            {
              "option1": "3LB BAG",
              "price": 0.01,
              "image": "https://m.media-amazon.com/images/I/914gJ-bJ2mL._SL1500_.jpg"
            },
            {
              "option1": "6LB BAG",
              "price": 0.02,
              "image": "https://m.media-amazon.com/images/I/51sxpyd2FOL.jpg"
            },
            {
              "option1": "12LB BAG",
              "price": 0.04,
              "image": "https://m.media-amazon.com/images/I/A1q2e+w3K2L._SL1500_.jpg"
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/914gJ-bJ2mL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/51sxpyd2FOL.jpg",
            "https://m.media-amazon.com/images/I/A1q2e+w3K2L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81STwx3skWL._SL1488_.jpg"
          ],
          "star_rating": 4.8,
          "Star_review_count": 1056,
          "category": "candy",
          "stock": 10
        },
        {
          "id": 3,
          "name": "STARBURST Fruit Chews",
          "description": "STARBURST Fruit Chews Candy - FaveREDS Minis, 8oz (Pack of 8) - Delicious STARBURST, Bulk Mini Candy, Bulk Box",
          "price": 0.01,
          "original_price": 23.04,
          "variants": [
            {
              "option1": "GRAB & GO",
              "price": 0.01,
              "image": "https://m.media-amazon.com/images/I/814fpKy5fUL._SL1500_.jpg"
            },
            {
              "option1": "8OZ PACK",
              "price": 0.01,
              "image": "https://m.media-amazon.com/images/I/61Igz8KOfnL._SL1000_.jpg"
            },
            {
              "option1": "16OZ PACK",
              "price": 0.02,
              "image": "https://m.media-amazon.com/images/I/61gpl+b+DvL._SL1000_.jpg"
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/814fpKy5fUL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/61Igz8KOfnL._SL1000_.jpg",
            "https://m.media-amazon.com/images/I/61gpl+b+DvL._SL1000_.jpg",
            "https://m.media-amazon.com/images/I/71K0CMmY4nL._SL1000_.jpg",
            "https://m.media-amazon.com/images/I/619VpKdizuL._SL1000_.jpg"
          ],
          "star_rating": 4.6,
          "Star_review_count": 528,
          "category": "candy",
          "stock": 10
        },
        {
          "id": 4,
          "name": "SKITTLES & STARBURST Variety Pack",
          "description": "SKITTLES & STARBURST Assorted Candy Variety Pack for Holidays, Candy Assortment, Party Favors, 62.79 oz (30 Count) Bulk Box",
          "price": 0.01,
          "original_price": 29.88,
          "variants": [
            {
              "option1": "30 PACKS",
              "price": 0.01,
              "image": "https://m.media-amazon.com/images/I/91X267YpIHL._SL1500_.jpg"
            },
            {
              "option1": "60 PACKS",
              "price": 0.02,
              "image": "https://m.media-amazon.com/images/I/71CqzczPXVL._SL1500_.jpg"
            },
            {
              "option1": "90 PACKS",
              "price": 0.03,
              "image": "https://m.media-amazon.com/images/I/61U-PquxuQL._SL1000_.jpg"
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/91X267YpIHL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71CqzczPXVL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/61U-PquxuQL._SL1000_.jpg",
            "https://m.media-amazon.com/images/I/61FhBe65HbL._SL1000_.jpg",
            "https://m.media-amazon.com/images/I/71qpEqegDUL._SL1000_.jpg",
            "https://m.media-amazon.com/images/I/61qRypYWoLL._SL1000_.jpg",
            "https://m.media-amazon.com/images/I/61I2wCsTEAL._SL1000_.jpg"
          ],
          "star_rating": 4.9,
          "Star_review_count": 1547,
          "category": "candy",
          "stock": 10
        },
        {
          "id": 5,
          "name": "TWIX Bulk Chocolate Candy",
          "description": "TWIX Bulk Chocolate Candy Individually Wrapped, Full Size, Caramel Chocolate Cookie Candy Bar, Perfect for Snacks, Parites, Goodie Bags, Holidays 36-Count Box",
          "price": 0.01,
          "original_price": 43.47,
          "variants": [
            {
              "option1": "36 COUNT",
              "price": 0.01,
              "image": "https://m.media-amazon.com/images/I/810dyHMqrXL._SL1500_.jpg"
            },
            {
              "option1": "72 COUNT",
              "price": 0.02,
              "image": "https://m.media-amazon.com/images/I/71JMk5cKd-L._SL1500_.jpg"
            },
            {
              "option1": "108 COUNT",
              "price": 0.03,
              "image": "https://m.media-amazon.com/images/I/81F4Icf+fLL._SL1500_.jpg"
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/810dyHMqrXL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71JMk5cKd-L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81F4Icf+fLL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81nZG3+k0zL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81pZPJ0AukL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71evH7-fIEL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71xPx0SQWkL._SL1500_.jpg"
          ],
          "star_rating": 4.2,
          "Star_review_count": 2685,
          "category": "chocolate",
          "stock": 10
        },
        {
          "id": 6,
          "name": "HERSHEY'S Cookies 'n' Creme",
          "description": "HERSHEY'S Cookies 'n' Creme Candy Bars, 1.55 oz (36 Count)",
          "price": 0.01,
          "original_price": 29.82,
          "variants": [
            {
              "option1": "36 COUNT",
              "price": 0.01,
              "image": "https://m.media-amazon.com/images/I/71cOFPAXPWL._SL1500_.jpg"
            },
            {
              "option1": "72 COUNT",
              "price": 0.02,
              "image": "https://m.media-amazon.com/images/I/71AkOr-bWiL._SL1500_.jpg"
            },
            {
              "option1": "108 COUNT",
              "price": 0.03,
              "image": "https://m.media-amazon.com/images/I/717MouMWCnL._SL1500_.jpg"
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/71cOFPAXPWL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71AkOr-bWiL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/717MouMWCnL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/61MWkL3nFZL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81AvuKjLQ2L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71KqPLvk5DL._SL1500_.jpg"
          ],
          "star_rating": 4.5,
          "Star_review_count": 952,
          "category": "chocolate",
          "stock": 10
        },
        {
          "id": 7,
          "name": "M&M'S Peanut Chocolate Candy",
          "description": "M&M'S Peanut Chocolate Candy, Full Size 1.74 oz Bag, Pack of 48 Bulk Candy Chocolate",
          "price": 0.01,
          "original_price": 52.48,
          "variants": [
            {
              "option1": "48 PACK",
              "price": 0.01,
              "image": "https://m.media-amazon.com/images/I/615-iNBkHdL._SL1030_.jpg"
            },
            {
              "option1": "96 PACK",
              "price": 0.02,
              "image": "https://m.media-amazon.com/images/I/71o4exRT1cL._SL1500_.jpg"
            },
            {
              "option1": "144 PACK",
              "price": 0.03,
              "image": "https://m.media-amazon.com/images/I/71l1JzGhgEL._SL1500_.jpg"
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/615-iNBkHdL._SL1030_.jpg",
            "https://m.media-amazon.com/images/I/71o4exRT1cL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71l1JzGhgEL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/717bFrIJGlL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71OCe3wSQEL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/718VFsUx8qL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71BO0HjjeCL._SL1500_.jpg"
          ],
          "star_rating": 4.9,
          "Star_review_count": 357,
          "category": "chocolate",
          "stock": 10
        },
        {
          "id": 8,
          "name": "Cheez-It Cheese Crackers",
          "description": "Cheez-It Cheese Crackers, Baked Snack Crackers, Lunch Snacks, Variety Pack (42 Packs)",
          "price": 0.01,
          "original_price": 33.22,
          "variants": [
            {
              "option1": "42 PACKS",
              "price": 0.01,
              "image": "https://m.media-amazon.com/images/I/81mLcR4o+KL._SL1500_.jpg"
            },
            {
              "option1": "84 PACKS",
              "price": 0.02,
              "image": "https://m.media-amazon.com/images/I/71bBh+svUBL._SL1500_.jpg"
            },
            {
              "option1": "126 PACKS",
              "price": 0.03,
              "image": "https://m.media-amazon.com/images/I/81M+g+hzO8L._SL1500_.jpg"
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/81mLcR4o+KL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71bBh+svUBL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81M+g+hzO8L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81PXftrN9uL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81RHeaeS2rL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91mmjSjh46L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81iZJ2IXgiL._SL1500_.jpg"
          ],
          "star_rating": 4.8,
          "Star_review_count": 2144,
          "category": "snacks",
          "stock": 10
        },
        {
          "id": 9,
          "name": "Rold Gold Tiny Twists Pretzels",
          "description": "Rold Gold Tiny Twists Pretzels, 1 Ounce (Pack of 40)",
          "price": 0.01,
          "original_price": 22.43,
          "variants": [
            {
              "option1": "40 PACKS",
              "price": 0.01,
              "image": "https://m.media-amazon.com/images/I/91pCcVfTn2L._SL1500_.jpg"
            },
            {
              "option1": "80 PACKS",
              "price": 0.02,
              "image": "https://m.media-amazon.com/images/I/815gKv6rkFL._SL1500_.jpg"
            },
            {
              "option1": "120 PACKS",
              "price": 0.03,
              "image": "https://m.media-amazon.com/images/I/71PiNFWwmNL._SL1500_.jpg"
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/91pCcVfTn2L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/815gKv6rkFL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71PiNFWwmNL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81wLgsYsiVL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/8181DLnV0eL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81f9CL1LvrL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81ab6Pqty2L._SL1500_.jpg"
          ],
          "star_rating": 4.8,
          "Star_review_count": 2689
        },
        {
          "id": 10,
          "description": "Pepperidge Farm Goldfish Cheddar Crackers, 1.5 oz. Snack Packs, 30 Count",
          "price": 0.01,
          "original_price": NaN,
          "variants": [
            {
              "option1": "STANDARD",
              "price": 0.01,
              "image": ""
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/81z6eD6sAUL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81fvrlmsUkL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/818RgpUBETL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/717uXvq4IOL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71SImAY5mNL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91MLnnHlqcL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91WtwCbROxL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71h9PI3UnfL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81x1IMXU6BL._SL1500_.jpg"
          ],
          "star_rating": 4.6,
          "Star_review_count": 1257
        },
        {
          "id": 11,
          "description": "Pringles Potato Crisps Chips, Snack Stacks, Lunch Snacks, Variety Pack (27 Cups)",
          "price": 0.01,
          "original_price": 13.98,
          "variants": [
            {
              "option1": "STANDARD",
              "price": 0.01,
              "image": ""
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/713yOu16zaL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81SFugVLD6L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91VeYkt-o4L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/717Me3PNzwL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71LrpJNj7kL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81NhnnczfkL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81q8MBjoJlL._SL1500_.jpg"
          ],
          "star_rating": 4.5,
          "Star_review_count": 369
        },
        {
          "id": 12,
          "description": "Frito-Lay Ultimate Snack Care Package, Variety Assortment of Chips, Cookies, Crackers & More, (Pack of 40)",
          "price": 0.01,
          "original_price": 28.0,
          "variants": [
            {
              "option1": "STANDARD",
              "price": 0.01,
              "image": ""
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/81XRi95WamL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/812yC1M-HRL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81u7xiUABVL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81LC39EZ8YL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/811n7fbym4L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71Fdd9Q7ufL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81xLT954mtL._SL1500_.jpg"
          ],
          "star_rating": 4.2,
          "Star_review_count": 548
        },
        {
          "id": 13,
          "name": "Rip Van Wafels Dutch Caramel & Vanilla Stroopwafels",
          "description": "Rip Van Wafels Dutch Caramel & Vanilla Stroopwafels, Healthy Snacks, Non-GMO, Low Calorie, Low Sugar (3g), Office Snacks, Keto Friendly, 12 Count",
          "price": 0.01,
          "original_price": 18.99,
          "variants": [
            {
              "option1": "4 COUNT",
              "price": 0.01,
              "image": "https://m.media-amazon.com/images/I/717-zWWFyQL._SL1080_.jpg"
            },
            {
              "option1": "12 COUNT",
              "price": 0.01,
              "image": "https://m.media-amazon.com/images/I/71OSrF7xWLL._SL1000_.jpg"
            },
            {
              "option1": "16 COUNT",
              "price": 0.02,
              "image": "https://m.media-amazon.com/images/I/6125PrQ9B-L.jpg"
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/717-zWWFyQL._SL1080_.jpg",
            "https://m.media-amazon.com/images/I/71OSrF7xWLL._SL1000_.jpg",
            "https://m.media-amazon.com/images/I/6125PrQ9B-L.jpg",
            "https://m.media-amazon.com/images/I/61AYQjvD9jL.jpg",
            "https://m.media-amazon.com/images/I/61Ah74QFnvL.jpg",
            "https://m.media-amazon.com/images/I/515LV2NLhML.jpg",
            "https://m.media-amazon.com/images/I/61-k5zEEb3L.jpg"
          ],
          "star_rating": 4.8,
          "Star_review_count": 1587,
          "category": "snacks",
          "stock": 10
        },
        {"id": 14,
          "name": "Hippeas Chickpea Puffs",
          "description": "Hippeas Chickpea Puffs, Variety Pack: Vegan White Cheddar, Nacho Vibes, Barbecue, Sriracha, 0.8 Ounce (Pack of 18), 3g Protein, 2g Fiber, Vegan, Gluten-Free, Crunchy, Plant Protein Snacks",
          "price": 0.01,
          "original_price": 29.92,
          "variants": [
            {
              "option1": "Cheeze Variety/14.4 Ounce (Pack of 1)",
              "price": 12.99,
              "original_price": 14.99,
              "image": "https://m.media-amazon.com/images/I/71y0Q0av+aL._SL1500_.jpg"
            },
            {
              "option1": "3-Flavor Variety/4 Ounce (Pack of 6)",
              "price": 19.99,
              "original_price": 24.99,
              "image": "https://m.media-amazon.com/images/I/8184ft8a94L._SL1500_.jpg"
            },
            {
              "option1": "Cheeze Variety/0.8 Ounce (Pack of 30)",
              "price": 24.99,
              "original_price": 29.99,
              "image": "https://m.media-amazon.com/images/I/81xS1AA1HcL._SL1500_.jpg"
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/71y0Q0av+aL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/8184ft8a94L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81xS1AA1HcL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71h5oS4roSL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71XfaH2azWL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/712iLwgnEbL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/A185djQrGGL._SL1500_.jpg"
          ],
          "star_rating": 4.9,
          "Star_review_count": 1650,
          "category": "snacks",
          "stock": 10
        },
        {
          "id": 15,
          "name": "Butterfinger Variety Pack",
          "description": "Butterfinger, CRUNCH, Baby Ruth, 100 Grand Fun Size Assorted Candy Bars, Great for Sharing, Bulk 60 Count Pack, 37.2 oz",
          "price": 0.01,
          "original_price": 14.74,
          "variants": [
            {
              "option1": "STANDARD",
              "price": 0.01,
              "image": ""
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/81e76DDYgRL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81j7hh1xR-L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91PxDl3YrwL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81ZiWVZsKdL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81mdxxOx6CL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81k+52Tq1zL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91D+fjLa4aL._SL1500_.jpg"
          ],
          "star_rating": 4.9,
          "Star_review_count": 1008,
          "category": "candy",
          "stock": 10
        },
        {
          "id": 16,
          "name": "Shameless Snacks Candy Carnival",
          "description": "Shameless Snacks Candy Carnival - Healthy Low Sugar Snacks with Pineapple, Mango, Orange, Strawberry & Cola Gummies - Vegan, Gluten-Free, Low-Calorie Candy Variety Pack",
          "price": 0.01,
          "original_price": 23.99,
          "variants": [
            {
              "option1": "STANDARD",
              "price": 0.01,
              "image": ""
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/91c8-M9Nl0L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81bbSIT6ZtL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91ZZ5s3vbCL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/912Yj0e-k1L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71gVTfugldL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/912BwJxVHkL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81ub-Pag20L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91T+OFC8lLL._SL1500_.jpg"
          ],
          "star_rating": 4.7,
          "Star_review_count": 875,
          "category": "candy",
          "stock": 10
        },
        {
          "id": 17,
          "name": "Slim Jim Smoked Meat Sticks",
          "description": "Slim Jim Smoked Meat Sticks, Original Flavor, 6g Protein Per Serving, Snack Size, Halloween Snack, 0.28 oz. (46 Count)",
          "price": 0.01,
          "original_price": 11.16,
          "variants": [
            {
              "option1": "46 COUNT",
              "price": 0.01,
              "image": "https://m.media-amazon.com/images/I/71AkiMDYM0L._SL1500_.jpg"
            },
            {
              "option1": "92 COUNT",
              "price": 0.02,
              "image": "https://m.media-amazon.com/images/I/81MxGDmkPLL._SL1500_.jpg"
            },
            {
              "option1": "138 COUNT",
              "price": 0.03,
              "image": "https://m.media-amazon.com/images/I/81KCZdzTUHL._SL1500_.jpg"
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/71AkiMDYM0L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81MxGDmkPLL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81KCZdzTUHL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81-zdl1oZyL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/818zdMPg8vL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71aXZy6gouL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71mg-T56jkL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81MxGDmkPLL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81PnY4AueBL._SL1500_.jpg"
          ],
          "star_rating": 4.9,
          "Star_review_count": 754,
          "category": "snacks",
          "stock": 10
        },
        {
          "id": 18,
          "name": "OREO Mini Cookies Variety Pack",
          "description": "OREO Mini Cookies, Mini CHIPS AHOY! Cookies, RITZ Bits Cheese Crackers, Nutter Butter Bites & Wheat Thins Crackers, Nabisco Cookie & Cracker Variety Pack, 50 Snack Packs",
          "price": 0.01,
          "original_price": 27.49,
          "variants": [
            {
              "option1": "STANDARD",
              "price": 0.01,
              "image": ""
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/91k-dJ5md+L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/817yJuOKiHL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/812rRCubVBL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/816PnlgAgpL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91fYCMkcWWL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81le0PvVjxL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91Gp3+zSpkL._SL1500_.jpg",
            ""
          ],
          "star_rating": 4.8,
          "Star_review_count": 2597,
          "category": "snacks",
          "stock": 10
        },
        {
          "id": 19,
          "name": "Simply Snacks Variety Pack",
          "description": "Simply Snacks Variety Pack, 0.875 Oz, 36 Count, Packaging May Vary",
          "price": 0.01,
          "original_price": 22.43,
          "variants": [
            {
              "option1": "STANDARD",
              "price": 0.01,
              "image": ""
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/91ZJ5Gk9BNL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91yeIsRbGoL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81Jl5MwcxsL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91sUp54jmdL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71rXYa+RC9L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71ffhKrOt9L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81jx+35U8FL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81jx+35U8FL._SL1500_.jpg"
          ],
          "star_rating": 4.8,
          "Star_review_count": 1547,
          "category": "snacks",
          "stock": 10
        },
        {
          "id": 20,
          "name": "HERSHEY'S Variety Box",
          "description": "HERSHEY'S, KIT KAT and REESE'S Assorted Milk Chocolate Candy Variety Box, Halloween Candy, 27.3 oz (18 Count)",
          "price": 0.01,
          "original_price": 18.99,
          "variants": [
            {
              "option1": "STANDARD",
              "price": 0.01,
              "image": ""
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/81NsS9GkOPL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81xzaxIroTL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71NlYAXVcbL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71bsb-7VvbL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91ddSJ+ODkL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91Az07Xyq6L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71h050+ytoL._SL1500_.jpg"
          ],
          "star_rating": 4.5,
          "Star_review_count": 2014,
          "category": "candy",
          "stock": 10
        },
        {
          "id": 21,
          "name": "Mars Variety Pack",
          "description": "Mars M&M'S, SNICKERS, 3 MUSKETEERS, SKITTLES & STARBURST Variety Pack Full Size Bulk Candy Assortment, 56.11 oz, 30 Count",
          "price": 0.01,
          "original_price": 36.9,
          "variants": [
            {
              "option1": "STANDARD",
              "price": 0.01,
              "image": ""
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/71O+At6d3nL._SL1000_.jpg",
            "https://m.media-amazon.com/images/I/71uuio91JBL._SL1000_.jpg",
            "https://m.media-amazon.com/images/I/71v7bT-KrWL._SL1000_.jpg",
            "https://m.media-amazon.com/images/I/61XaoEZECSL._SL1000_.jpg",
            "https://m.media-amazon.com/images/I/71d69ASNYnL._SL1000_.jpg",
            "https://m.media-amazon.com/images/I/71fX5OpOJ9L._SL1000_.jpg",
            "https://m.media-amazon.com/images/I/71Ef-AUpw6L._SL1000_.jpg"
          ],
          "star_rating": 4.6,
          "Star_review_count": 654,
          "category": "candy",
          "stock": 10
        },
        {
          "id": 22,
          "name": "Cheez-It Cheese Crackers",
          "description": "Cheez-It Cheese Crackers, Baked Snack Crackers, Office and Kids Snacks, Variety Pack, 28.74oz Box (30 Packs)",
          "price": 0.01,
          "original_price": 12.96,
          "variants": [
            {
              "option1": "STANDARD",
              "price": 0.01,
              "image": ""
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/81JQdi4NMkL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91CuJpl2mJL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91ZjgKuguVL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81W81hGKLTL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81AslCwSApL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71kCvQ9NRQL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71o-n43vJqL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81sciR1DLPL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81H7lmidw6L._SL1500_.jpg"
          ],
          "star_rating": 4.8,
          "Star_review_count": 218,
          "category": "snacks",
          "stock": 10
        },
        {
          "id": 23,
          "name": "PopCorners Popped Corn Snacks",
          "description": "PopCorners Popped Corn Snacks, Sampler Pack, 1 Ounce (Pack of 20) (Assortment May Vary)",
          "price": 0.01,
          "original_price": 22.43,
          "variants": [
            {
              "option1": "STANDARD",
              "price": 0.01,
              "image": ""
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/815re4Cw6CL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81be7gmcSVL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/61gr8tKkhmL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81fjVkEa07L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81xRzauHVtL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91TmbGV28XL._SL1500_.jpg"
          ],
          "star_rating": 4.9,
          "Star_review_count": 1055,
          "category": "snacks",
          "stock": 10
        },
        {
          "id": 24,
          "name": "Jack Link's Beef Jerky Variety Pack",
          "description": "Jack Link's Beef Jerky Variety Pack - Includes Original and Teriyaki Jerky, Bulk Protein Snack Pack, Good Source of Protein, Meat Snacks Made with 100% Beef, Individual Bags - 1.25 Oz (Pack of 9)",
          "price": 0.01,
          "original_price": 19.99,
          "variants": [
            {
              "option1": "STANDARD",
              "price": 0.01,
              "image": ""
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/61M3eJY6tFL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/910kuRSkicL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91KlLNKSwwL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91LjiDbDXOL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91w+SLAXJoL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91RdKS4zyCL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91iH4Yvht5L._SL1500_.jpg"
          ],
          "star_rating": 4.9,
          "Star_review_count": 584,
          "category": "snacks",
          "stock": 10
        },
        {
          "id": 25,
          "name": "Welch's Fruit Snacks",
          "description": "Welch's Fruit Snacks, Mixed Fruit Snack Box, Gluten Free, 0.8oz Snack Packs (Pack of 40)",
          "price": 0.01,
          "original_price": 8.49,
          "variants": [
            {
              "option1": "STANDARD",
              "price": 0.01,
              "image": ""
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/818Gd9retPL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/61jWAJZqUZL.jpg",
            "https://m.media-amazon.com/images/I/91ocXJoCM3L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81wNk9fC9jL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81IkYk0kQLL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81srqkzkEML._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81Fq6ztR-tL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/719fSIc8qoL._SL1200_.jpg"
          ],
          "star_rating": 4.9,
          "Star_review_count": 1665,
          "category": "candy",
          "stock": 10
        },
        {
          "id": 26,
          "name": "Smartfood Popcorn",
          "description": "Smartfood Popcorn, Variety Pack, 0.5 Ounce (Pack of 40)",
          "price": 0.01,
          "original_price": 22.16,
          "variants": [
            {
              "option1": "STANDARD",
              "price": 0.01,
              "image": ""
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/81y-6PigaeL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91z9fyVBD3L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91BaEW13Q0L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81TgzPbfmAL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/91Oaar731zL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/713kqw+scbL._SL1200_.jpg",
            "https://m.media-amazon.com/images/I/81JNwaE8+bL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/61XKl94ipLL._SL1200_.jpg",
            "https://m.media-amazon.com/images/I/61i0TnRF8lL._SL1500_.jpg"
          ],
          "star_rating": 4.9,
          "Star_review_count": 886,
          "category": "snacks",
          "stock": 10
        },
        {
          "id": 27,
          "name": "Entenmann's Little Bites",
          "description": "Entenmann's Little Bites Chocolate Chip Muffins, Pouches of Mini Muffins 8.25 oz, 5 Count",
          "price": 0.01,
          "original_price": 33.69,
          "variants": [
            {
              "option1": "STANDARD",
              "price": 0.01,
              "image": ""
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/81yVLnf6AmL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81MHl-YQL-L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71vSMxpEy1L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81rKjNcEYOL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71T1lZKpTHL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71bDybI3aIL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71zOO8DGP5L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81Jvs8-f5VL._SL1500_.jpg"
          ],
          "star_rating": 4.9,
          "Star_review_count": 365,
          "category": "snacks",
          "stock": 10
        }
      ]
    }
  },
  computed: {
    categories() {
      return [
        { value: 'all', label: 'SHOP ALL' }
      ]
    },
    filteredProducts() {
      if (this.selectedCategory === 'all') {
        return this.products
      }
      return this.products.filter(product =>
        product.category === this.selectedCategory
      )
    },
    withBundleCard() {
      const items = [...this.filteredProducts]
      const shouldInsert = false // 隐藏bundle卡片
      if (shouldInsert) {
        items.splice(3, 0, { __bundleCard: true, id: 'bundle-promo' })
      }
      return items
    }
  },
  methods: {
    scrollToProducts() {
      const productsSection = document.querySelector('.products-grid')
      if (productsSection) {
        productsSection.scrollIntoView({
          behavior: 'smooth'
        })
      }
    },
    setSelectedCategory(category) {
      this.selectedCategory = category
    },
    getProductImages(product) {
      if (product.images && product.images.length > 0) {
        return product.images
      }
      return ['~@/assets/products/xiangji.png']
    },
    getProductImage(product, index) {
      const images = this.getProductImages(product)
      return images[index] || images[0]
    },
    switchProductImage(productId, newIndex) {
      this.$set(this.currentImageIndex, productId, newIndex)
    },
    addToCart(product) {
      if (product.stock === 0) return
      alert(`Added ${product.name} to cart!`)
    },
    navigateToProductDetail(product) {
      // 使用params传递ID，使用state作为第二个参数传递完整产品数据
      this.$router.push(
        {
          path: `/product/${product.id}`,
          params: { id: product.id }
        },
        // 第二个参数是state对象，用于传递不显示在URL中的数据
        { product: product }
      )
    }
  },
  mounted() {
    // 从URL参数读取分类
    const urlParams = new URLSearchParams(window.location.search)
    const category = urlParams.get('category')
    if (category) {
      this.selectedCategory = category
    }
  }
}
</script>

<style lang="scss" scoped>
.products-page {
  font-family: 'Montserrat', sans-serif;
  min-height: 100vh;
  background: #f8f9fa;
}

// Top Banner
.top-banner {
  background: #8b5cf6;
  color: white;
  text-align: center;
  padding: 8px 0;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.banner-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

// Main Header
.main-header {
  background: white;
  padding: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.brand-logo {
  font-size: 28px;
  font-weight: 800;
  color: #4c1d95;
  letter-spacing: -1px;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: #4c1d95;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: color 0.3s ease;

  &:hover {
    color: #7c3aed;
  }
}

// Hero Section Styles
.hero-section {
  background: linear-gradient(270deg, rgb(153, 223, 255) 35%, rgb(221, 203, 255) 50%, rgb(255, 228, 179) 65%);
  padding: 20px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-title {
  font-size: 36px;
  font-weight: 900;
  color: transparent;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: #3f0791;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: inline-block;
  margin: 0;

  @media (min-width: 640px) {
    font-size: 36px;
  }

  @media (min-width: 768px) {
    font-size: 36px;
  }
}

// Content Background
.content-background {
  background: linear-gradient(180deg, #E9DDFF 0%, #DAD7FF 100%);
  width: 100%;
  min-height: 100vh;
  padding-top: 20px;
  padding-bottom: 32px;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;

  @media (min-width: 640px) {
    padding: 0 24px;
  }

  @media (min-width: 1024px) {
    padding: 0 32px;
  }
}

// Shop All Section
.shop-all-section {
  text-align: center;
  padding: 20px 0;
}

.shop-all-button {
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 25px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
  }
}

// Category Filters
.category-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  padding: 24px 0;

  @media (min-width: 640px) {
    gap: 16px;
  }
}

.category-button {
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  border: 2px solid #3f0791;
  background: transparent;
  color: #3f0791;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background: linear-gradient(to right, #FF3ECF, #5F2FE8);
    color: white;
    border-color: transparent;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 640px) {
    padding: 8px 20px;
  }
}

// Products Grid
.products-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.product-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 466.84px;
  position: relative;

  &:hover {
    transform: translateY(-5px);
  }
}

// Bundle Card
.bundle-card {
  position: relative;
  height: 100%;
  background: linear-gradient(to bottom, #592DEB, #FF35C6);
  border-radius: 16px;
  overflow: hidden;
}

.bundle-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;

  &.desktop {
    display: none;

    @media (min-width: 768px) {
      display: block;
    }
  }

  &.mobile {
    display: block;

    @media (min-width: 768px) {
      display: none;
    }
  }
}

.bundle-cta {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 0 16px;
}

.bundle-button {
  background: white;
  color: #5F2FE8;
  border: none;
  padding: 8px 24px;
  border-radius: 50px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
  }
}

// Product Content
.product-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 40px;
  height: 40px;
  z-index: 10;
}

.product-image-container {
  position: relative;
  overflow: hidden;
  padding: 16px 16px 0;
  cursor: pointer;
}

.product-image {
  position: relative;
  background: #FDFBFF;
  border-radius: 12px;
  overflow: hidden;
  height: 192px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(95, 47, 232, 0.25) 0%, rgba(179, 0, 255, 0.2) 50%, rgba(255, 62, 207, 0.25) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
  pointer-events: none;
}

.product-card:hover .image-overlay {
  opacity: 1;
}

.image-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(74, 31, 184, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(74, 31, 184, 0.5);
  }

  &.active {
    background: #4A1FB8;
    transform: scale(1.1);
  }
}

.product-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  text-align: center;
  font-weight: 800;
  color: #4A1FB8;
  line-height: 1.3;
  font-size: 16px;
  margin-bottom: 12px;
  word-wrap: break-word;
}

.product-pricing {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.current-price {
  font-size: 20px;
  font-weight: 800;
  color: #4A1FB8;
}

.original-price {
  font-size: 16px;
  color: #9ca3af;
  text-decoration: line-through;
}

.shop-button {
  width: 100%;
  height: 44px;
  border-radius: 50px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: auto;
  border: none;

  &:not(.out-of-stock) {
    background: white;
    color: #5F2FE8;

    &:hover {
      background: rgba(255, 255, 255, 0.9);
    }
  }

  &.out-of-stock {
    background: white;
    color: #9ca3af;
    border: 1px solid rgba(255, 255, 255, 0.6);
    cursor: not-allowed;
  }
}

.cart-icon {
  width: 16px;
  height: 16px;
}

// No Products State
.no-products {
  text-align: center;
  padding: 64px 20px;
}

.no-products-icon {
  width: 96px;
  height: 96px;
  margin: 0 auto 24px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.no-products h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.no-products p {
  color: #6b7280;
  margin-bottom: 24px;
}

.reset-button {
  background: #5F2FE8;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4C23C9;
    transform: translateY(-2px);
  }
}

// Responsive Design
@media (max-width: 768px) {
  .content-background {
    padding-top: 120px;
  }

  .hero-title {
    font-size: 24px;
  }
}

// Responsive Design
@media (max-width: 768px) {
  .header-content {
    padding: 0 15px;
    flex-direction: column;
    gap: 15px;
  }

  .brand-logo {
    font-size: 24px;
  }

  .nav-links {
    gap: 20px;
  }

  .hero-section {
    padding: 30px 20px;
    min-height: 100px;
  }

  .hero-title {
    font-size: 32px;
  }

  .content-background {
    padding-top: 20px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 20px 15px;
    min-height: 80px;
  }

  .hero-title {
    font-size: 28px;
  }
}
</style>