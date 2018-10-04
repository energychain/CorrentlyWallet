/**
 * @module CorrentlyWallet
 * @desc Ethereum Blockchain Wallet implementing Green Energy semantics for Corrently based decentralized capacity market
 */

/**
 *
 */
const ethers = require('ethers');
const request = require('request');

/**
 * @const CORRENTLY
 * @desc Core Constants for semantics used in decentralized capacity market
 */
ethers.CORRENTLY = {
  ERC20ABI: require('./ERC20ABI.json'),
  CORI_ADDRESS: '0x725b190bc077ffde17cf549aa8ba25e298550b18',
  //  API: 'https://api.corrently.de/latest/',
  API: 'https://2le29wvge7.execute-api.eu-central-1.amazonaws.com/latest/',
};

/**
 * @function CorrentlyAccount
  *@desc Digital twin of consensus driven account identified by address
 * @param {string} EthereumAddress Address of a twinable account
 * @return {Object} Digital twin identified by address
 */
ethers.CorrentlyAccount = function(address) {
  return new Promise(function(resolve, reject) {
    ethers.utils._retrieveCoriAccount(address).then(function(twin) {
      twin.getCoriEquity = function() {
        const cori_contract = new ethers.Contract(ethers.CORRENTLY.CORI_ADDRESS, ethers.CORRENTLY.ERC20ABI, ethers.getDefaultProvider('homestead'));
        return cori_contract.balanceOf(address);
      };
      resolve(twin);
    });
  });
};

/**
 * @function deleteData
  *@desc GDPR compliance to delete personal and private data from OTC transactions
 * @param {string} EthereumAddress Address of wallet
 */
ethers.Wallet.prototype.deleteData = function(address) {
  let parent = this;
  return new Promise(function(resolve, reject) {
    let transaction = {};
    transaction.timeStamp = new Date().getTime();

    parent.signMessage(JSON.stringify(transaction)).then(function(signature) {
      const options = {
        url: ethers.CORRENTLY.API + 'deleteTwin?&signature=' + signature + '&transaction=' + encodeURI(JSON.stringify(transaction)),
        timeout: 20000,
      };
      request(options, function(e, r, b) {
        let results = JSON.parse(b);
        resolve(results);
      });
    });
  });
};

/**
 * @function buyCapacity
  *@desc OTC buy capacity from market
 * @param {string} EthereumAddress Address Contract to buy from
 * @param {number} Quantity Amount of capacity to buy
 */
ethers.Wallet.prototype.buyCapacity = function(asset, quantity) {
  let parent = this;
  return new Promise(function(resolve, reject) {
    parent._retrieveCoriAccount().then(function(account) {
      ethers.Market().then(function(market) {
        let transaction = {};
        transaction.cori = quantity;
        for (let i = 0; i < market.length; i++) {
          if (market[i].asset === asset.asset) {
            transaction.corrently = market[i].cori * quantity;
          }
        }
        transaction.timeStamp = new Date().getTime();
        transaction.asset = asset.contract;
        transaction.eth = 0;
        transaction.nonce = account.txs.length;
        parent.signMessage(JSON.stringify(transaction)).then(function(signature) {
          delete parent.twin;
          const options = {
            url: ethers.CORRENTLY.API + 'signedTransaction?transaction=' + encodeURI(JSON.stringify(transaction)) + '&signature=' + signature,
            timeout: 20000,
          };
          request(options, function(e, r, b) {
            let results = JSON.parse(b);
            resolve(results.result);
          });
        });
      });
    });
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

/**
 * @function Market
  *@desc Retrieve market data OTC (Over the counter trade) as provided by Corrently Corp
 * @return {Object} Market data of all assets
 */
ethers.Market = function() {
  return new Promise(function(resolve, reject) {
    request(ethers.CORRENTLY.API + 'market', function(e, r, b) {
      resolve(JSON.parse(b).results);
    });
  });
};

export default ethers;
