<template>
  <Layout>
    <div class="product-detail-page" v-if="product">
      <!-- Product Hero Section -->
      <section class="product-hero">
        <div class="container">
          <div class="product-detail-grid">
            <!-- Product Image -->
            <div class="product-image-section">
              <div class="main-image">
                <img :src="images[selectedImage]" :alt="product.name" />
              </div>
              <div class="image-thumbnails" v-if="images.length > 1">
                <button 
                  type="button"
                  @click="changeImage(-1)"
                  class="thumb-nav-btn prev-btn"
                  aria-label="Previous images"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="#4A1FB8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <div class="thumbnails-container">
                  <button 
                    v-for="(image, index) in images" 
                    :key="index"
                    class="thumbnail"
                    :class="{ active: selectedImage === index }"
                    @click="setSelectedImage(index)"
                  >
                    <img :src="image" :alt="`${product.name} ${index + 1}`" />
                  </button>
                </div>
                <button 
                  type="button"
                  @click="changeImage(1)"
                  class="thumb-nav-btn next-btn"
                  aria-label="Next images"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="#4A1FB8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Product Info -->
            <div class="product-info-section">
              <h1 class="product-title">{{ product.description || "Peanut Butter" }}</h1>
              
              <div class="product-rating">
                <div class="stars">
                  <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.round(product.star_rating || product.rating || 0) }">★</span>
                </div>
                <span class="reviews-count">{{ (product.Star_review_count || product.reviews_count || 0).toLocaleString() }} reviews</span>
              </div>
              
              
              <!-- Step 1: Choose Flavor -->
              <div class="step-section">
                <div class="step-label">1: CHOOSE YOUR FLAVOR</div>
                <div class="flavor-selector">
                  <button 
                    type="button"
                    @click="variantOpen = !variantOpen"
                    class="flavor-option"
                  >
                    <span class="flavor-content">
                      <span class="flavor-image">
                        <img :src="selectedVariant?.image || (product.images && product.images[0]) || (product.gallery && product.gallery[0]) || product.image_url || fallbackHero" :alt="selectedVariant?.option1 || product.name" />
                      </span>
                      <span class="flavor-name">
                        {{ selectedVariant?.option1 || selectedVariant?.sku || product.description || "Flavor" }}
                      </span>
                    </span>
                    <span class="dropdown-arrow" :class="{ rotated: variantOpen }">▼</span>
                  </button>
                  
                  <!-- Variant Dropdown -->
                  <div v-if="variantOpen" class="variant-dropdown">
                    <div v-if="productVariants.length > 0">
                      <button 
                        v-for="(variant, idx) in productVariants" 
                        :key="idx"
                        type="button"
                        @click="selectVariant(idx)"
                        class="variant-option"
                        :class="{ selected: selectedVariantIndex === idx }"
                      >
                        <span class="variant-image">
                          <img :src="variant.image || (product.images && product.images[0]) || (product.gallery && product.gallery[0]) || product.image_url || ''" :alt="variant.option1 || variant.sku" />
                        </span>
                        <div class="variant-info">
                          <div class="variant-name">{{ variant.option1 || variant.sku || `Variant ${idx + 1}` }}</div>
                          <div v-if="typeof variant.price === 'number'" class="variant-price">${{ Number(variant.price).toFixed(2) }}</div>
                        </div>
                      </button>
                    </div>
                    <div v-else class="no-variants">暂无可选变体</div>
                  </div>
                </div>
              </div>
              
              <!-- Step 2: Choose Frequency -->
              <div class="step-section">
                <div class="step-label">2: CHOOSE YOUR FREQUENCY</div>
                <div class="frequency-option" :class="{ selected: purchaseType === 'one_time' }" @click="purchaseType = 'one_time'">
                  <div class="radio-button">
                    <div class="radio-dot" v-if="purchaseType === 'one_time'"></div>
                  </div>
                  <span class="frequency-label">ONE-TIME PURCHASE:</span>
                  <div class="frequency-price">
                    <div class="price-container">
                      <div class="price">${{ oneTimePrice.toFixed(2) }}</div>
                      <div v-if="originalPrice && originalPrice > oneTimePrice" class="original-price">${{ originalPrice.toFixed(2) }}</div>
                    </div>
                    <div class="per-serving">${{ perServingPrice }} / serving</div>
                  </div>
                </div>
              </div>
              
              <!-- Quantity and Purchase -->
              <div class="purchase-section">
                <div class="quantity-selector">
                  <button class="quantity-btn" disabled>-</button>
                  <span class="quantity">{{ quantity }}</span>
                  <button class="quantity-btn" disabled>+</button>
                </div>
                <!--  -->
                <button class="amazon-pay-button"    onclick="submitAmazon()" >
                  <div class="amazon-pay-content">
                    <div class="amazon-s-icon">S</div>
                    <div class="amazon-pay-text">
                      <div class="amazon-logo">
                        <img src="@/assets/products_logo/amazon.png" alt="Amazon" />
                      </div>
                      <span class="pay-text">pay</span>
                    </div>
                    <div class="chevron">>></div>
                  </div>
                </button>
              </div>
              
              <p class="guarantee-text">
                Try risk-free, 100% happiness guaranteed. <a href="#">See terms of use.</a>
              </p>
            </div>
          </div>
        </div>
        
        <!-- Decorative Elements -->
        <div class="decorative-elements">
          <!-- Bottom right decoration for mobile -->
          <img
            src="https://magicspoon.com/cdn/shop/t/667/assets/MS-PB-ASSET3_2x_e2ddf730-f3c0-4840-b7a2-a7aefaa34c71-202409.png?v=1673988958&auto=format,compress&w=800"
            alt=""
            class="mobile-decoration"
            aria-hidden="true"
          />
          
          <!-- SVG decorations for desktop -->
          <svg class="desktop-decoration left" viewBox="0 0 160 120" aria-hidden="true">
            <defs>
              <linearGradient id="tentL" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#F59E0B" />
                <stop offset="50%" stop-color="#FF60C1" />
                <stop offset="100%" stop-color="#6B2FE8" />
              </linearGradient>
            </defs>
            <rect x="10" y="70" width="140" height="30" fill="#FFF" />
            <polygon points="80,10 150,70 10,70" fill="url(#tentL)" />
            <rect x="30" y="70" width="16" height="30" fill="#F59E0B" />
            <rect x="50" y="70" width="16" height="30" fill="#6B2FE8" />
            <rect x="70" y="70" width="16" height="30" fill="#FFFFFF" />
            <rect x="90" y="70" width="16" height="30" fill="#FF60C1" />
            <rect x="110" y="70" width="16" height="30" fill="#10B981" />
          </svg>
          
          <svg class="desktop-decoration right" viewBox="0 0 160 120" aria-hidden="true">
            <defs>
              <linearGradient id="tentR" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stop-color="#F59E0B" />
                <stop offset="50%" stop-color="#FF60C1" />
                <stop offset="100%" stop-color="#6B2FE8" />
              </linearGradient>
            </defs>
            <rect x="10" y="70" width="140" height="30" fill="#FFF" />
            <polygon points="80,10 150,70 10,70" fill="url(#tentR)" />
            <rect x="30" y="70" width="16" height="30" fill="#F59E0B" />
            <rect x="50" y="70" width="16" height="30" fill="#6B2FE8" />
            <rect x="70" y="70" width="16" height="30" fill="#FFFFFF" />
            <rect x="90" y="70" width="16" height="30" fill="#FF60C1" />
            <rect x="110" y="70" width="16" height="30" fill="#10B981" />
          </svg>
        </div>
      </section>

      <!-- Reviews Section -->
      <section class="reviews-section">
        <div class="container">
          <div class="reviews-header">
            <div class="overall-rating">
              <div class="rating-score">{{ averageRating.toFixed(1) }}</div>
              <div class="rating-stars">
                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= fullStars }">★</span>
              </div>
              <div class="rating-text">Based on {{ reviewCount.toLocaleString() }} reviews</div>
            </div>
            <div class="sort-dropdown">
              <select v-model="sortBy">
                <option value="highest">Highest Rating</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>
          </div>
          
          <div class="reviews-list">
            <div v-for="review in sortedReviews" :key="review.id" class="review-item">
              <div class="review-header">
                <div class="reviewer-info">
                  {{ review.name }} · Verified Buyer
                </div>
                <div class="review-date">{{ review.when }}</div>
              </div>
              <div class="review-stars">
                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
              </div>
              <div class="review-divider"></div>
              <h4 class="review-title">{{ review.title }}</h4>
              <p class="review-text">{{ review.body }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    
    <!-- Loading State -->
    <div v-else-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading product...</p>
    </div>
    
    <!-- Product Not Found -->
    <div v-else class="loading">
      <h2>Product not found</h2>
      <p>The product you're looking for doesn't exist.</p>
      <button @click="$router.push('/products')" class="back-button">Back to Products</button>
    </div>
    
    <!-- Mobile Sticky Footer -->
    <div class="mobile-sticky-footer">
      <div class="mobile-purchase-info">
        <div class="mobile-purchase-type">One-time purchase</div>
        <div class="mobile-price-container">
          <div class="mobile-price">${{ oneTimePrice.toFixed(2) }}</div>
          <div v-if="originalPrice && originalPrice > 0" class="mobile-original-price">${{ originalPrice.toFixed(2) }}</div>
        </div>
      </div>
      <!--  @click="handleAmazonPay" -->
      <button 
         onclick="submitAmazon()"
        class="mobile-amazon-pay-btn"
      >
        <div class="amazon-pay-content">
          <div class="amazon-s-icon">S</div>
          <div class="amazon-pay-text">
            <div class="amazon-logo">
              <img src="@/assets/products_logo/amazon.png" alt="Amazon" />
            </div>
            <span class="pay-text">pay</span>
          </div>
          <div class="chevron">>></div>
        </div>
      </button>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/components/Layout.vue'

export default {
  name: 'ProductDetail',
  components: {
    Layout
  },
  props: {
    id: {
      type: [String, Number],
      required: false
    }
  },
   data() {
    return {
      product: null,
      loading: true,
      selectedImage: 0,
      quantity: 1,
      purchaseType: 'one_time',
      sortBy: 'highest',
      variantOpen: false,
      selectedVariantIndex: null,
      heroImageOverride: null,
      fallbackHero: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/4d09b0d62_magicspooncom_products_peanut-butter-1-case-4-boxes.png",
      allProducts:  [
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
        {   
          "id": 14,
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
      ],
      reviews: [
        {
          id: 1,
          name: 'STEPHEN R.',
          title: 'MY FAVORITE',
          body: 'The taste is great, my whole family loves it. It\'s a great value, and I\'ll be buying this often!',
          rating: 5,
          when: 'about 13 hours ago',
          ts: Date.now() - 13 * 60 * 60 * 1000
        },
        {
          id: 2,
          name: 'ANDREW C.',
          title: 'CRUNCHY',
          body: 'It\'s delicious, and the portion is generous. It\'s exactly as described, and I wasn\'t disappointed.',
          rating: 5,
          when: '13 days ago',
          ts: Date.now() - 14 * 24 * 60 * 60 * 1000
        },
        {
          id: 3,
          name: 'CLAUDIA S.',
          title: 'GREAT TASTE BUT STICKY',
          body: 'The packaging is excellent, no damage. The texture is crispy/soft, and delicious.',
          rating: 5,
          when: '14 days ago',
          ts: Date.now() - 15 * 24 * 60 * 60 * 1000
        },
        {
          id: 4,
          name: 'Anisia',
          title: 'GREAT TASTE BUT STICKY',
          body: 'I\'ve bought from this store many times, and the quality is always consistent. I trust this store.',
          rating: 5,
          when: '14 days ago',
          ts: Date.now() - 15 * 24 * 60 * 60 * 1000
        },
        {
          id: 5,
          name: 'Rosa',
          title: 'GREAT TASTE BUT STICKY',
          body: 'It\'s good, delicious, and the price is great. I\'ll definitely be back.',
          rating: 5,
          when: '15 days ago',
          ts: Date.now() - 15 * 24 * 60 * 60 * 1000
        }
      ]
    }
  },
  computed: {
    images() {
      if (!this.product) return []
      
      // 优先使用 images 数组（产品页的数据结构）
      if (this.product.images && this.product.images.length > 0) {
        return this.product.images
      }
      // 兼容 gallery 数组
      if (this.product.gallery && this.product.gallery.length > 0) {
        return this.product.gallery
      }
      
      // 最后使用 image_url 或 fallbackHero
      return [this.product.image_url || this.fallbackHero]
    },
    productVariants() {
      return (this.product?.variants || []).filter(Boolean)
    },
    selectedVariant() {
      return this.productVariants.length > 0 && this.selectedVariantIndex != null 
        ? this.productVariants[this.selectedVariantIndex] 
        : null
    },
    oneTimePrice() {
      const price = this.selectedVariant?.price ?? this.product?.price
      return Number(price) || 0.01
    },
    originalPrice() {
      return Number(this.product?.original_price) || 0
    },
    perServingPrice() {
      return (this.oneTimePrice / 20).toFixed(2)
    },
    averageRating() {
      return Number(this.product?.star_rating ?? this.product?.rating ?? 4.6)
    },
    reviewCount() {
      return Number(this.product?.Star_review_count ?? this.product?.reviews_count ?? 0)
    },
    fullStars() {
      return Math.round(this.averageRating)
    },
    sortedReviews() {
      if (this.sortBy === 'highest') {
        return [...this.reviews].sort((a, b) => b.rating - a.rating)
      } else {
        return [...this.reviews].sort((a, b) => b.ts - a.ts)
      }
    }
  },
  mounted() {
    this.loadProduct()
  },
  watch: {
    // 监听路由变化，当产品ID或产品数据改变时重新加载产品
    '$route'(to, from) {
      if (to.query.id !== from.query.id || 
          to.params.id !== from.params.id || 
          to.query.productData !== from.query.productData) {
        this.loadProduct()
      }
    }
  },
  methods: {
    loadProduct() {
      // 重置状态
      this.product = null
      this.loading = true
      
      try {
        // 方法1：优先使用Vue Router的state传递的数据
        // 注意：在Vue Router 3.x中，state数据可能在不同位置，需要检查多个可能的位置
        if (this.$route.params && this.$route.params.product) {
          this.product = this.$route.params.product
          console.log('Using product data from route params:', this.product)
        } else if (window.history.state && window.history.state.product) {
          this.product = window.history.state.product
          console.log('Using product data from window history state:', this.product)
        }
        
        // 方法2：如果没有state数据，尝试使用query中的productData
        if (!this.product && this.$route.query.productData) {
          try {
            this.product = JSON.parse(this.$route.query.productData)
            console.log('Using product data from query string:', this.product)
          } catch (parseError) {
            console.error('Error parsing productData from query:', parseError)
          }
        }
        
        // 方法3：使用ID在本地数据中查找
        if (!this.product) {
          let productId = this.id
          if (!productId) {
            productId = this.$route.query.id || this.$route.params.id
          }
          
          if (productId) {
            productId = parseInt(productId)
            console.log('Looking for product with ID:', productId)
            
            this.product = this.allProducts.find(p => p.id === productId)
            console.log('Found product by ID:', this.product)
          }
        }
        
        // 初始化选中的变体
        if (this.product && this.product.variants && this.product.variants.length > 0) {
          this.selectedVariantIndex = 0
        } else {
          this.selectedVariantIndex = null
        }
        
        // 重置图片选择
        this.selectedImage = 0
        this.heroImageOverride = null
        
      } catch (error) {
        console.error('Error loading product:', error)
      } finally {
        this.loading = false
      }
      
      // 调试信息
      console.log('Final product data:', this.product)
    },
    setSelectedImage(index) {
      this.selectedImage = index
    },
    changeImage(delta) {
      if (!this.images || this.images.length === 0) return
      const next = (this.selectedImage + delta + this.images.length) % this.images.length
      this.selectedImage = next
    },
    selectVariant(idx) {
      this.selectedVariantIndex = idx
      this.variantOpen = false
      const variant = this.productVariants[idx]
      
      // 如果变种有特定图片，找到对应的图片索引
      if (variant && variant.image && this.product.images) {
        const imageIndex = this.product.images.findIndex(img => img === variant.image)
        if (imageIndex !== -1) {
          this.selectedImage = imageIndex
        }
      }
      
      console.log('Selected variant:', variant)
      console.log('Selected image index:', this.selectedImage)
    },
    handleAmazonPay() {
      // 计算购物车价值
      const cartValue = (this.oneTimePrice * this.quantity).toFixed(2)
      
      // 发送结账事件
      if (this.product) {
        console.log('Initiate checkout:', parseFloat(cartValue))
      }
      
      alert(`Redirecting to Amazon Pay... Total: $${cartValue}`)
    },
    addToCart(product = this.product) {
      alert(`Added ${product.name} to cart!`)
    }
  }
}
</script>

<style lang="scss" scoped>
.product-detail-page {
  font-family: 'Montserrat', sans-serif;
  min-height: 100vh;
  background: #FFEBD6;
  // background:   #FEDEAC;

  padding-top: 119.19px;
  
  @media (max-width: 768px) {
    padding-top: 123px;
  }
  
  @media (max-width: 480px) {
    padding-top: 123px;
  }
}

// Product Hero Section
.product-hero {
  background: #FEDEAC;
  padding: 40px 20px;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 40px 16px;
  }
  
  @media (min-width: 768px) {
    padding-top: 60px;
    padding-bottom: 60px;
  }
}

.container {
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

.product-detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  align-items: start;
  
  @media (max-width: 768px) {
    display: block;
    gap: 24px;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 60px;
  }
}

.product-image-section {
  position: relative;
}

.main-image {
  width: 100%;
  max-width: 520px;
  height: 320px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 320px;
    max-width: 100%;
    border-radius: 8px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
  
  @media (min-width: 768px) {
    height: 440px;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
}

.image-thumbnails {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  position: relative;
  
  @media (max-width: 768px) {
    gap: 8px;
    margin-top: 16px;
    justify-content: center;
  }
}

.thumb-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  background: white;
  border: 2px solid #4A1FB8;
  color: #4A1FB8;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
  
  &:hover {
    background: #f3f4f6;
    transform: translateY(-50%) scale(1.05);
  }
  
  &.prev-btn {
    left: 0;
  }
  
  &.next-btn {
    right: 0;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
}

.thumbnails-container {
  display: flex;
  gap: 12px;
  overflow: hidden;
  padding: 0 40px;
  justify-content: center;
}

.thumbnail {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #5F2FE8;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
  
  &.active {
    border-color: #B300FF;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.product-info-section {
  background: transparent;
  padding: 0;
  
  @media (max-width: 768px) {
    margin-top: 20px;
  }
}

.product-title {
  font-size: 24px;
  font-weight: 800;
  color: #3F0791;
  margin-bottom: 12px;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 8px;
  }
  
  @media (min-width: 768px) {
    font-size: 28px;
  }
  
  @media (min-width: 1024px) {
    font-size: 32px;
  }
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    gap: 8px;
    margin-bottom: 16px;
  }
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 20px;
  color: #d1d5db;
  
  &.filled {
    color: #B300FF;
  }
}

.reviews-count {
  font-size: 14px;
  color: #3F0791;
  opacity: 0.8;
}


// Step Sections
.step-section {
  margin-bottom: 20px;
}

.step-label {
  font-size: 12px;
  font-weight: 700;
  color: #4A1FB8;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.flavor-selector {
  width: 100%;
  position: relative;
}

.flavor-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 2px solid #5F2FE8;
  border-radius: 50px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 10px 14px;
    border-radius: 25px;
  }
  
  &:hover {
    border-color: #B300FF;
  }
}

