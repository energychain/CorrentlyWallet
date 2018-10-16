# CorrentlyWallet
(http://corrently.com/assets/img/CorrentlyWallet.draw.png)

**Ethereum Blockchain Wallet implementing Green Energy semantics for Corrently based decentralized capacity market.**

[![npm version](https://badge.fury.io/js/correntlywallet.svg)](https://badge.fury.io/js/correntlywallet) [![Greenkeeper badge](https://badges.greenkeeper.io/energychain/CorrentlyWallet.svg)](https://greenkeeper.io/)
[ ![Codeship Status for energychain/CorrentlyWallet](https://app.codeship.com/projects/1851a8e0-aa17-0136-d403-2eaeeac4cf7b/status?branch=master)](https://app.codeship.com/projects/309008)
[![Build Status](https://travis-ci.org/energychain/CorrentlyWallet.svg?branch=master)](https://travis-ci.org/energychain/CorrentlyWallet)
[![CircleCI](https://circleci.com/gh/energychain/CorrentlyWallet.svg?style=svg)](https://circleci.com/gh/energychain/CorrentlyWallet)
[![CodeFactor](https://www.codefactor.io/repository/github/energychain/correntlywallet/badge)](https://www.codefactor.io/repository/github/energychain/correntlywallet)
[![HitCount](http://hits.dwyl.io/energychain/CorrentlyWallet.svg)](http://hits.dwyl.io/energychain/CorrentlyWallet)
[![Join the chat at https://gitter.im/corrently/Wallet](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/corrently/Wallet)
[![Coverage Status](https://coveralls.io/repos/github/energychain/CorrentlyWallet/badge.svg?branch=master)](https://coveralls.io/github/energychain/CorrentlyWallet?branch=master)



## Motivation


Using distributed ledger technology it should be easy to buy energy generation capacity (parts of PV plants, Windparks, etc...) and gain value (electricity) from this digital this property.  Aim of CorrentlyWallet is to have a library that takes advantage of Blockchain, Renewable Energy Generation and modern WebTechnology.

## Features
### No Registration or Identification
A *wallet* could be generated localy (even in browser) during runtime. Provides access to latest crypto wallets and privacy protection tactics.

### OTC/P2P Assignment of generation capacity
Moving parts (shares) from one entity to another does not require a middleman. Provides ability to trade locally produced electricity as capacity backed by contracts.

### Decentralized asset registry for energy assets (cadastral)
A decentralized device registry capable of registering a generation facility with attributes like OEM, capacity,
operating specs, calibration criterion.
Providing a reputation score based on the device performance (see performance monitoring);
Provides mechanism to create blacklist of rogue devices.

### GDPR compliance (Right to be forgotten)
Using 'wallet.deleteData(address)' allows to delete all referenced data and destroy bindings.  It requires to have access to privateKey of account. It might be obvious, but this function has **no undo**.

## Installation

### via Package Manager npm
```
npm -i correntlywallet
```

## Concepts

### Corrently
Households receive 1 Corrently (digital currency) per 1 Kilo-Watt-Hour consumption.

### CORI
A CORI is a ERC20-Token [0x725b190bc077ffde17cf549aa8ba25e298550b18](https://etherscan.io/token/0x725b190bc077ffde17cf549aa8ba25e298550b18) backed by 1 Kilo-Watt-Hour generation per year.

## [API Documentation/Getting Started](https://energychain.github.io/CorrentlyWallet/)

## Contributing
- https://stromdao.de/
- https://gitter.im/corrently/Token
