<?php

class KutybaIt_PaczkaWRuchu_Helper_Data extends Mage_Core_Helper_Abstract
{
    const CONFIG_GMAPS_API_KEY = 'carriers/paczkawruchu/gmaps_api_key';

    public function getGoogleMapsApiKey()
    {
        return Mage::getStoreConfig(self::CONFIG_GMAPS_API_KEY);
    }
}