.flavor-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.flavor-image {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #5F2FE8;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.flavor-name {
  font-weight: 700;
  color: #4A1FB8;
  text-transform: uppercase;
}

.dropdown-arrow {
  color: #4A1FB8;
  font-size: 16px;
  transition: transform 0.3s ease;
  
  &.rotated {
    transform: rotate(180deg);
  }
}

.variant-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-height: 256px;
  overflow-y: auto;
  z-index: 40;
  padding: 8px;
}

.variant-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  text-align: left;
  
  &:hover {
    background: #f3f4f6;
  }
  
  &.selected {
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
  }
}

.variant-image {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #5F2FE8;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.variant-info {
  flex: 1;
}

.variant-name {
  font-weight: 700;
  color: #4A1FB8;
  text-transform: uppercase;
  font-size: 14px;
}

.variant-price {
  font-size: 12px;
  color: #4A1FB8;
  opacity: 0.7;
}

.no-variants {
  padding: 12px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

.frequency-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border: 2px solid #CFC7FF;
  border-radius: 16px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.selected {
    border-color: #5F2FE8;
    background: white;
    box-shadow: 0 8px 24px rgba(82, 34, 227, 0.18);
  }
  
  &:hover {
    background: white;
  }
}

.radio-button {
  width: 20px;
  height: 20px;
  border: 2px solid #5F2FE8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.radio-dot {
  width: 8px;
  height: 8px;
  background: #5F2FE8;
  border-radius: 50%;
}

