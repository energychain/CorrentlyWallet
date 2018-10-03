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
  it('Get CORI equity directly linked to wallet (should be 0)', function(done) {
    wallet = CorrentlyWallet.Wallet.createRandom().connect(CorrentlyWallet.getDefaultProvider('homestead'));
    wallet.getCoriEquity().then(function(coriEquity) {
        assert.equal(coriEquity,0);
        done();
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
    wallet.getEarnedCorrently().then(function(x) {
      assert.notEqual(isNaN(x),true);
      done();
    });
  });
  it('Validate converted Corrently (=0)', function(done) {
    wallet.getConvertedCorrently().then(function(x) {
      assert.equal(x,0);
      done();
    });
  });
  it('Validate no Corrently transactions', function(done) {
    wallet.getCorrentlyTransactions().then(function(x) {
      assert.equal(x.length,0);
      done();
    });
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
