'''
<button
  onClick={handleQuickWhatsApp}
  className="action-button whatsapp-button"
>
  <MessageCircle size={20} />
  <span>Заказ в WhatsApp</span>
</button>
'''
.whatsapp-button {
  background-color: #059669;
  color: white;
}

.whatsapp-button:hover {
  background-color: #047857;
}

'''
<button
  onClick={handleAddToCart}
  className={styles.cartButton}
>
  <ShoppingCart size={16} />
  <span>В корзину</span>
</button>

'''
<button
  onClick={handleShare}
  className={styles.shareButton}
  aria-label="Поделиться"
>
  <Share2 size={20} />
</button>

'''
<Link href="/" className={styles.navLink}>
  Каталог
</Link>