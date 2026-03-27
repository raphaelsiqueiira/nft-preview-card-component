export default class CriptoPrice {
  constructor(APIUrl, salePrice, elementSelector) {
    this.APIUrl = APIUrl;
    if (!isNaN(salePrice)) {
      this.salePrice = salePrice;
    } else {
      console.warn("Selling price not disclosed");
    }

    this.cryptoPriceElement = document.querySelector(elementSelector);

    if (elementSelector && !this.cryptoPriceElement) {
      console.warn(`Element "${elementSelector}" not found.`);
    }

    this.body = document.querySelector("body");
  }

  // Fetches the raw price from the API
  async fetchPrice() {
    try {
      const response = await fetch(this.APIUrl);
      const data = await response.json();
      return parseFloat(data.price);
    } catch (error) {
      console.error("Error fetching price:", error);
      return null;
    }
  }

  //Processes the price and updates the DOM element
  async updateDOM() {
    const rawPrice = await this.fetchPrice();

    if (rawPrice && this.cryptoPriceElement) {
      const calculatedValue = this.salePrice / rawPrice;
      this.cryptoPriceElement.innerText = calculatedValue.toFixed(3);
      delete this.body.dataset.skeleton;
    }

    return rawPrice;
  }

  // Starts an automated update loop
  startUpdateLoop(interval = 100000) {
    // Initial call to avoid waiting for the first interval
    this.updateDOM();

    setInterval(() => {
      this.updateDOM();
    }, interval);
  }

  // Initializes the class logic

  async init() {
    if (this.cryptoPriceElement) {
      // If an element exists, start the auto-update loop
      this.startUpdateLoop();
      return this;
    } else {
      // If no element is provided, just return the current price once
      return await this.fetchPrice();
    }
  }
}
