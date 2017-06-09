<?php

class KutybaIt_PaczkaWRuchu_Model_Carrier
    extends Mage_Shipping_Model_Carrier_Abstract
    implements Mage_Shipping_Model_Carrier_Interface
{
    /**
     * Code of the carrier
     *
     * @var string
     */
    const CODE = 'paczkawruchu';

    /**
     * Code of the carrier
     *
     * @var string
     */
    protected $_code = self::CODE;

    /**
     * Get allowed shipping methods
     *
     * @return array
     */
    public function getAllowedMethods()
    {
        return [
            'prepaid' => $this->getConfigData('name_prepaid'),
            'cod' => $this->getConfigData('name_cod'),
        ];
    }

    /**
     * Collect and get rates
     *
     * @param Mage_Shipping_Model_Rate_Request $request
     * @return Mage_Shipping_Model_Rate_Result|bool|null
     */
    public function collectRates(Mage_Shipping_Model_Rate_Request $request)
    {
        if (!$this->getConfigFlag('active')) {
            return false;
        }

        $result = Mage::getModel('shipping/rate_result');

        foreach ($this->getAllowedMethods() as $code => $name) {
            $result->append($this->_getRate($code));
        }

        return $result;
    }

    protected function _getRate($code)
    {
        $rate = Mage::getModel('shipping/rate_result_method');

        $rate->setCarrier($this->_code);
        $rate->setCarrierTitle($this->getConfigData('title'));
        $rate->setMethod($code);
        $rate->setMethodTitle($this->getConfigData("name_$code"));
        $rate->setPrice($this->getConfigData("price_$code"));
        $rate->setCost(0);

        return $rate;
    }
}
