import CardInfo from "./create-nft-info.js";
import CriptoPrice from "./cripto-price.js";

const cardInfo = new CardInfo("../data-nft.json");
const dados = await cardInfo.init();

const ethPrice = new CriptoPrice(
  "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT",
  dados.salesPriceNFT,
  "#nft-price"
);
ethPrice.init();
