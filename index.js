/**
 * Product blueprint - aimed to support future instances when
 * passing order data in future orders
 */
class Product {
  /**
   * For now, product only takes in the relative properties explicitly set out
   * in the UI. This will, however, make it easy for future interpretations
   * of the product object where a user can come in and define any extra
   * properties the object could take (i.e. quality, release date etc.)
   *
   * This also provides a foundation for creating subclasses from this product
   * if necessary
   *
   * @param {Integer} id
   * @param {String} title
   * @param {String} image
   * @param {Float} rrp
   * @param {Float} salePrice
   * @param {Integer} quantity
   * @constructor
   */
  constructor(id, title, image, rrp, salePrice, quantity) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.rrp = rrp;
    this.salePrice = salePrice;
    this.quantity = quantity;
  }
}

/**
 * Proxy products data object to simulate data transferral/ingesting
 * data from an API
 */
const productsData = {
  products: [
    {
      id: 1,
      title: "17ft x 12ft Jumpking Deluxe Rectangular Trampoline with Enclosure",
      image: "assets/prod-TN-1.jpg",
      rrp: 1069,
      salePrice: 949,
      quantity: 1,
    },
    {
      id: 2,
      title: "14ft Salta Black Round Comfort Edition Trampoline with Enclosure",
      image: "assets/prod-TN-2.jpg",
      rrp: 369,
      salePrice: null,
      quantity: 1,
    },
  ],
};

/**
 * Converts an integer|float to a currency
 *
 * In future versions, this could take country code and currency
 * as params to convert based on store locale
 *
 * @param {Float|Integer} value to be converted to currency
 * @returns {Float} formatted number
 */
const currencyFormatter = (value) => {
  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });

  return formatter.format(value);
};

/**
 * Toggles modals. Though currently only used for the newsletter modal,
 * this coudl easily be reused for other modals.
 *
 * @param {Boolean} isOpen
 * @param {Object} modalObj
 * @returns hidden class on element
 */
const toggleModal = (isOpen, modalObj) => {
  return isOpen ? modalObj.classList.remove("hidden") : modalObj.classList.add("hidden");
};

/**
 * Formats the ID of selected elements. Allows for multiple instances of an
 * element
 *
 * @param {Integer} originalId of the element in question
 * @param {Integer} productId - refers to the current product instace's ID
 */
const formatId = (originalId, productId) => {
  return (document.getElementById(originalId).id = originalId + "_" + productId);
};

document.addEventListener("DOMContentLoaded", () => {

  /**
   * Config for creating element groups based on products within the
   * products array
   */
  const data = productsData.products;
  let productContainer = document.getElementById("productContainer");
  let childClone = productContainer.children[0].cloneNode(true);
  const productProperties = ["productTitle", "productImage", "productRrp", "productSalePrice", "productQty"];

  /**
   * Only create elements when there are products
   */
  if (data.length >= 1) {
    for (let i = 0; i < data.length; i++) {
      // Instantiate new Product instance
      let newProduct = new Product(
        data[i].id, 
        data[i].title, 
        data[i].image, 
        data[i].rrp, 
        data[i].salePrice, 
        data[i].quantity
      );

      productContainer.appendChild(childClone);
      childClone.classList.remove("hidden");

      for (let i = 0; i < productProperties.length; i++) {
        formatId(productProperties[i].toString(), newProduct.id);
      }

      // Set Image
      document.getElementById(`productImage_${newProduct.id}`).src = newProduct.image;

      // Set Title
      document.getElementById(`productTitle_${newProduct.id}`).innerHTML = newProduct.title;

      /**
       * Set RRP
       * Creates <strong> where instance's salePrice has no value, 
       * or <em> where instance's salePrice has value
       */
      if (newProduct.salePrice == null) {
        let strong = document.createElement("strong");
        strong.innerHTML = currencyFormatter(newProduct.rrp);
        strong.classList.add("tracking-wide", "text-base", "xl:text-lg", "2xl:text-xl");
        document.getElementById(`productRrp_${newProduct.id}`).appendChild(strong);
      } else {
        let italic = document.createElement("em");
        italic.innerHTML = currencyFormatter(newProduct.rrp);
        italic.classList.add("text-xs", "xl:text-xs", "2xl:text-sm");
        document.getElementById(`productRrp_${newProduct.id}`).appendChild(italic);
        document.getElementById(`productRrp_${newProduct.id}`).classList.add("line-through", "tracking-tight");
      }

      /**
       * Set Sale Price
       * Removes element if instance's salePrice is null. Else returns & formats currency
       */
      if (newProduct.salePrice == null) {
        document.getElementById(`productSalePrice_${newProduct.id}`).remove();
      } else {
        document.getElementById(`productSalePrice_${newProduct.id}`).innerHTML = currencyFormatter(newProduct.salePrice);
      }

      // Set Quantity
      document.getElementById(`productQty_${newProduct.id}`).innerHTML = newProduct.quantity;
    }
  }

  /**
   * Config for newsletter modal
   */
  let isNewsletterOpen = false;
  const newsletterModal = document.getElementById("newsletterModal");
  const togglingElements = [document.getElementById("newsletterCloseModal"), document.getElementById("newsletterToggle")];

  /**
   * Toggle newsletter modal when any of the toggling elemetns are clicked
   */
  togglingElements.forEach((el) => {
    el.onclick = () => {
      isNewsletterOpen = !isNewsletterOpen;
      toggleModal(isNewsletterOpen, newsletterModal);
    };
  });
});