.frequency-label {
  flex: 1;
  font-weight: 700;
  color: #4A1FB8;
  text-transform: uppercase;
}

.frequency-price {
  text-align: right;
  min-width: 110px;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
}

.price {
  font-size: 18px;
  font-weight: 800;
  color: #4A1FB8;
}

.original-price {
  font-size: 14px;
  color: #9CA3AF;
  text-decoration: line-through;
  font-weight: 500;
}

.per-serving {
  font-size: 12px;
  color: #4A1FB8;
  opacity: 0.7;
}

// Purchase Section
.purchase-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  
  @media (max-width: 768px) {
    gap: 8px;
    margin-bottom: 16px;
  }
  
  @media (max-width: 768px) {
    // flex-direction: column;
    gap: 16px;
  }
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 2px solid #5F2FE8;
  border-radius: 50px;
  overflow: hidden;
  background: white;
  
  @media (max-width: 768px) {
    width: 100%;
  }
}

.quantity-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: #4A1FB8;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: #f3f4f6;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.quantity {
  padding: 0 16px;
  font-weight: 700;
  color: #4A1FB8;
}

.amazon-pay-button {
  flex: 1;
  height: 50px;
  background: linear-gradient(to bottom, #FFD700, #FFA500);
  border: 2px solid #DAA520;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    height: 50px;
    border-radius: 8px;
  }
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    background: linear-gradient(to bottom, #FFE55C, #FFB347);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
}

.amazon-pay-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  justify-content: space-between;
  padding: 0 16px;
  height: 100%;
}

