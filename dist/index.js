'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Ethereum Blockchain Wallet implementing Green Energy semantics for Corrently based decentralized capacity market.
 *
 * @link https://corrently.com/
 * @module CorrentlyWallet
 */

var ethers = require('ethers');
var request = require('request');

if (typeof ethers.providers.getDefaultProvider === 'undefined') {
  if (typeof ethers.getDefaultProvider !== 'undefined') {
    ethers.providers.getDefaultProvider = ethers.getDefaultProvider;
  }
}
/**
 * @const CORRENTLY
 * @desc Core Constants for semantics used in decentralized capacity market
 */
ethers.CORRENTLY = {
  ERC20ABI: require('./ERC20ABI.json'),
  STROMKONTOABI: require('./STROMKONTOABI.json'),
  CORI_ADDRESS: '0x725b190bc077ffde17cf549aa8ba25e298550b18',
  API: 'https://api.corrently.io/core/'
};

/**
 * @function CorrentlyAccount
  *@desc Digital twin of consensus driven account identified by address
 * @param {string} address Address of a twinable account
 * @return {Object} Digital twin identified by address
 */
ethers.CorrentlyAccount = function (address) {
  return new Promise(function (resolve, reject) {
    ethers.utils._retrieveCoriAccount(address).then(function (twin) {
      twin.getCoriEquity = function () {
        var cori_contract = new ethers.Contract(ethers.CORRENTLY.CORI_ADDRESS, ethers.CORRENTLY.ERC20ABI, ethers.providers.getDefaultProvider('homestead'));

        return new Promise(function (resolve2, reject) {
          cori_contract.balanceOf(address).then(function (balance) {
            resolve2(balance / 100);
          });
        });
      };
      twin.getMetas = function () {
        return new Promise(function (resolve2, reject2) {
          var options = {
            url: ethers.CORRENTLY.API + 'meta?account=' + address,
            timeout: 20000
          };
          request(options, function (e, r, b) {
            var results = JSON.parse(b);
            resolve2(results.result);
          });
        });
      };
      twin.getStromkonto = function () {
        return ethers.Stromkonto(address);
      };
      resolve(twin);
    });
  });
};

/**
 * @function CorrentlyIoT
  *@desc IoT Wrapper to Corrently-IoT implementation
 * @param {string} address Address of a thing
 * @return {number} Value of thing
 */
ethers.CorrentlyIoT = function (address) {
  return new Promise(function (resolve, reject) {
    var options = {
      url: ethers.CORRENTLY.API + 'iot?account=' + address,
      timeout: 20000
    };
    request(options, function (e, r, b) {
      var results = JSON.parse(b);
      resolve(results.result.value);
    });
  });
};

/**
 * @function deleteData
  *@desc GDPR compliance to delete personal and private data from OTC transactions
 * @param {string} address Address of wallet
 */
ethers.Wallet.prototype.deleteData = function (address) {
  var parent = this;
  return new Promise(function (resolve, reject) {
    var transaction = {};
    transaction.timeStamp = new Date().getTime();

    var hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(transaction)));
    parent.signMessage(hash).then(function (signature) {
      var options = {
        url: ethers.CORRENTLY.API + 'deleteTwin?&signature=' + signature + '&hash=' + hash + '&transaction=' + encodeURI(JSON.stringify(transaction)),
        timeout: 20000
      };
      request(options, function (e, r, b) {
        var results = JSON.parse(b);
        resolve(results);
      });
    });
  });
};

/**
 * @function buyCapacity
  *@desc OTC buy capacity from market
 * @param {string} asset Address Contract to buy from
 * @param {number} quantity Amount of capacity to buy
 */
ethers.Wallet.prototype.buyCapacity = function (asset, quantity, funding) {
  if ((typeof asset === 'undefined' ? 'undefined' : _typeof(asset)) === 'object' && typeof asset.assset !== 'undefined') {
    asset = asset.asset;
  }
  var parent = this;
  return new Promise(function (resolve, reject) {
    parent._retrieveCoriAccount().then(function (account) {
      ethers.Market().then(function (market) {
        var transaction = {};
        transaction.cori = quantity;
        transaction.timeStamp = new Date().getTime();
        transaction.asset = asset;
        transaction.eth = 0;
        transaction.nonce = account.txs.length;
        if (typeof funding !== 'undefined' && funding !== null) {
          transaction.funding = funding;
        }
        var hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(transaction)));
        parent.signMessage(hash).then(function (signature) {
          delete parent.twin;
          var options = {
            url: ethers.CORRENTLY.API + 'signedTransaction?transaction=' + encodeURI(JSON.stringify(transaction)) + '&hash=' + hash + '&signature=' + signature,
            timeout: 20000
          };
          request(options, function (e, r, b) {
            var results = JSON.parse(b);
            resolve(results.result);
          });
        });
      });
    });
  });
};

