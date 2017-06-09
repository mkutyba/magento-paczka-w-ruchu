<?php

class KutybaIt_PaczkaWRuchu_Model_Observer
{
    // event checkout_controller_onepage_save_shipping_method
    public function savePaczkawruchuDestinationCodeToShipping($observer)
    {
        $event = $observer->getEvent();
        if (!$event) {
            return $this;
        }

        /** @var Mage_Core_Controller_Request_Http $request */
        $request = $event->getRequest();
        /** @var Mage_Sales_Model_Quote $quote */
        $quote = $event->getQuote();

        if (!$request || !$quote) {
            return $this;
        }

        $paczkawruchuDestinationCode = $request->getParam('paczkawruchu_destination_code');
        if (!$paczkawruchuDestinationCode) {
            return $this;
        }

        $quote->setPaczkawruchuDestinationCode($paczkawruchuDestinationCode)->save();

        return $this;
    }

    public function modifyShippingDescription($observer)
    {
        $event = $observer->getEvent();
        if (!$event) {
            return $this;
        }

        /** @var Mage_Sales_Model_Order $order */
        $order = $event->getOrder();
        if (!$order) {
            return $this;
        }

        if ($paczkawruchuDestinationCode = $order->getPaczkawruchuDestinationCode()) {
            $order->setShippingDescription(
                $order->getShippingDescription() . " ($paczkawruchuDestinationCode)"
            );
        }

        return $this;
    }
}