.amazon-s-icon {
  width: 24px;
  height: 24px;
  border: 2px solid #8B4513;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  flex-shrink: 0;
  margin-top: -7px;
  font-size: 14px;
  font-weight: bold;
  color: #8B4513;
  font-family: Arial, sans-serif;
  
  @media (max-width: 400px) {
    display: none;
  }
}

.amazon-pay-text {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  gap: 6px;
}

.amazon-logo {
  display: flex;
  align-items: flex-start;
  
  img {
    height: 22px;
    width: auto;
    object-fit: contain;
  }
}

.pay-text {
  font-size: 20px;
  font-weight: bold;
  color: #000;
  font-family: Arial, sans-serif;
  line-height: 1;
  text-transform: lowercase;
  margin-top: -7px;
}

.chevron {
  font-size: 16px;
  font-weight: bold;
  color: #000;
  font-family: Arial, sans-serif;
  flex-shrink: 0;
  margin-top: -7px;
}

.guarantee-text {
  font-size: 12px;
  color: #6b7280;
  opacity: 0.8;
  margin: 12px 0 0 0;
  line-height: 1.4;
  
  a {
    color: #4A1FB8;
    text-decoration: underline;
  }
}

// Decorative Elements
.decorative-elements {
  position: relative;
  pointer-events: none;
}

