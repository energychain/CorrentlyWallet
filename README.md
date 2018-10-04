# CorrentlyWallet
**Ethereum Blockchain Wallet implementing Green Energy semantics for Corrently based decentralized capacity market.**

[![npm version](https://badge.fury.io/js/correntlywallet.svg)](https://badge.fury.io/js/correntlywallet) [![Greenkeeper badge](https://badges.greenkeeper.io/energychain/CorrentlyWallet.svg)](https://greenkeeper.io/)
[ ![Codeship Status for energychain/CorrentlyWallet](https://app.codeship.com/projects/1851a8e0-aa17-0136-d403-2eaeeac4cf7b/status?branch=master)](https://app.codeship.com/projects/309008)
[![Build Status](https://travis-ci.org/energychain/CorrentlyWallet.svg?branch=master)](https://travis-ci.org/energychain/CorrentlyWallet)
[![CircleCI](https://circleci.com/gh/energychain/CorrentlyWallet.svg?style=svg)](https://circleci.com/gh/energychain/CorrentlyWallet)

## Motivation
Using distributed ledger technology it should be easy to buy energy generation capacity (parts of PV plants, Windparks, etc...) and gain value (electricity) from this digital this property.  Aim of CorrentlyWallet is to have a library that takes advantage of Blockchain, Renewable Energy Generation and modern WebTechnology.

## Features
### No Registration or Identification
A *wallet* could be generated localy (even in browser) during runtime.

### OTC/P2P Assignment of generation capacity
Moving parts (shares) from one entity to another does not require a middleman.

### Public cadastral greenenergy generation register
Available and covered by Ethereum public blockchain.

### GDPR compliance (Right to be forgotten)
Using 'wallet.deleteData(address)' allows to delete all referenced data and destroy bindings.  It requires to have access to privateKey of account. It might be obvious, but this function has **no undo**.

## Installation

### via Package Manager npm
```
npm -i correntlywallet
```

### via Browser
```
<script src=""></script>
```

## Contributing
- https://stromdao.de/
- https://gitter.im/corrently/Token
