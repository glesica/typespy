/*
 * typespy.js
 * Author: George Lesica <george@lesica.com>
 * Description: Allows logging to be performed on an HTML <textarea>. Data
 * collected include all key presses (down and up) along with a time stamp and
 * modifier key information.
 */

TYPESPY = {}

TYPESPY.Logger = function($input, $user) {
    var self = this;
    
    this.log = [];
    this.inputElement = $($input);
    this.userElement = $($user);
    
    // Bind events to the text area
    this.inputElement.keyup(function(evt) {
        self.capture.call(self, evt);
    });
    this.inputElement.keypress(function(evt) {
        self.capture.call(self, evt);
    });

    // Temporary place to store events between keydown and keyup
    this.tempLog = [];
    
    return this;
};

TYPESPY.Logger.prototype.capture = function(evt) {
    if (evt.type === 'keypress') {
        // Cache the keypress until we get the keyup
        var upperChar = (String.fromCharCode(evt.charCode)).toUpperCase();
        this.tempLog[upperChar.charCodeAt(0)] = evt;
    } else {
        // Only record an event if there was a preceding keypress event, which
        // lets us exclude special keys (since they don't trigger keypress
        // events.
        if (this.tempLog.hasOwnProperty(evt.keyCode)) {
            // We have a complete log record now
            var prev = this.tempLog[evt.keyCode];
            delete this.tempLog[evt.keyCode];
            this.log.push({
                character    : String.fromCharCode(prev.charCode),
                timeDown     : prev.timeStamp,
                timeUp       : evt.timeStamp
            });
        }
    }
};

TYPESPY.Logger.prototype.clearInput = function() {
    this.inputElement.val('');
};

TYPESPY.Logger.prototype.clearLog = function() {
    this.log = [];
};

TYPESPY.Logger.prototype.asObject = function() {
    return {
        user: this.userElement.val(),
        data: this.log
    };
};

TYPESPY.Logger.prototype.asJSON = function() {
    return JSON.stringify(this.asObject());
};
