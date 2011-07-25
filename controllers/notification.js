var MsgboyNotification = function() {
    this.messages = [],
    this.started = false,
    this.mouse_over = false
    this.current_view = null
    
    this.rotate = function() {
        setTimeout(function() {
            if(!this.mouse_over) {
                if(this.current_view) {
                    this.current_view.remove();
                }
                this.show_next_message();
            }
            this.rotate();
        }.bind(this), 8000);
    },
    
    this.show_next_message= function() {
        var message = this.messages.pop();
        if (!message) {
            chrome.extension.sendRequest({
                signature: "close",
                params: null
            }, function (response) {
                window.close();
            });
        } else {
            window.focus(); // Put this alert in front!
            this.current_view = new MessageView({
                model: message
            });

            message.bind("up-ed", function() {
                this.current_view.remove();
                this.go_to_message(message);
                this.show_next_message();
            }.bind(this));

            message.bind("down-ed", function() {
                this.current_view.remove();
                this.show_next_message();
            }.bind(this));

            this.current_view.bind("clicked", function () {
                this.current_view.remove();
                this.show_next_message();
            }.bind(this));

            this.current_view.bind("rendered", function () {
                $(this.current_view.el).appendTo($("body"));
            }.bind(this));

            this.current_view.render(); // builds the HTML
        }
    },
    
    this.go_to_message = function(model) {
        chrome.extension.sendRequest({
            signature: "tab",
            params: {
                url: this.current_view.model.main_link(),
                selected: true
            }
        });
    };
    
};