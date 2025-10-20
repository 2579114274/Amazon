<template>
  <div class="footer-container">
    <!-- Happiness Guaranteed Banner -->
    <section class="happiness-banner">
      <div class="happiness-content">
        <div class="happiness-text">
          <h2 class="happiness-title">
            <span class="happiness-white">Happiness</span>
            <span class="happiness-outline">100% Guaranteed!</span>
          </h2>
          <p class="happiness-subtitle">SEE TERMS OF USE.</p>
        </div>
        <button class="try-now-button" @click="$router.push('/products')">TRY NOW</button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-left">
          <div class="footer-logo">
            <div class="logo-text">MAGIC SPOON</div>
          </div>
          <div class="footer-links">
            <a href="#" class="footer-link">Terms of Use</a>
            <a href="#" class="footer-link">Privacy Policy</a>
            <a href="#" class="footer-link">Accessibility Policy</a>
            <a href="#" class="footer-link">FAQ</a>
            <a href="#" class="footer-link">Reviews</a>
            <a href="#" class="footer-link">Jobs</a>
            <a href="#" class="footer-link">Track Orders</a>
            <a href="#" class="footer-link">Store Locator</a>
            <a href="#" class="footer-link">Terms of Service</a>
            <a href="#" class="footer-link">Refund policy</a>
          </div>
          <div class="footer-actions">
            <button class="contact-button">CONTACT US</button>
            <div class="social-icons">
              <!-- Instagram -->
              <a href="#" class="social-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" stroke-width="2"/>
                  <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" stroke-width="2"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" stroke-width="2"/>
                </svg>
              </a>
              
              <!-- Facebook -->
              <a href="#" class="social-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              </a>
              
              <!-- Twitter/X -->
              <a href="#" class="social-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              </a>
              
              <!-- TikTok -->
              <a href="#" class="social-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              </a>
            </div>
          </div>
          <p class="copyright">© 2025 Magic Spoon</p>
        </div>
        <div class="footer-right">
          <p class="newsletter-title">Don't miss the magic:</p>
          <form class="newsletter-form">
            <input type="email" placeholder="Your email" class="email-input" />
            <button type="submit" class="subscribe-button">SUBSCRIBE</button>
          </form>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style lang="scss" scoped>
.footer-container {
  font-family: 'Montserrat', sans-serif;
}

// Happiness Guaranteed Banner Styles
.happiness-banner {
  background: linear-gradient(90deg, #6B2FE8 0%, #7D2FE8 50%, #8E2BE2 100%);
  padding: 40px 20px;
}

.happiness-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  text-align: left;
}

.happiness-text {
  flex: 1;
}

.happiness-title {
  font-size: 48px;
  font-weight: 900;
  line-height: 1.1;
  margin: 0;
}

.happiness-white {
  color: white;
}

.happiness-outline {
  color: transparent;
  -webkit-text-stroke: 2px white;
  -webkit-text-fill-color: transparent;
}

.happiness-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 8px 0 0 0;
}

.try-now-button {
  background: #3B1DC9;
  color: white;
  border: none;
  padding: 20px 30px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
  flex-shrink: 0;
  
  &:hover {
    background: #2F16A6;
    transform: translateY(-2px);
  }
}

// Footer Styles
.footer {
  background: black;
  color: white;
  padding: 48px 20px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-logo {
  margin-bottom: 16px;
}

.logo-text {
  font-size: 32px;
  font-weight: 800;
  color: white;
  letter-spacing: -1px;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.footer-link {
  color: #d1d5db;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
  
  &:hover {
    color: white;
  }
}

.footer-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.contact-button {
  background: transparent;
  color: white;
  border: 2px solid white;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.social-icons {
  display: flex;
  gap: 16px;
}

.social-icon {
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  
  svg {
    width: 24px;
    height: 24px;
    transition: all 0.3s ease;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    
    svg {
      transform: scale(1.1);
    }
  }
}

.copyright {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

.footer-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-left: 48px;
}

.newsletter-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.email-input {
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  font-size: 14px;
  outline: none;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  &:focus {
    border-color: rgba(255, 255, 255, 0.8);
  }
}

.subscribe-button {
  background: transparent;
  color: white;
  border: 2px solid white;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

// Responsive Design
@media (max-width: 768px) {
  .happiness-banner {
    padding: 30px 20px;
  }
  
  .happiness-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .happiness-text {
    flex: none;
  }
  
  .happiness-title {
    font-size: 32px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .footer-right {
    padding-left: 0;
  }
  
  .footer-links {
    gap: 8px;
  }
  
  .footer-link {
    font-size: 13px;
  }
  
  .footer-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .newsletter-form {
    flex-direction: row;
  }
  
  .email-input {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .happiness-title {
    font-size: 28px;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 6px;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
}
</style>