.mobile-decoration {
  position: absolute;
  bottom: -40px;
  right: 16px;
  width: 112px;
  height: auto;
  
  @media (min-width: 768px) {
    display: none;
  }
}

.desktop-decoration {
  position: absolute;
  bottom: 24px;
  width: 160px;
  height: auto;
  
  @media (max-width: 767px) {
    display: none;
  }
  
  &.left {
    left: 24px;
  }
  
  &.right {
    right: 24px;
  }
}

// Reviews Section
.reviews-section {
  background: linear-gradient(180deg, #FFF3B0 0%, #D4FFB0 100%);
  padding: 60px 20px;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}

.overall-rating {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rating-score {
  font-size: 40px;
  font-weight: 800;
  color: #4A1FB8;
  
  @media (min-width: 768px) {
    font-size: 48px;
  }
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.rating-text {
  font-size: 14px;
  color: #4A1FB8;
  opacity: 0.9;
}

.sort-dropdown {
  select {
    padding: 8px 16px;
    border: 2px solid #5F2FE8;
    border-radius: 50px;
    background: white;
    color: #4A1FB8;
    font-weight: 600;
    cursor: pointer;
  }
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-item {
  background: white;
  padding: 24px 28px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 480px) {
    padding: 20px;
  }
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.reviewer-info {
  font-size: 12px;
  font-weight: 700;
  color: #4A1FB8;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.9;
}

.review-date {
  font-size: 12px;
  color: #4A1FB8;
  opacity: 0.7;
}

.review-stars {
  display: flex;
  gap: 2px;
  margin-bottom: 12px;
}

.review-divider {
  height: 2px;
  background: #5F2FE8;
  margin-bottom: 16px;
}

.review-title {
  font-size: 20px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
  -webkit-text-stroke: 2px #4A1FB8;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.review-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
  margin: 0;
}

// Loading State
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  font-size: 18px;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #7c3aed;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.back-button {
  background: #7c3aed;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #6d28d9;
    transform: translateY(-1px);
  }
}

// Mobile Sticky Footer
.mobile-sticky-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  padding: 16px 20px;
  display: none;
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    max-width: 100%;
    margin: 0 auto;
  }
}

