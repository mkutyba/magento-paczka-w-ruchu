var PaczkaWRuchu = {
    carrierName: 'paczkawruchu',
    prepaidName: 'prepaid',
    codName: 'cod',
    otherName: 'other',
    prepaidRadioId: 's_method_paczkawruchu_prepaid',
    codRadioId: 's_method_paczkawruchu_cod',
    prepaidFormId: 'paczkawruchu_prepaid_form',
    codFormId: 'paczkawruchu_cod_form',
    prepaidInputId: 'paczkawruchu_prepaid_input',
    codInputId: 'paczkawruchu_cod_input',
    currentMethod: 'other',

    initMageOnepage: function () {
        this.init('mage/onepage');
    },

    initIwdOpc4: function () {
        this.init('iwd/opc4');
    },

    initIwdOpc6: function () {
        this.init('iwd/opc6');
    },

    reinitIwdOpc4: function (response) {
        if (typeof response.shipping !== 'undefined') {
            this.currentMethod = this.otherName;
            this.init('iwd/opc4');
            IWD.OPC.Shipping.validateShippingMethod();
        }
    },

    reinitIwdOpc6: function () {
        this.currentMethod = this.otherName;
        this.init('iwd/opc6');
    },

    init: function (type) {
        this.bindEventHandlers(type);
        this.prepaidRadio = document.getElementById(this.prepaidRadioId);
        this.codRadio = document.getElementById(this.codRadioId);
        this.handleMethodChange(type, false);
        this.tryToRestoreFromLocalStorage();
    },

    bindEventHandlers: function (type) {
        var self = this;

        if (type === 'iwd/opc6') {
            var rates = document.getElementById('iwd_opc_shipping_rates');
            if (rates) {
                var elements = rates.getElementsByTagName('select');
                Array.prototype.forEach.call(elements, function (element) {
                    element.addEventListener('change', function () {
                        self.handleMethodChange(type, true);
                    });
                });
            }
            document.getElementById('iwd_opc_shipping_method_group_select').addEventListener('change', function () {
                self.handleMethodChange(type, true);
            });
        } else {
            document.getElementsByName('shipping_method').forEach(function (element) {
                element.addEventListener('change', function () {
                    self.handleMethodChange(type, true);
                });
            });
        }
    },

    handleMethodChange: function (type, popup) {
        var oldMethod = this.currentMethod;

        if (type === 'iwd/opc6') {
            this.currentMethod = Singleton.get(ShippingMethod).getSaveData()[0].value;
            if (this.currentMethod === this.carrierName + '_' + this.prepaidName) {
                this.currentMethod = this.prepaidName;
            } else if (this.currentMethod === this.carrierName + '_' + this.codName) {
                this.currentMethod = this.codName;
            } else {
                this.currentMethod = this.otherName;
            }
        } else {
            if (this.prepaidRadio.checked) {
                this.currentMethod = this.prepaidName;
            } else if (this.codRadio.checked) {
                this.currentMethod = this.codName;
            } else {
                this.currentMethod = this.otherName;
            }
        }

        if (oldMethod !== this.currentMethod) {
            this.showFormAndMap(type, popup);
        }
    },

    showFormAndMap: function (type, popup) {
        if (this.currentMethod === this.prepaidName) {
            if (type === 'iwd/opc6') {
                this.appendFormToElementIwdOpc6(this.prepaidName);
            } else {
                this.appendFormToElement(this.prepaidName);
            }
            if (popup) {
                jQuery('#pwr_prepaid').click();
            }
        } else {
            var prepaidForm = document.getElementById(this.prepaidFormId);
            prepaidForm && prepaidForm.parentNode.removeChild(prepaidForm);
        }

        if (this.currentMethod === this.codName) {
            if (type === 'iwd/opc6') {
                this.appendFormToElementIwdOpc6(this.codName);
            } else {
                this.appendFormToElement(this.codName);
            }
            if (popup) {
                jQuery('#pwr_cod').click();
            }
        } else {
            var codForm = document.getElementById(this.codFormId);
            codForm && codForm.parentNode.removeChild(codForm);
        }
    },

    appendFormToElement: function (type) {
        var locationForm = document.createElement('div');
        locationForm.id = this[type + 'FormId'];
        var button = document.createElement('a');
        button.id = 'pwr_' + type;
        button.innerText = 'Wybierz punkt odbioru';
        button.className += 'button';
        locationForm.appendChild(button);
        var field = document.createElement('div');
        field.className += 'field paczkawruchu_field';
        var label = document.createElement('label');
        field.appendChild(label);
        var input = document.createElement('input');
        input.type = 'hidden';
        input.id = this[type + 'InputId'];
        input.name = 'paczkawruchu_destination_code';
        input.readonly = 'readonly';
        input.className += 'input-text required-entry';
        field.appendChild(input);
        locationForm.appendChild(field);
        this[type + 'Radio'].parentNode.appendChild(locationForm);
        var cod = (type === this.codName);
        var self = this;
        jQuery('#pwr_' + type).pwrgeopicker('popup', {
            'form': {
                'city': 'Warszawa'
            },
            'popup': true,
            'CashOnDelivery': cod,
            'autocomplete': true,
            'onselect': function (data) {
                input.value = data['DestinationCode'];
                label.innerText = data['DestinationCode'] + ' - ' + data['StreetName'] + ' ' + data['City'];
                self.validate();
                self.saveToLocalStorage('pwr_destination_' + type, data);
                self.saveShippingMethodIwdOpc4();
            }
        });
    },

    appendFormToElementIwdOpc6: function (type) {
        var locationForm = document.createElement('div');
        locationForm.id = this[type + 'FormId'];
        var button = document.createElement('button');
        button.id = 'pwr_' + type;
        button.type = 'button';
        button.innerText = 'Wybierz punkt odbioru';
        button.className += 'iwd_opc_button active';
        locationForm.appendChild(button);
        var field = document.createElement('div');
        field.className += 'field paczkawruchu_field';
        var label = document.createElement('label');
        field.appendChild(label);
        var input = document.createElement('input');
        input.type = 'hidden';
        input.id = this[type + 'InputId'];
        input.name = 'paczkawruchu_destination_code';
        input.readonly = 'readonly';
        input.className += 'input-text required-entry';
        field.appendChild(input);
        locationForm.appendChild(field);
        document.getElementById('iwd_opc_shipping_rates').parentNode.appendChild(locationForm);
        var cod = (type === this.codName);
        var self = this;
        jQuery('#pwr_' + type).pwrgeopicker('popup', {
            'form': {
                'city': 'Warszawa'
            },
            'popup': true,
            'CashOnDelivery': cod,
            'autocomplete': true,
            'onselect': function (data) {
                input.value = data['DestinationCode'];
                label.innerText = data['DestinationCode'] + ' - ' + data['StreetName'] + ' ' + data['City'];
                self.validate();
                self.saveToLocalStorage('pwr_destination_' + type, data);
                self.saveShippingMethodIwdOpc6();
            }
        });
    },

    validate: function () {
        var varienForm = new VarienForm(this[this.currentMethod + 'FormId']);
        if (typeof varienForm.validator !== 'object' || typeof varienForm.validator.validate !== 'function') {
            return true;
        }
        return varienForm.validator.validate();
    },

    saveShippingMethodIwdOpc4: function () {
        if (typeof IWD === 'object' && typeof IWD.OPC === 'object' && typeof IWD.OPC.Shipping === 'object'
            && typeof IWD.OPC.Shipping.saveShippingMethod === 'function') {
            IWD.OPC.Shipping.saveShippingMethod();
        }
    },

    saveShippingMethodIwdOpc6: function () {
        Singleton.get(ShippingMethod).saveSection();
    },

    saveToLocalStorage: function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    loadFromLocalStorage: function (key) {
        var retrievedObject = localStorage.getItem(key);
        return JSON.parse(retrievedObject);
    },

    tryToRestoreFromLocalStorage: function () {
        var self = this;
        var types = ['prepaid', 'cod'];
        types.forEach(function (type) {
            var data = self.loadFromLocalStorage('pwr_destination_' + type);
            if (data) {
                if (typeof data === 'object' && typeof data['DestinationCode'] === 'string') {
                    var input = document.getElementById(self[type + 'InputId']);
                    if (!input) {
                        return;
                    }
                    input.value = data['DestinationCode'];
                    var label = input.parentNode.getElementsByTagName('label')[0];
                    if (label) {
                        label.innerText = data['DestinationCode'] + ' - ' + data['StreetName'] + ' ' + data['City'];
                    }
                }
            }
        });
    }
};