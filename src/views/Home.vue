<template>
  <Layout>
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-text-container">
            <h1 class="hero-title">
              Childhood classics.<br/>
              Grown-up<br/>
              ingredients.
            </h1>
            <div class="hero-buttons">
              <button class="cta-button primary" @click="$router.push('/products')">
                SHOP CEREAL
              </button>
              <button class="cta-button secondary" @click="$router.push('/products')">
                BUILD YOUR OWN BUNDLE
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Find Your Favorite Section -->
      <section class="find-favorite">
        <div class="container">
          <h2 class="section-title">Find Your Favorite</h2>
          <div class="products-horizontal">
            <div 
              v-for="item in favoriteItems" 
              :key="item.label" 
              class="favorite-item"
              @click="$router.push(item.to)"
            >
              <div class="favorite-image">
                <img :src="item.img" :alt="item.label" />
              </div>
              <p class="favorite-label">{{ item.label }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Subscription Section -->
      <section class="subscription-section">
        <div class="container">
          <div class="subscription-content">
            <div class="subscription-text">
              <h2 class="subscription-title">
                Get your childhood favorites delivered to your door monthly
              </h2>
              <p class="subscription-subtitle">Subscribe & Save 20%</p>
              <ul class="subscription-benefits">
                <li class="benefit-item">
                  <span class="benefit-icon">🎁</span>
                  <span>Free bowl set with your first order</span>
                </li>
                <li class="benefit-item">
                  <span class="benefit-icon">✨</span>
                  <span>VIP Access to limited-edition launches</span>
                </li>
                <li class="benefit-item">
                  <span class="benefit-icon">📦</span>
                  <span>Change flavors anytime</span>
                </li>
                <li class="benefit-item">
                  <span class="benefit-icon">🗓️</span>
                  <span>Skip or cancel delivery anytime</span>
                </li>
              </ul>
              <button class="subscription-button" @click="$router.push('/products')">
                BUILD YOUR BUNDLE
              </button>
            </div>
            <div class="subscription-image">
              <div class="image-wrapper">
                <img 
                  src="~@/assets/home/favorites.png" 
                  alt="Magic Spoon subscription box" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Products Section -->
      <section class="featured-products">
        <div class="container">
          <h2 class="section-title">Shop Best Sellers</h2>
          <div class="products-grid">
            <div 
              v-for="product in featuredProducts" 
              :key="product.id" 
              class="product-card"
              @click="goToProductDetail(product)"
            >
              <div class="product-badge" v-if="product.is_bestseller">
                <img src="~@/assets/home/best-seller-badge.png" alt="Best Seller" />
              </div>
              <div class="product-content">
                <div class="product-image">
                  <img :src="product.images[0]" :alt="product.name" />
                </div>
                <div class="product-info">
                  <div class="product-pricing">
                    <span class="current-price">${{ product.price }}</span>
                    <span class="original-price" v-if="product.original_price">${{ product.original_price }}</span>
                  </div>
                  <h3 class="product-name">{{ product.name }}</h3>
                  <div class="product-rating" v-if="product.star_rating">
                    <div class="stars">
                      <span v-for="i in Math.floor(product.star_rating)" :key="i" class="star" :class="{ filled: i <= product.star_rating }">★</span>
                    </div>
                    <span class="reviews-count">{{ product.Star_review_count || 0 }} Reviews</span>
                  </div>
                  <button class="shop-button" @click.stop="goToProductDetail(product)">
                    <span>Shop Now</span>
                    <span class="arrow">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="shop-all-button">
            <button class="cta-button primary" @click="$router.push('/products')">
              SHOP ALL PRODUCTS
            </button>
          </div>
        </div>
      </section>

      <!-- Category Showcase Section -->
      <section class="category-showcase">
        <div class="showcase-content">
          <div class="showcase-text">
            <h2 class="showcase-title">Crispy. Puffy. Crunchy.</h2>
            <p class="showcase-description">
              Need Magic Spoon on-the-go? We turned our delicious, high-protein cereal into a high-protein Treat! 
              Tastes just like those classic, crispy cereal bars with <strong>11–12g protein</strong>, 
              <strong>1–2g added sugars</strong>, and <strong>none of the artificial ingredients</strong>.
            </p>
          </div>
          <div class="showcase-image">
            <img src="~@/assets/home/PDP_-_Desktop_-_Frame2_3.jpg" alt="Magic Spoon Treats" />
          </div>
        </div>
      </section>

      <!-- Media Quotes Section -->
      <section class="media-quotes">
        <div class="container">
          <div class="quotes-grid">
            <div class="quote-item">
              <div class="quote-text">
                "With cereal that tastes this good and offers so much ... Magic Spoon may be the future of breakfast."
              </div>
              <div class="quote-divider">
                <img src="~@/assets/home/hr-wiggleline.svg" alt="" />
              </div>
              <div class="quote-logo">
                <img src="~@/assets/home/forbes_logo_606fb451-fdbc-40b7-86ef-36ba1316c71a_medium.png" alt="Forbes" />
              </div>
            </div>
            <div class="quote-item">
              <div class="quote-text">
                "There's a new magician in the kitchen."
              </div>
              <div class="quote-divider">
                <img src="~@/assets/home/hr-wiggleline.svg" alt="" />
              </div>
              <div class="quote-logo">
                <img src="~@/assets/home/FASTCO-logo_medium.png" alt="Fast Company" />
              </div>
            </div>
            <div class="quote-item">
              <div class="quote-text">
                "Magic Spoon has become my new go-to for one simple reason: it's delicious."
              </div>
              <div class="quote-divider">
                <img src="~@/assets/home/hr-wiggleline.svg" alt="" />
              </div>
              <div class="quote-logo">
                <img src="~@/assets/home/Business-Insider-dark-purple_1_medium.png" alt="Business Insider" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Nutrition Highlights Section -->
      <section class="nutrition-highlights">
        <div class="nutrition-grid">
          <div class="nutrition-left">
            <div class="highlight-item">
              <div class="highlight-title">High Protein</div>
              <div class="highlight-subtitle">12g–14g complete protein in every bowl.</div>
            </div>
            <div class="highlight-item">
              <div class="highlight-title">0–2g Sugar</div>
              <div class="highlight-subtitle">No cane sugar, corn syrup, or sugar alcohol.</div>
            </div>
            <div class="highlight-item">
              <div class="highlight-title">Sweet & Delicious</div>
              <div class="highlight-subtitle">Tastes just like you remember, only better.</div>
            </div>
          </div>
          <div class="nutrition-right">
            <img 
              src="~@/assets/home/MS_VARIETY_STACK_10.21.jpg" 
              alt="Magic Spoon Lifestyle Image" 
              class="lifestyle-image"
            />
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="how-it-works">
        <div class="how-it-works-content">
          <h2 class="how-it-works-title">A whole<br/>world of<br/>flavor.</h2>
          <button class="how-it-works-button" @click="$router.push('/products')">TRY NOW</button>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="testimonials">
        <div class="container">
          <div class="testimonials-grid">
            <div class="testimonial-card">
              <div class="testimonial-quote">
                "I just ate delicious cereal for dinner and the last time I did that was my sophomore year in college!"
              </div>
              <div class="testimonial-author">
                <div class="author-name">KELLY LEVEQUE</div>
                <div class="author-title">Holistic Nutritionist, Wellness Expert, and Celebrity Health Coach</div>
              </div>
              <div class="author-photo">
                <img src="@/assets/products_logo/touxiang (1).jpg" alt="Kelly Leveque" />
              </div>
            </div>
            <div class="testimonial-card">
              <div class="testimonial-quote">
                "When they said 'Breakfast of Champions', they meant Magic Spoon."
              </div>
              <div class="testimonial-author">
                <div class="author-name">PRISCILLA FREDERICK-LOOMIS</div>
                <div class="author-title">Olympian, Entrepreneur, Radio Personality, Podcast Host & Public Speaker</div>
              </div>
              <div class="author-photo">
                <img src="@/assets/products_logo/touxiang (2).jpg" alt="Priscilla Frederick-Loomis" />
              </div>
            </div>
            <div class="testimonial-card">
              <div class="testimonial-quote">
                "Magic Spoon is my adult life and kid life smashed into one fantastic box of cereal."
              </div>
              <div class="testimonial-author">
                <div class="author-name">NATALIE DURAN</div>
                <div class="author-title">Rock Climber, Ninja Warrior, Neuroscientist, Producer</div>
              </div>
              <div class="author-photo">
                <img src="@/assets/products_logo/touxiang (3).jpg" alt="Natalie Duran" />
              </div>
            </div>
          </div>
          <div class="story-section">
            <h2 class="story-title">Why did we grow up, but our cereal didn't?</h2>
            <button class="story-button" @click="$router.push('/about')">OUR STORY</button>
          </div>
        </div>
      </section>

      <!-- Instagram Section -->
      <!-- <section class="instagram-section">
        <div class="container">
          <div class="instagram-grid">
            <div class="instagram-post">
              <div class="post-placeholder">
                <p>Instagram post with the caption: Ooops! Got bored, made a bowl out of my childhood and added a to...</p>
              </div>
            </div>
            <div class="instagram-post">
              <div class="post-placeholder">
                <p>Instagram post: doodling before eating cereal</p>
              </div>
            </div>
            <div class="instagram-post">
              <div class="post-placeholder">
                <p>Instagram post: TREATS high-protein message</p>
              </div>
            </div>
            <div class="instagram-post">
              <div class="post-placeholder">
                <p>Instagram post: protein trivia moment</p>
              </div>
            </div>
          </div>
        </div>
      </section> -->

      <!-- Newsletter Section -->
      <section class="newsletter-section">
        <div class="container">
          <h2 class="newsletter-title">Subscribe to Our Newsletter</h2>
          <p class="newsletter-subtitle">Be the first to know about new products and exclusive offers</p>
          <div class="newsletter-form">
            <input type="email" placeholder="Enter your email address" class="newsletter-input" />
            <button class="newsletter-button">Subscribe</button>
          </div>
        </div>
      </section>

      <!-- Guarantee Section -->
      <!-- <section class="guarantee-section">
        <div class="container">
          <div class="guarantee-content">
            <h2 class="guarantee-title">Happiness 100% Guaranteed!</h2>
            <p class="guarantee-subtitle">SEE TERMS OF USE.</p>
            <button class="guarantee-button">TRY NOW</button>
          </div>
        </div>
      </section> -->
    </div>
  </Layout>
</template>

<script>
import Layout from '@/components/Layout.vue'

export default {
  name: 'Home',
  components: {
    Layout
  },
  data() {
    return {
      favoriteItems: [
        {
          label: "Custom Bundle",
          img: "https://magicspoon.imgix.net/files/custom-case.png?v=1643411934&width=474&auto=format,compress",
          to: "/products"
        },
        {
          label: "Honey Almond Granola",
          img: "https://magicspoon.imgix.net/files/MS_G_PDP_NEW_V2_HA.png?v=1735833313&width=474&auto=format,compress",
          to: "/products?category=granola"
        },
        {
          label: "Mixed Berry Granola",
          img: "https://magicspoon.imgix.net/files/MS_G_PDP_NEW_V2_MB.png?v=1735833944&width=474&auto=format,compress",
          to: "/products?category=granola"
        },
        {
          label: "Peanut Butter Granola",
          img: "https://magicspoon.imgix.net/files/MS_G_PDP_NEW_V2_PB.png?v=1735833688&width=474&auto=format,compress",
          to: "/products?category=granola"
        },
        {
          label: "Fruity Cereal",
          img: "https://magicspoon.imgix.net/products/MS_FRUITY_RENDERING_FRONT.png?v=1682304928&width=474&auto=format,compress",
          to: "/products?category=cereal"
        },
        {
          label: "Cocoa Cereal",
          img: "https://magicspoon.imgix.net/files/MS-Front-Cocoa_2x-132329_79f7505d-cc94-48dc-9c70-014dec408a42-463410.png?v=1735834843&width=474&auto=format,compress",
          to: "/products?category=cereal"
        },
        {
          label: "Frosted Cereal",
          img: "https://magicspoon.imgix.net/files/MS-Front-Frosted_2x-901293_b2cc7d31-7716-47b3-a3ed-33d2cd06b787-667822.png?v=1735835989&width=474&auto=format,compress",
          to: "/products?category=cereal"
        },
        {
          label: "Marshmallow Treats",
          img: "https://magicspoon.imgix.net/files/MS_T_MALLOW_BYO_7921e307-0168-4049-8355-5151b0294d48.png?v=1744119800&width=474&auto=format,compress",
          to: "/products?category=treats"
        },
        {
          label: "Double Chocolate Treats",
          img: "https://magicspoon.imgix.net/files/MS_T_CHOC_BYO_c231b89c-258c-4350-ba78-ea0748c99abc.png?v=1745951737&width=474&auto=format,compress",
          to: "/products?category=treats"
        }
      ],
      featuredProducts: [
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
              "image": "https://m.media-amazon.com/images/I/61FBDKvhUFL._SL1000_.jpg"
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/61FBDKvhUFL._SL1000_.jpg"
          ],
          "star_rating": 4.9,
          "Star_review_count": 2369,
          "category": "candy",
          "stock": 10,
          "is_bestseller": true
        },
        {
          "id": 3,
          "name": "STARBURST Fruit Chews",
          "description": "STARBURST Fruit Chews Candy - FaveREDS Minis, 8oz (Pack of 8) - Delicious STARBURST, Bulk Mini Candy, Bulk Box",
          "price": 0.01,
          "original_price": 23.04,
          "variants": [
            {
              "option1": "8OZ PACK",
              "price": 0.01,
              "image": "https://m.media-amazon.com/images/I/61VN4e-f+bL._SL1000_.jpg"
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/61VN4e-f+bL._SL1000_.jpg"
          ],
          "star_rating": 4.8,
          "Star_review_count": 2687,
          "category": "candy",
          "stock": 15,
          "is_bestseller": true
        },
        {
          "id": 4,
          "name": "SKITTLES & STARBURST Assorted Candy",
          "description": "SKITTLES & STARBURST Assorted Candy Variety Pack for Holidays, Candy Assortment, Party Favors, 62.79 oz (30 Count) Bulk Box",
          "price": 0.01,
          "original_price": 29.88,
          "variants": [
            {
              "option1": "30 COUNT",
              "price": 0.01,
              "image": "https://m.media-amazon.com/images/I/619wM8FXMyL._SL1000_.jpg"
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/619wM8FXMyL._SL1000_.jpg"
          ],
          "star_rating": 4.7,
          "Star_review_count": 2347,
          "category": "candy",
          "stock": 8,
          "is_bestseller": true
        },
        {
          "id": 5,
          "name": "TWIX Bulk Chocolate Candy",
          "description": "TWIX Bulk Chocolate Candy Individually Wrapped, Full Size, Caramel Chocolate Cookie Candy Bar, Perfect for Snacks, Parties, Goodie Bags, Holidays 36-Count Box",
          "price": 0.01,
          "original_price": 43.47,
          "variants": [
            {
              "option1": "36 COUNT",
              "price": 0.01,
              "image": "https://m.media-amazon.com/images/I/61JHs-Rp2IL._SL1000_.jpg"
            }
          ],
          "images": [
            "https://m.media-amazon.com/images/I/61JHs-Rp2IL._SL1000_.jpg"
          ],
          "star_rating": 4.6,
          "Star_review_count": 2169,
          "category": "candy",
          "stock": 12,
          "is_bestseller": true
        }
      ]
    }
  },
  methods: {
    addToCart(product) {
      alert(`Added ${product.name} to cart!`);
    },
    goToProductDetail(product) {
      // 只传递ID，避免在URL中显示完整产品数据
      this.$router.push(
        {
          name: 'ProductDetail',
          params: { id: product.id }
        },
        { product: product } // 使用state传递完整数据
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  font-family: 'Montserrat', sans-serif;
}

// Hero Section Styles
.hero-section {

 
  // background-image: url('https://magicspoon.imgix.net/files/MagicSpoon-T-H1_NewFlavors_HomepageCropsHomepageDesign_1.jpg?v=1751489105&auto=format,compress&w=2800');
  background-image: url('~@/assets/home/magicspoon.jpg');

  background-size: cover;
  background-position: center;
  height: 80vh;
  display: flex;
  align-items: center;
  position: relative;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.hero-text-container {
  max-width: 400px;
  text-align: left;
}

.hero-title {
  font-size: 60px;
  font-weight: 900;
  color: #462b8e;
  margin-bottom: 32px;
  letter-spacing: -2px;
  line-height: 1.1;
  text-align: left;
}

.hero-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cta-button {
  padding: 24px 32px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: none;
  width: 100%;
  
  &.primary {
    background: #5222e3;
    color: white;
    box-shadow: 0 10px 25px rgba(82, 34, 227, 0.3);
    
    &:hover {
      background: #462b8e;
      transform: translateY(-2px);
      box-shadow: 0 14px 40px rgba(82, 34, 227, 0.4);
    }
  }
  
  &.secondary {
    background: transparent;
    color: #5222e3;
    border: 2px solid #5222e3;
    
    &:hover {
      background: #5222e3;
      color: white;
      transform: translateY(-2px);
    }
  }
}

// Find Your Favorite Section
.find-favorite {
  background: #DAD9FF;
  padding: 48px 40px 64px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 32px;
  font-weight: 800;
  color: #5222e3;
  text-align: center;
  margin-bottom: 40px;
}

.products-horizontal {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 24px;
}

.favorite-item {
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
}

.favorite-image {
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  
  img {
    height: 100%;
    object-fit: contain;
  }
}

.favorite-label {
  font-size: 14px;
  font-weight: 600;
  color: #462b8e;
  line-height: 1.3;
  margin: 0;
}

// Subscription Section
.subscription-section {
  background: linear-gradient(180deg, #CDEAFF 0%, #DAD9FF 100%);
  padding: 80px 40px;
  position: relative;
  overflow: hidden;
}

.subscription-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(120% 80% at 20% 0%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%);
  pointer-events: none;
}

.subscription-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.subscription-text {
  order: 1;
}

.subscription-title {
  font-size: 40px;
  font-weight: 800;
  color: #5222e3;
  margin-bottom: 16px;
  line-height: 1.2;
}

.subscription-subtitle {
  font-size: 18px;
  font-weight: 600;
  color: #5222e3;
  margin-bottom: 24px;
}

.subscription-benefits {
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  color: #4A3FB0;
}

.benefit-icon {
  font-size: 20px;
  margin-top: 2px;
}

.subscription-button {
  background: #5222e3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #3e1abd;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(82, 34, 227, 0.3);
  }
}

.subscription-image {
  order: 2;
  
  .image-wrapper {
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border: 4px solid rgba(255, 255, 255, 0.6);
  }
  
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
}

// Featured Products Section
.featured-products {
  background: linear-gradient(180deg, #CDEAFF 0%, #DAD9FF 100%);
  padding: 80px 40px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.product-card {
  background: white;
  border-radius: 0;
  overflow: visible;
  box-shadow: 0 10px 30px rgba(82, 34, 227, 0.12);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  height: 540px;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(82, 34, 227, 0.18);
  }
}

.product-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  align-items: center;
  justify-content: space-between;
}

.product-badge {
  position: absolute;
  top: -16px;
  left: 16px;
  z-index: 10;
  
  img {
    width: 48px;
    height: 48px;
  }
}

.product-image {
  width: 100%;
  height: 144px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  
  img {
    height: 100%;
    object-fit: contain;
  }
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}

.product-pricing {
  margin-bottom: 12px;
}

.current-price {
  font-size: 24px;
  font-weight: 800;
  color: #4A1FB8;
}

.original-price {
  font-size: 20px;
  color: #9ca3af;
  text-decoration: line-through;
  margin-left: 8px;
}

.product-name {
  font-size: 24px;
  font-weight: 800;
  color: #4A1FB8;
  margin-bottom: 16px;
  line-height: 1.2;
  text-transform: uppercase;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
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
  font-size: 12px;
  font-weight: 600;
  color: #4A1FB8;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.shop-button {
  width: 100%;
  background: #5F2FE8;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background: #4C23C9;
    transform: translateY(-2px);
  }
}

.arrow {
  font-size: 16px;
}

.shop-all-button {
  text-align: center;
}

// Category Showcase Section
.category-showcase {
  background: linear-gradient(180deg, #CDEAFF 0%, #DAD9FF 60%, #F7B4D8 100%);
  padding: 80px 40px;
  position: relative;
  overflow: hidden;
}

.showcase-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.showcase-text {
  padding-right: 40px;
}

.showcase-title {
  font-size: 40px;
  font-weight: 800;
  color: #4A1FB8;
  margin-bottom: 20px;
  line-height: 1.2;
}

.showcase-description {
  font-size: 18px;
  color: #4A3FB0;
  line-height: 1.6;
  
  strong {
    color: #4A1FB8;
    font-weight: 800;
  }
}

.showcase-image {
  img {
    width: 100%;
    height: auto;
    border-radius: 12px;
  }
}

// Media Quotes Section
.media-quotes {
  background: #CDEAFF;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
}

.quotes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto;
}

.quote-item {
  text-align: center;
  max-width: 320px;
  margin: 0 auto;
}

.quote-text {
  font-size: 20px;
  font-weight: 600;
  color: #4A1FB8;
  line-height: 1.4;
  margin-bottom: 20px;
  font-style: italic;
  display: block;
}

.quote-divider {
  margin: 20px 0;
  
  img {
    width: 36px;
    height: auto;
    margin: 0 auto;
  }
}

.quote-logo {
  img {
    height: 24px;
    width: auto;
    margin: 0 auto;
    object-fit: contain;
  }
}

// Nutrition Highlights Section
.nutrition-highlights {
  position: relative;
  padding: 0;
}

.nutrition-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 560px;
}

.nutrition-left {
  background: #5222e3;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  gap: 56px;
}

.highlight-item {
  text-align: center;
  max-width: 320px;
}

.highlight-title {
  font-size: 32px;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: -1px;
  line-height: 1.2;
}

.highlight-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
}

.nutrition-right {
  position: relative;
  min-height: 420px;
}

.lifestyle-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// How It Works Section
.how-it-works {
  position: relative;
  height: 50vh;
  min-height: 620px;
  overflow: hidden;
  background: linear-gradient(135deg, #6B2FE8 0%, #C03DF2 35%, #FF78C9 70%, #FFD36E 100%);
}

.how-it-works::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(60% 40% at 70% 20%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 60%);
  z-index: 1;
}

.how-it-works-content {
  position: relative;
  z-index: 20;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 40px;
}

.how-it-works-title {
  font-size: 80px;
  font-weight: 900;
  color: white;
  line-height: 1.05;
  margin-bottom: 40px;
  text-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
}

.how-it-works-button {
  background: #5F2FE8;
  margin-left: 1%;
  color: white;
  border: none;
  padding: 16px 40px;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 14px 40px rgba(40, 0, 120, 0.35);
  
  &:hover {
    background: #4C23C9;
    transform: translateY(-2px);
    box-shadow: 0 16px 50px rgba(40, 0, 120, 0.4);
  }
}

// Testimonials Section
.testimonials {
  background: #5F2FE8;
  padding: 80px 40px;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 60px;
}

.testimonial-card {
  background: white;
  padding: 40px 32px 64px;
  border-radius: 0;
  border: 6px solid #5F2FE8;
  text-align: center;
  position: relative;
  box-shadow: 0 12px 30px rgba(82, 34, 227, 0.18);
}

.testimonial-quote {
  font-size: 24px;
  font-weight: 600;
  color: #4A1FB8;
  line-height: 1.4;
  margin-bottom: 24px;
  font-style: italic;
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.testimonial-author {
  margin-bottom: 0;
}

.author-name {
  font-size: 18px;
  font-weight: 800;
  color: transparent;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  -webkit-text-stroke: 2px #4A1FB8;
  -webkit-text-fill-color: transparent;
}

.author-title {
  font-size: 14px;
  color: #4A3FB0;
  line-height: 1.4;
}

.author-photo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -40px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid white;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.story-section {
  text-align: center;
}

.story-title {
  font-size: 40px;
  font-weight: 800;
  color: white;
  margin-bottom: 30px;
}

.story-button {
  background: transparent;
  color: white;
  border: 2px solid white;
  padding: 16px 32px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: white;
    color: #8b5cf6;
  }
}

// Instagram Section
.instagram-section {
  background: white;
  padding: 60px 40px;
}

.instagram-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.instagram-post {
  background: #f3f4f6;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.post-placeholder {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.4;
}

// Newsletter Section
.newsletter-section {
  background: linear-gradient(90deg, #8b5cf6 0%, #ec4899 50%, #ef4444 100%);
  padding: 80px 40px;
  text-align: center;
}

.newsletter-title {
  font-size: 40px;
  font-weight: 800;
  color: white;
  margin-bottom: 20px;
}

.newsletter-subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
}

.newsletter-form {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  gap: 20px;
}

.newsletter-input {
  flex: 1;
  padding: 16px 24px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  outline: none;
  
  &::placeholder {
    color: #9ca3af;
  }
}

.newsletter-button {
  background: white;
  color: #8b5cf6;
  border: none;
  padding: 16px 32px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f3f4f6;
    transform: translateY(-2px);
  }
}

