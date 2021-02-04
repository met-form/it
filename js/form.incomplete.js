
(function($) {
    app.incompleteOrder = {
        
        timer: null,
        lock: null,
        data: {},
        currentData: {},
        currentForm: null,
        
        processForm: function(form) {
            
            this.currentForm = form;
            
            var phoneField = $(form).find('input[name=phone]');
            var nameField = $(form).find('input[name=name]');
            var offerField = $(form).find('[name=offer]');
            
            if (!phoneField.length || !offerField.length) {
                // offer and phone fields are essential for correct lead submission
                return;
            }
                    
            var errors = orderValidator.validate(form);
            
            // don't really need to check customer name, phone is enough
            delete errors.name;
            
            errors = orderValidator.getErrorsList(errors);
            if (errors.length) {
                return;
            }
            
            this.data.offer = offerField.val();
            this.data.name = nameField.val();
            this.data.phone = phoneField.val();
            
            clearTimeout(this.timer);
            this.timer = setTimeout($.proxy(this.send, this), 1000);
        },
        
        send: function() {

            // var sms_code_confirm = $('#sms_code_confirm').val();
            // if ( sms_code_confirm ) {
            //     return;
            // }
            
            var form = this.currentForm;
            if (!form) {
                return;
            }
            
            form = $(form);
            
            var offerChanged = this.data.offer != this.currentData.offer;
            var nameChanged = this.data.name != this.currentData.name;
            var phoneChanged = this.data.phone != this.currentData.phone;
            
            var anythingChanged = offerChanged || nameChanged || phoneChanged;
            
            if (!anythingChanged) {
                return;
            }
            
            if (this.lock) {
                return;
            }
            
            this.lock = true;
            
            $.extend(this.currentData, this.data);
            
            var formData = {};
            
            $.each(form.serializeArray(), function(idx, field) {
                formData[field.name] = field.value;
            });
            
            $.extend(formData, this.currentData, {
                submitted: '', 
                lead_token: app.leadToken
            });
            
            console.log('test');

            $.ajax({
                url: window.location.href,
                method: 'POST',
                data: formData,
                context: this
            }).done(function(data) {
                console.log('done');
            }).always(function() {
                this.lock = false;
            });
        }

    }
})(app.jq);
