# Magento Paczka w RUCHu - shipping method
Paczka w RUCHu is logistics service based in Poland https://www.paczkawruchu.pl/

The module is made in Polish language.

## The module should work with:
- [x] Magento Onepage Checkout
- [ ] Magento Multishipping
- [x] IWD One Page Checkout v4
- [x] IWD Checkout Suite v5
- [ ] IWD Checkout Suite v6
- [ ] Magento Admin Checkout (Create New Order in backoffice)

## Installation
Download files and extract to magento directory https://github.com/mkutyba/magento-paczka-w-ruchu/archive/master.zip

or

Install using modman ```modman clone https://github.com/mkutyba/magento-paczka-w-ruchu.git```

or

Install using composer ```composer require kutybait/magento-paczkawruchu```

[How to install a Magento module](http://fbrnc.net/blog/2014/11/how-to-install-a-magento-module)

## Configuration

**System > Configuration > Shipping Methods > Paczka w RUCHu**

Enable shipping method by setting **Enabled** to **Yes**.

It's also needed to provide **Google Maps API Key** for rendering a map.

[Get API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)

## Magento Onepage Checkout

![Onepage Checkout](/docs/osc.png?raw=true)
![Onepage Checkout popup](/docs/osc-popup.png?raw=true)