/**
 * Link confirmed consumption source to wallet.
 * Any provider or authority might create new demand links. Typical use of this function is after receiving
 * a demandLink from a provider/utility.
 *
 * @function linkDemand
 * @param {string} ethereumAddress Address to link with
 */
ethers.Wallet.prototype.linkDemand = function (ethereumAddress) {
  var parent = this;
  return new Promise(function (resolve, reject) {
    var transaction = {};
    transaction.link = ethereumAddress;
    var hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(transaction)));
    parent.signMessage(hash).then(function (signature) {
      var options = {
        url: ethers.CORRENTLY.API + 'link?transaction=' + encodeURI(JSON.stringify(transaction)) + '&hash=' + hash + '&signature=' + signature,
        timeout: 20000
      };
      request(options, function (e, r, b) {
        var results = JSON.parse(b);
        resolve(results.result);
      });
    });
  });
};

/**
 * Set Key Value MetaInformation for account
 * Allows to associate signed meta information to an account which becomes publicly available
 *
 * @function setMeta
 * @param {string} key Of Meta Date
 * @param {string} value Of Meta Date
 */
ethers.Wallet.prototype.setMeta = function (key, value) {
  var parent = this;
  var _key = key;
  var _value = value;
  return new Promise(function (resolve, reject) {
    var transaction = {};
    var hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(transaction)));
    parent.signMessage(hash).then(function (signature) {
      var options = {
        url: ethers.CORRENTLY.API + 'meta?account=' + parent.address + '&key=' + encodeURI(_key) + '&value=' + encodeURI(_value) + '&hash=' + hash + '&signature=' + signature,
        timeout: 20000
      };
      request(options, function (e, r, b) {
        var results = JSON.parse(b);
        resolve(results.result);
      });
    });
  });
};

/**
 * Request new Demand Link - This method might be used to tell an energy provider to publish a new deman link for this account.
 * Typical usage is to set email and provider in options. The given energy provider will get in contact with you to negotiate an offer.
 * As soon as an energy contract is in place a demanLink will be published and could be used with the function `linkDemand`.
 *
 * Typical Options:
 *  - email: communication address for contract, offer negotiation. Only allowed to be used for this Communication
 *  - provider: Might be 'stromdao' as contact persion (request will be routed to this provider)
 *  - yearlyDemand: Kilo-Watt-Hours per Year requested
 *  - address: Geo-Coded Address for point of consumption
 *
 * @function newDemand
 * @param {object} options Options required for energy  provider to create a demandLink
 */
ethers.Wallet.prototype.newDemand = function (data) {
  var parent = this;
  return new Promise(function (resolve, reject) {
    var email = data.email;
    delete data.email;
    var transaction = {};
    if (typeof data.provider === 'undefined') data.provider = 'STROMDAO';
    transaction.email = email;
    transaction.options = JSON.stringify(data);
    var hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(transaction)));
    parent.signMessage(hash).then(function (signature) {
      var options = {
        url: ethers.CORRENTLY.API + 'requestLink?transaction=' + encodeURI(JSON.stringify(transaction)) + '&hash=' + hash + '&signature=' + signature,
        timeout: 20000
      };
      request(options, function (e, r, b) {
        var results = JSON.parse(b);
        resolve(results.result);
      });
    });
  });
};

/**
 * @function transferCapacity
  *@desc Transfer generation capacity to another ethereum account
 * @param {string} ethereumAddress Address to receive capacity
 * @param {number} kilowatthours Kilo-Watt-Hours per year to transfer
 */
ethers.Wallet.prototype.transferCapacity = function (ethereumAddress, kilowatthours) {
  var parent = this;
  return new Promise(function (resolve, reject) {
    var cori_contract = new ethers.Contract(ethers.CORRENTLY.CORI_ADDRESS, ethers.CORRENTLY.ERC20ABI, parent);
    cori_contract.transfer(ethereumAddress, Math.round(kilowatthours * 100)).then(function (tx) {
      resolve(tx);
    }).catch(function (e) {
      reject(e);
    });
  });
};

ethers.Wallet.prototype.transferCORI = ethers.Wallet.prototype.transferCapacity;

/**
 * @function deletePending
  *@desc Delete a pending transaction from q
 * @param {string} nonce nonce of a pending transaction
 */
ethers.Wallet.prototype.deletePending = function (nonce) {
  var parent = this;
  return new Promise(function (resolve, reject) {
    parent._retrieveCoriAccount().then(function (account) {
      var transaction = {};
      transaction.nonce = nonce;

      var hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(transaction)));
      parent.signMessage(hash).then(function (signature) {
        delete parent.twin;
        var options = {
          url: ethers.CORRENTLY.API + 'deletePending?transaction=' + encodeURI(JSON.stringify(transaction)) + '&hash=' + hash + '&signature=' + signature,
          timeout: 20000
        };
        request(options, function (e, r, b) {
          var results = JSON.parse(b);
          resolve(results.result);
        });
      });
    });
  });
};

