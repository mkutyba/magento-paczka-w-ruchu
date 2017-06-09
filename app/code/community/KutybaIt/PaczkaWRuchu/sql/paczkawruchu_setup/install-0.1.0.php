<?php
/* @var $installer Mage_Sales_Model_Resource_Setup */
$installer = $this;

$installer->startSetup();

$attributeConfig = [
    'type' => 'varchar',
    'label' => 'Paczka w RUCHu - Punkt odbioru',
    'input' => 'text',
    'required' => false,
    'is_visible' => false,
    'is_system' => false,
    'is_user_defined' => true,
];
$installer->addAttribute('quote', 'paczkawruchu_destination_code', $attributeConfig);
$installer->addAttribute('order', 'paczkawruchu_destination_code', $attributeConfig);

$installer->getConnection()->addColumn($installer->getTable('sales/quote'), 'paczkawruchu_destination_code', [
    'type' => Varien_Db_Ddl_Table::TYPE_TEXT,
    'length' => 255,
    'nullable' => true,
    'comment' => 'Paczka w RUCHu Destination Code',
]);

$installer->endSetup();
