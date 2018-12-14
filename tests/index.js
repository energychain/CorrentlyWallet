'use strict';
import CorrentlyWallet from '../src/index.js';
const assert = require('assert');

describe('Compatibility with ethers.js', function() {
    this.timeout(300000);
    it('Create Random Wallet', function(done) {
      const wallet = CorrentlyWallet.Wallet.createRandom();
      assert.equal(wallet.address.length,42);
      assert.equal(wallet.privateKey.length,66);
      done();
    });
    it('Create Wallet with given Private Key',function(done) {
      const wallet= new CorrentlyWallet.Wallet('0x1e1fa4cbda6d6c47de641251e2eb1cb57830269e7513492b79dbb68c63a92c76');
      assert.equal(wallet.address.length,42);
      assert.equal(wallet.address,'0x9409fd45D6891092cd05D2847c86CEb606C9E17A');
      done();
    });
    it('Communication via Ethereum Homestead provider',function(done) {
      const defaultProvider = CorrentlyWallet.providers.getDefaultProvider('homestead');
      defaultProvider.getBlockNumber().then(function(blockNumber) {
          assert.equal(blockNumber>6000000,true);
          done();
      }).catch(function() { done(); });
    });
});
describe('Consensus validation (CORI and Corrently)', function() {
  this.timeout(300000);
  let wallet = null;
  let account=null;

  it('Get CORI equity directly linked to wallet (should be 0)', function(done) {
    wallet = new CorrentlyWallet.Wallet(CorrentlyWallet.Wallet.createRandom().privateKey,CorrentlyWallet.providers.getDefaultProvider('homestead'));

    CorrentlyWallet.CorrentlyAccount(wallet.address).then(function(twin) {
        account=twin;
        twin.getCoriEquity().then(function(coriEquity) {
            assert.equal(coriEquity,0);
            done();
        });
    });
  });

  it('Low-Level validation of digital twin', function(done) {
    wallet._retrieveCoriAccount().then(function(x) {
      assert.equal(x.account,wallet.address);
      assert.equal(x.nominalCori,0);
      done();
    });
  });
  it('Retrieve well known IoT value', function(done) {
     CorrentlyWallet.CorrentlyIoT("0x351dE91E3815f8084b8BF2379D3434Ea3D3be24a").then(function(x) {
       assert.notEqual(x,0);
       done();
     });
  });
  it('Try to set some meta value', function(done) {
    wallet.setMeta('transition','unit_testing').then(function(x) {
      assert.equal(x.account,wallet.address);
      assert.equal(x.updated > new Date().getTime()-8640000,true);
      done();
    });
  });
  it('Try to get meta from twin', function(done) {
    account.getMetas().then(function(metas) {
      assert.equal(metas.account,wallet.address);
      assert.equal(metas.updated > new Date().getTime()-8640000,true);
      done();
    });
  });
  it('Validate earned Corrently (=Number)', function(done) {
      assert.notEqual(isNaN(account.totalSupply),true);
      done();
  });
  it('Validate converted Corrently (=0)', function(done) {
      assert.equal(account.convertedSupply,0);
      done();
  });
  it('Validate no Corrently transactions', function(done) {
      assert.equal(account.txs.length,0);
      done();
  });

});
describe('Well known Account validation (STROMDAO Demo User)', function() {
  it('Validate if it holds property confirmed in blockchain', function(done) {
    CorrentlyWallet.CorrentlyAccount('0xe596B918cC07852dfA41dd7181492720C261C8E5').then(function(account) {
        done();
    });
  });
  it('Validate performance stats (Demand Side)', function(done) {
    CorrentlyWallet.Performance('EASYMETER_1124001519').then(function(performance) {
        assert.equal(performance.length>0,true);
        done();
    });
  });
});
describe('Use Case: Buy Capacity Over The Counter (OTC)', function() {
  let market = null;
  let available_asset = null;
  let wallet = null;
  let account = null;
  this.timeout(300000);

  it('Create new wallet', function(done) {
    wallet = new CorrentlyWallet.Wallet(CorrentlyWallet.Wallet.createRandom().privateKey,CorrentlyWallet.providers.getDefaultProvider('homestead'));
    CorrentlyWallet.CorrentlyAccount(wallet.address).then(function(_account) {
        account=_account;
        done();
    });
  });
  it('Retrieve OTC market', function(done) {
    CorrentlyWallet.Market().then(function(_market) {
        market=_market;
        assert.equal(market.length > 0,true);
        // check at least one asset has available supply
        let supply=0;
        for(let i=0;i<market.length;i++) {
            supply+=market[i].availableSupply;
            if(market[i].availableSupply > 0) {
              available_asset = market[i];
            }
        }
        assert.equal(supply > 0, true);
        done();
    });
  });
  it('Retrieve performance Information of well known asset', function(done) {
      CorrentlyWallet.Market.performance('0xabbd396e4e96517a63a834a3177f8b2809e1bd6682547f1d07bc5bf8073a99d3').then(function(transaction) {
        assert.equal(transaction.last_day > 0, true);
        assert.equal(transaction.last_day > (new Date().getTime()/86400000)-7, true);
        assert.equal(transaction.last_day < (new Date().getTime()/86400000)+1, true);
        done();
    });
  });
  it('Buy generation capacity', function(done) {
    wallet.buyCapacity(available_asset, 1).then(function(transaction) {
        assert.equal(transaction.txs.length > account.txs.length, true);
        done();
    });
  });
  it('Link confirmed consumption with wallet', function(done) {
    wallet.linkDemand('0x9d28463d51aC40662865D2462e80825D4DBB41d5').then(function(transaction) {
        assert.equal(transaction.ja > 0, true);
        assert.equal(account.ja, 0);
        done();
    });
  });
  it('request creation of new DemandLink', function(done) {
    let options = {email:'test@test.com', provider:'stromdao',yearlyDemand:3000,region:'Germany',address:'10117'};
    wallet.newDemand(options).then(function(transaction) {
        assert.equal(account.created > 0, true);
        done();
    });
  });
  it('Wait 15 seconds in order to have some generation', function(done) {
    this.timeout(300000);
    setTimeout(function() {
      done();
    },15000);
  });
  it('Validate generation is > 0', function(done) {
    CorrentlyWallet.CorrentlyAccount(wallet.address).then(function(_account) {
      assert.equal(_account.generation > 0,true);
      account=_account;
      done();
    });
  });
  it('Buy more generation capacity than effortable', function(done) {
    wallet.buyCapacity(available_asset, 1000).then(function(transaction) {
        assert.equal(transaction.txs.length === account.txs.length, true);
        done();
    });
  });
  it('Transfer capacity (fail due to missing gas)', function(done) {
    wallet.transferCapacity(wallet.address, 1).then(function(transaction) {
        // This should not happen...
    }).catch(function(e) {
        assert.notEqual(e,null);
        done();
    });
  });
  it('Delete pending transaction (has nonce=0)', function(done) {
    wallet.deletePending(0).then(function(transaction) {
        assert.equal(transaction.txs.length < account.txs.length, true);
        done();
    });
  });
  describe('GDPR Compliance', function() {
    it('Delete account references', function(done) {
      wallet.deleteData(wallet.address).then(function(transaction) {
          assert.equal(transaction.deleted,true);
          done();
      });
    });
    it('Validate all references got deleted', function(done) {
        CorrentlyWallet.CorrentlyAccount(wallet.address).then(function(_account) {
          assert.equal(_account.txs.length,0);
          done();
        });
    });
  });
});
describe('Stromkonto Handling', function() {
  this.timeout(300000);
  it('Retrieve balances (backend)', function(done) {
    CorrentlyWallet.Stromkonto('0xe596B918cC07852dfA41dd7181492720C261C8E5').then(function(stromkonto) {
        assert.equal(stromkonto.balance !=0 , true);
        assert.equal(typeof stromkonto.transactions == 'function',true);
        stromkonto.transactions().then(function(txs) {
          assert.equal(txs.length > 0, true);
          done();
        });
    });
  });
  it('Retrieve balances (via Acount)', function(done) {
    CorrentlyWallet.CorrentlyAccount('0xe596B918cC07852dfA41dd7181492720C261C8E5').then(function(_account) {
          _account.getStromkonto().then(function(stromkonto) {
            assert.equal(stromkonto.balance !=0 , true);
            assert.equal(typeof stromkonto.transactions == 'function',true);
            done();
        })
    });
  });
});
