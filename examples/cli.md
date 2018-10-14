# CorrentlyWallet-CLI
**CorrentlyWallet Command Line Interface**

[![asciicast](https://asciinema.org/a/204875.png)](https://asciinema.org/a/204875)

[![CircleCI](https://circleci.com/gh/energychain/CorrentlyWallet-CLI.svg?style=svg)](https://circleci.com/gh/energychain/CorrentlyWallet-CLI)

This wallet is based on CorrentlyWallet library available on: https://www.npmjs.com/package/correntlywallet

## Installation
```
npm install -g correntlywallet-cli
```

## Usage
```
$ corrently help
```

### energy
Prints lifetime generation of electricity associated with this wallet.
```
$ corrently energy
0.0003506081621004566 kWh
```

### market
Prints current OTC market available to wallet
```
$ corrently market
ID	Corrently	Name
#0:	27		PV Plant Gibralta
#1:	32		WindPark Hessen-Süd
#2:	29		WindPark Maingau
```

### account
Prints all information associated to Ethereum Account
```
$ corrently account homestead:0xc430fAB09288C272A321C086d330609CD8b71447
Ethereum Address:		0xc430fAB09288C272A321C086d330609CD8b71447
Yearly Demand:			2425 kWh
Total Collected:		1963 Corrently
Converted:			1665 Corrently
Available:			298 Corrently
Valid from:			2018-10-6 14:53:18
Nominal Generation:		63 kWh/year
Confirmed Generation Equity:	200.72 kWh/year
Metered Generation:		2.5250572645230847 kWh
Metered Consumption:		1863 kWh
./. Imbalance:			-1860.4749427354768 kWh

```

### buy
Issues an OTC buy transaction.
```
$ corrently buy 1 1
```

## Contributing
- https://stromdao.de/
- https://gitter.im/corrently/Token
