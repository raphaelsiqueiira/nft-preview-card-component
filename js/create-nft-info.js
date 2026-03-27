export default class CardInfo {
  constructor(APIUrl) {
    this.APIUrl = APIUrl;
    this.precoMinimo = 50;
    this.precoMaximo = 200000;

    // Pega os campos do HTML que serão inseridas as informações
    this.nftTitleElement = document.querySelector("#card-title");
    this.nftDescriptionElement = document.querySelector("#card-description");
    this.imgNftElement = document.querySelector("#card-img");
    this.authorElement = document.querySelector("#author");
    this.avatarElement = document.querySelector("#avatar-img");
    this.createDateElement = document.querySelector("#create-time");
  }

  // Pega os dados da API
  async fetchAPi() {
    try {
      const response = await fetch(this.APIUrl);
      // Se o arquivo não existir ou o servidor falhar
      if (!response.ok) return {};
      const text = await response.text();

      // Se o arquivo existir mas estiver totalmente vazio,
      // retornamos um objeto vazio em vez de tentar transformar em JSON
      return text ? JSON.parse(text) : {};
    } catch (error) {
      // Se der qualquer outro erro (como erro de rede), retorna vazio
      console.warn("Usando dados padrão devido a um erro:", error);
      return {};
    }
  }

  // Valida se os dados foram passados, caso não adiciona valores padrões
  async validarDados(data) {
    const maxCharNum = 8;
    const maxCharName = 15;
    const maxCharDescription = 180;
    const maxCharAuthor = 20;
    const {
      number,
      name,
      description,
      img,
      author,
      avatar,
      salePrice,
      create_at,
    } = data;

    if (number !== undefined) {
      this.numberNFT = number;
      if (this.numberNFT.length > maxCharNum) {
        this.numberNFT = this.numberNFT.slice(0, maxCharNum);
      }
    } else {
      this.numberNFT = "0";
    }

    if (name !== undefined) {
      this.nameNFT = name;
      if (this.nameNFT.length > maxCharName) {
        this.nameNFT = this.nameNFT.slice(0, maxCharName);
      }
    } else {
      this.nameNFT = "Sem nome";
    }

    if (description !== undefined) {
      this.descriptionNFT = description;
      if (this.descriptionNFT.length > maxCharDescription) {
        this.descriptionNFT = this.descriptionNFT.slice(0, maxCharDescription);
      }
    } else {
      this.descriptionNFT = "Apenas uma NFT sem descrição";
    }

    this.imgNFT = img ?? "./images/image-solid.png";

    if (author !== undefined) {
      this.authorNFT = author;
      if (this.authorNFT.length > maxCharAuthor) {
        this.authorNFT = this.authorNFT.slice(0, maxCharAuthor);
      }
    } else {
      this.authorNFT = "Anonimous";
    }

    this.avatarNFT = avatar ?? "./images/circle-user-solid.png";

    // Lógico de preço
    if (!salePrice) {
      this.salesPriceNFT = this.precoMinimo;
    } else if (salePrice < this.precoMinimo) {
      this.salesPriceNFT = this.precoMinimo;
    } else if (salePrice > this.precoMaximo) {
      this.salesPriceNFT = this.precoMaximo;
    } else {
      this.salesPriceNFT = salePrice;
    }

    // Lógica de data
    const agora = new Date();
    const dataCriacao = create_at ? new Date(create_at) : agora;

    if (dataCriacao > agora) {
      this.create_at_NFT = agora;
    } else {
      this.create_at_NFT = dataCriacao;
    }
  }

  calcularData(nftCreat) {
    const criacao = nftCreat.getTime(nftCreat);
    const diasPassados = Math.floor(criacao / (24 * 60 * 60 * 1000));
    const dataAgora = new Date();
    const dataAtual = Math.floor(dataAgora.getTime() / (24 * 60 * 60 * 1000));
    const tempoPassado = dataAtual - diasPassados;

    if (tempoPassado < 1) {
      return "Hoje";
    } else if (tempoPassado >= 1 && tempoPassado <= 31) {
      return `${tempoPassado} days left`;
    } else {
      const dia = nftCreat.getDate();
      const mes = nftCreat.getMonth();
      const ano = nftCreat.getFullYear();
      return `${dia}/${mes + 1}/${ano}`;
    }
  }

  renderElementsInDom() {
    this.nftTitleElement.innerText = `${this.nameNFT} #${this.numberNFT}`;
    this.nftDescriptionElement.innerText = this.descriptionNFT;
    this.imgNftElement.src = this.imgNFT;
    this.authorElement.innerText = this.authorNFT;
    this.avatarElement.src = this.avatarNFT;
    this.createDateElement.innerText = this.calcularData(this.create_at_NFT);
  }

  async init() {
    try {
      const data = await this.fetchAPi();
      this.validarDados(data);
      this.renderElementsInDom();
      return this;
    } catch (error) {
      console.log("Erro na inicialização: ", error);
    }
  }
}
