const  cw = CorrentlyWallet.default;
const backend = "https://api.corrently.de/"
let wallet = null;

const getAccountInfo=function(address) {
  $.getJSON(backend+"totalSupply?account="+address,function(data) {
      $('.totalCollected').html(data.result.totalSupply);
      $('.converted').html(data.result.convertedSupply);
      $('.available').html(data.result.totalSupply-data.result.convertedSupply);
      console.log(data);
  });
}


if(window.localStorage.getItem("privateKey")==null) {
  wallet = cw.Wallet.createRandom();
  window.localStorage.setItem("privateKey",wallet.privateKey);
} else {
  wallet = new cw.Wallet(window.localStorage.getItem("privateKey"));
}

$('.address').html(wallet.address);

getAccountInfo(wallet.address);
