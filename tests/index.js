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
      const defaultProvider = CorrentlyWallet.getDefaultProvider('homestead');
      defaultProvider.getBlockNumber().then(function(blockNumber) {
          assert.equal(blockNumber>6000000,true);
          done();
      }).catch(function() { done.fail(); });
    });
});
describe('Consensus validation (CORI and Corrently)', function() {
  this.timeout(300000);
  let wallet = null;
  let account=null;

  it('Get CORI equity directly linked to wallet (should be 0)', function(done) {
    wallet = CorrentlyWallet.Wallet.createRandom().connect(CorrentlyWallet.getDefaultProvider('homestead'));
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
  it('Validate earned Corrently and converted to CORI', function(done) {
    CorrentlyWallet.CorrentlyAccount('0xe596B918cC07852dfA41dd7181492720C261C8E5').then(function(account) {
        assert.equal(account.totalSupply > 0, true);
        assert.equal(account.convertedSupply > 0, true);
        assert.equal(account.nominalCori > 0, true);
        assert.equal(account.ja > 0, true);
        done();
    });
  });
  it('Validate if it holds property confirmed in blockchain', function(done) {
    CorrentlyWallet.CorrentlyAccount('0xe596B918cC07852dfA41dd7181492720C261C8E5').then(function(account) {
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
    wallet = CorrentlyWallet.Wallet.createRandom().connect(CorrentlyWallet.getDefaultProvider('homestead'));
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