ethers.Wallet.prototype._retrieveCoriAccount = function () {
  var parent = this;
  return new Promise(function (resolve, reject) {
    if (typeof parent.account === 'undefined') {
      ethers.CorrentlyAccount(parent.address).then(function (twin) {
        parent.twin = twin;
        resolve(twin);
      });
    } else {
      resolve(parent.twin);
    }
  });
};

ethers.utils._retrieveCoriAccount = function (address) {
  return new Promise(function (resolve, reject) {
    request(ethers.CORRENTLY.API + 'accountInfo?account=' + address, function (e, r, b) {
      resolve(JSON.parse(b).result);
    });
  });
};

/**
 * @function Market
  *@desc Retrieve market data OTC (Over the counter trade) as provided by Corrently Corp
 * @return {Object} Market data of all assets
 */
ethers.Market = function () {
  return new Promise(function (resolve, reject) {
    request(ethers.CORRENTLY.API + 'market', function (e, r, b) {
      resolve(JSON.parse(b).results);
    });
  });
};

/**
 * Retrieve Performance profile of given asset.
 * Corrently has a day based performance monitoring for assets on the market.
 * This is subject to be changed in later releases to merge with Performance package
 *
 * @function performance
 * @param {string} asset transaction hash of asset contract setup
 * @return {Object} Performance data as returned by asset schema
 */
ethers.Market.performance = function (asset) {
  return new Promise(function (resolve, reject) {
    request(ethers.CORRENTLY.API + 'assetPerformance?asset=' + asset, function (e, r, b) {
      resolve(JSON.parse(b).results);
    });
  });
};

/**
 * Retrieve Performance profile of given asset Metering ID.
 * Note: This is not standarized at the moment and schema is subject to be changed.
 *
 * @function Performance
 * @param {string} meterid unique id to dispatch
 * @return {Object} Performance data as given by meter schema
 */
ethers.Performance = function (meterid) {
  return new Promise(function (resolve, reject) {
    request(ethers.CORRENTLY.API + 'performance?meterid=' + meterid, function (e, r, b) {
      resolve(JSON.parse(b));
    });
  });
};

/**
 * Retrieve Stromkonto Balances for given account.
 * Note: This does not retrieve data from BLC - instead it is using Corrently service
 *
 * @function Stromkonto
 * @param {string} meterid unique id to dispatch
 * @return {Object} Performance data as given by meter schema
 */
ethers.Stromkonto = function (account) {
  return new Promise(function (resolve, reject) {
    request(ethers.CORRENTLY.API + 'stromkonto?account=' + account, function (e, r, b) {
      var res = JSON.parse(b);
      res.transactions = function () {
        return new Promise(function (resolve2, reject2) {
          var provider = new ethers.providers.JsonRpcProvider('https://node.corrently.io/', { chainId: 42 });
          provider.getBlockNumber().then(function (latest_block) {
            var mytxs = [];
            provider.getLogs({
              address: '0x8e93e70d8ac18dbaa38dd557acd4901f843e04e3',
              fromBlock: latest_block - 15000,
              topics: ['0x1a71774309711c9c0f58692353c6a0789dbdc71f63e2e42a190ab9bc03f79250']
            }).then(function (l) {
              l = l.reverse();
              for (var i = 0; i < l.length; i++) {
                var item = l[i];
                item.data = item.data.substr(2);
                item.from = '0x' + item.data.substr(24, 40);
                item.to = '0x' + item.data.substr(88, 40);
                item.value = parseInt(item.data.substr(128, 64), 16) / 100000;
                item.base = parseInt(item.data.substr(192, 64), 16) / 1000;
                l[i] = item;
                if (item.from === ('' + account).toLowerCase() || item.to === ('' + account).toLowerCase()) {
                  if (item.from === ('' + account).toLowerCase()) {
                    item.peer = item.to;
                    item.value_abs = item.value * -1;
                    item.base_abs = item.base * -1;
                  } else {
                    item.peer = item.from;
                    item.value_abs = item.value;
                    item.base_abs = item.base;
                  }
                  item.value_abs = (item.value_abs.toFixed(5) + '').replace('.', ',');
                  item.base_abs = (item.base_abs.toFixed(3) + '').replace('.', ',');
                  if (item.peer === '0x445c1e284c15a50a69fe7d6dcd9fba3b938b52bb') item.base_abs = '';
                  mytxs.push(item);
                }
              }
              resolve2(mytxs);
            });
          });
        });
      };

      resolve(res);
    });
  });
};

exports.default = ethers;