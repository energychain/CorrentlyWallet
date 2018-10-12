$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return decodeURI(results[1]) || 0;
    }
}

const  cw = CorrentlyWallet.default;
const backend = "https://api.corrently.de/"
let wallet = null;

const getAccountInfo=function(address) {
  $('#a').val(address);
  $.getJSON(backend+"totalSupply?account="+address,function(data) {
      
      $('.totalCollected').html(data.result.totalSupply);
      $('.converted').html(data.result.convertedSupply);
      $('.generation').html(data.result.generation);
      $('.consumption').html(data.result.meteredconsumption);
      $('.nominalCori').html(data.result.nominalCori);
      $('.imbalance').html(data.result.generation-data.result.meteredconsumption);
      $('.available').html(data.result.totalSupply-data.result.convertedSupply);
      $('.validFrom').html(new Date(data.result.created).toLocaleString());
      $('.updated').html(new Date(data.result.lastUpdate).toLocaleString());
      console.log(data.result);
  });
}


if(window.localStorage.getItem("privateKey")==null) {
  wallet = cw.Wallet.createRandom();
  window.localStorage.setItem("privateKey",wallet.privateKey);
} else {
  wallet = new cw.Wallet(window.localStorage.getItem("privateKey"));
}
if($.urlParam("a")==null) {
  $('.address').html(wallet.address);
  getAccountInfo(wallet.address);
} else {
  $('.address').html($.urlParam("a"));
  getAccountInfo($.urlParam("a"));
}
