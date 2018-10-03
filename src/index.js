const ethers = require('ethers');
const request = require('request');

ethers.CORRENTLY = {
  ERC20ABI: require('./ERC20ABI.json'),
  CORI_ADDRESS: '0x725b190bc077ffde17cf549aa8ba25e298550b18',
  //  API: 'https://api.corrently.de/latest/',
  API: 'https://2le29wvge7.execute-api.eu-central-1.amazonaws.com/latest/',
};

ethers.CorrentlyAccount = function(address) {
  return new Promise(function(resolve, reject) {
    ethers.utils._retrieveCoriAccount(address).then(function(twin) {
      resolve(twin);
    });
  });
};

ethers.Wallet.prototype.getCoriEquity = function(blockTag) {
  const cori_contract = new ethers.Contract(ethers.CORRENTLY.CORI_ADDRESS, ethers.CORRENTLY.ERC20ABI, this.provider);
  return cori_contract.balanceOf(this.address);
};

ethers.Wallet.prototype.getCorrentlyTransactions = function() {
  let parent = this;
  return new Promise(function(resolve, reject) {
    if (typeof parent.twin === 'undefined') {
      this.retrieveAccount().then(function(twin) {
        resolve(twin.txs);
      });
    } else {
      resolve(parent.twin.txs);
    }
  });
};

ethers.Wallet.prototype.getConvertedCorrently = function() {
  let parent = this;
  return new Promise(function(resolve, reject) {
    if (typeof parent.twin === 'undefined') {
      this.retrieveAccount().then(function(twin) {
        resolve(twin.convertedSupply);
      });
    } else {
      resolve(parent.twin.convertedSupply);
    }
  });
};

ethers.Wallet.prototype.getEarnedCorrently = function() {
  let parent = this;
  return new Promise(function(resolve, reject) {
    if (typeof parent.twin === 'undefined') {
      this.retrieveAccount().then(function(twin) {
        resolve(twin.totalSupply);
      });
    } else {
      resolve(parent.twin.totalSupply);
    }
  });
};

ethers.Wallet.prototype._retrieveCoriAccount = function() {
  let parent = this;
  return new Promise(function(resolve, reject) {
    if (typeof parent.account === 'undefined') {
      ethers.CorrentlyAccount(parent.address).then(function(twin) {
        parent.twin = twin;
        resolve(twin);
      });
    } else {
      resolve(parent.twin);
    }
  });
};

ethers.utils._retrieveCoriAccount = function(address) {
  return new Promise(function(resolve, reject) {
    request(ethers.CORRENTLY.API + 'totalSupply?account=' + address, function(e, r, b) {
      resolve(JSON.parse(b).result);
    });
  });
};

export default ethers;
