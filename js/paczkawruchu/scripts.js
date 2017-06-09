var PaczkaWRuchu = {
    carrierName: 'paczkawruchu',
    prepaidName: 'prepaid',
    codName: 'cod',
    prepaidRadioId: 's_method_paczkawruchu_prepaid',
    codRadioId: 's_method_paczkawruchu_cod',
    prepaidFormId: 'paczkawruchu_prepaid_form',
    codFormId: 'paczkawruchu_cod_form',
    prepaidInputId: 'paczkawruchu_prepaid_input',
    codInputId: 'paczkawruchu_cod_input',
    currentMethod: 'other',

    init: function () {
        this.bindEventHandlers();
        this.prepaidRadio = document.getElementById(this.prepaidRadioId);
        this.codRadio = document.getElementById(this.codRadioId);
        this.handleMethodChange(false);
    },

    bindEventHandlers: function () {
        var self = this;
        document.getElementsByName('shipping_method').forEach(function (element) {
            element.addEventListener('change', function () {
                self.handleMethodChange(true);
            });
        });
    },

    handleMethodChange: function (popup) {
        var oldMethod = this.currentMethod;
        if (this.prepaidRadio.checked) {
            this.currentMethod = 'prepaid';
        } else if (this.codRadio.checked) {
            this.currentMethod = 'cod';
        } else {
            this.currentMethod = 'other';
        }
        if (oldMethod !== this.currentMethod) {
            this.showFormAndMap(popup);
        }
    },

    showFormAndMap: function (popup) {
        if (this.currentMethod === 'prepaid') {
            this.appendFormToElement('prepaid');
            if (popup) {
                jQuery('#pwr_prepaid').click();
            }
        } else {
            var prepaidForm = document.getElementById(this.prepaidFormId);
            prepaidForm && prepaidForm.parentNode.removeChild(prepaidForm);
        }

        if (this.currentMethod === 'cod') {
            this.appendFormToElement('cod');
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
        var cod = (type === 'cod');
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
            }
        });
    }
};