.mobile-purchase-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex-shrink: 0;
}

.mobile-purchase-type {
  font-size: 11px;
  color: #3F0791;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mobile-price-container {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mobile-price {
  font-size: 20px;
  font-weight: 800;
  color: #3F0791;
  line-height: 1;
}

.mobile-original-price {
  font-size: 14px;
  color: #9CA3AF;
  text-decoration: line-through;
  font-weight: 500;
}

.mobile-amazon-pay-btn {
  background: linear-gradient(to bottom, #FFD700, #FFA500);
  border: 2px solid #DAA520;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  flex: 1;
  height: 50px;
  min-width: 140px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    background: linear-gradient(to bottom, #FFE55C, #FFB347);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
  
  .amazon-pay-content {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    justify-content: space-between;
    padding: 0 12px;
    height: 100%;
  }
  
  .amazon-s-icon {
    width: 20px;
    height: 20px;
    border: 2px solid #8B4513;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    color: #8B4513;
    font-size: 12px;
    font-weight: bold;
    flex-shrink: 0;
    margin-top: -2px;
  }
  
  .amazon-pay-text {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    flex: 1;
    gap: 8px;
  }
  
  .amazon-logo {
    display: flex;
    align-items: flex-start;
    
    img {
      height: 20px;
      width: auto;
    }
  }
  
  .pay-text {
    font-size: 20px;
    font-weight: bold;
    color: #000;
    font-family: Arial, sans-serif;
    line-height: 1;
    margin-top: -8px;
  }
  
  .chevron {
    font-size: 14px;
    font-weight: bold;
    color: #000;
    font-family: Arial, sans-serif;
    flex-shrink: 0;
    margin-top: -2px;
  }
}
</style>