// Guarantee Section
.guarantee-section {
  background: #5222e3;
  padding: 60px 40px;
  text-align: center;
}

.guarantee-content {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.guarantee-title {
  font-size: 40px;
  font-weight: 800;
  color: white;
  margin-bottom: 10px;
}

.guarantee-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
}

.guarantee-button {
  background: #3e1abd;
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #2d1a8a;
    transform: translateY(-2px);
  }
}

// Responsive Design
@media (max-width: 768px) {
  .hero-section {
    height: 60vh;
    padding: 0 20px;
  }
  
  .hero-content {
    padding: 0;
  }
  
  .hero-title {
    font-size: 40px;
  }
  
  .cta-button {
    padding: 16px 24px;
    font-size: 16px;
  }
  
  .find-favorite {
    padding: 40px 20px;
  }
  
  .products-horizontal {
    display: flex;
    gap: 24px;
    overflow-x: auto;
    padding: 0 8px;
  }
  
  .favorite-item {
    flex-shrink: 0;
    width: 128px;
  }
  
  .subscription-section {
    padding: 60px 20px;
  }
  
  .subscription-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .subscription-text {
    order: 2;
  }
  
  .subscription-image {
    order: 1;
  }
  
  .subscription-title {
    font-size: 32px;
  }
  
  .featured-products {
    padding: 60px 20px;
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .product-card {
    height: auto;
  }
  
  .product-image {
    height: 140px;
  }
  
  .product-info {
    padding: 20px;
  }
  
  .product-name {
    font-size: 20px;
  }
  
  .quotes-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .quote-text {
    font-size: 18px;
  }
  
  .nutrition-grid {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  
  .nutrition-left {
    padding: 60px 20px;
    gap: 40px;
  }
  
  .nutrition-right {
    min-height: 300px;
  }
  
  .testimonials-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .how-it-works {
    height: 60vh;
    min-height: 400px;
  }
  
  .how-it-works-title {
    font-size: 48px;
  }
  
  .instagram-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .newsletter-form {
    flex-direction: column;
    gap: 15px;
  }
  
  .guarantee-content {
    flex-direction: column;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 32px;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .subscription-title {
    font-size: 28px;
  }
  
  .media-quotes {
    padding: 40px 20px;
  }
  
  .quotes-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .quote-text {
    font-size: 16px;
  }
  
  .nutrition-left {
    padding: 40px 20px;
    gap: 30px;
  }
  
  .highlight-title {
    font-size: 24px;
  }
  
  .highlight-subtitle {
    font-size: 16px;
  }
  
  .nutrition-right {
    min-height: 250px;
  }
  
  .instagram-grid {
    grid-template-columns: 1fr;
  }
  
  .how-it-works-title {
    font-size: 40px;
  }
  
  .newsletter-title {
    font-size: 32px;
  }
  
  .guarantee-title {
    font-size: 32px;
  }
}
</style>