var copyPaste = require('copy-paste');

function Clipboard() {
    this.listeners = {};
    this.listen();
}

Clipboard.prototype.on = function (event, callback) {
    if (typeof this.listeners[event] === 'undefined') {
        this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
};

Clipboard.prototype.set = function (content) {
    var currentContent = copyPaste.paste();

    if (currentContent != content) {
        copyPaste.copy(content);
    }
};

Clipboard.prototype.trigger = function (event, content) {
    if (typeof this.listeners[event] !== 'undefined') {
        for (var i in this.listeners[event]) {
            if (this.listeners[event].hasOwnProperty(i)) {
                this.listeners[event][i].apply(this, [content]);
            }
        }
    }
};

Clipboard.prototype.listen = function () {
    var me = this,
        content,
        prevContent;

    setInterval(function () {
        content = copyPaste.paste();

        if (content !== prevContent) {
            me.trigger('change', content);
            prevContent = content;
        }

    }, 400);
};

module.exports = new Clipboard();