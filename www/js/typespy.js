/*
 * typespy.js
 * Author: George Lesica <george@lesica.com>
 * Description: Allows logging to be performed on an HTML <textarea>. Data
 * collected include all key presses (down and up) along with a time stamp and
 * modifier key information.
 */

TYPESPY = {}

TYPESPY.toChar = function(evt) {
    if (evt.keyCode >= 65 && evt.keyCode <= 90) {
        if (evt.shiftKey) {
            return String.fromCharCode(evt.keyCode).toUpperCase();
        } else {
            return String.fromCharCode(evt.keyCode).toLowerCase();
        }
    }
    var repr;
    switch (evt.keyCode) {
        case 8:
            repr = 'BS';
            break;
        case 13:
            repr = 'NL';
            break;
        case 32:
            repr = ' ';
            break;
        case 48:
            if (evt.shiftKey) {
                repr = ')';
            } else {
                repr = '0';
            }
            break;
        case 49:
            if (evt.shiftKey) {
                repr = '!';
            } else {
                repr = '1';
            }
            break;
        case 50:
            if (evt.shiftKey) {
                repr = '@';
            } else {
                repr = '2';
            }
            break;
        case 51:
            if (evt.shiftKey) {
                repr = '#';
            } else {
                repr = '3';
            }
            break;
        case 52:
            if (evt.shiftKey) {
                repr = '$';
            } else {
                repr = '4';
            }
            break;
        case 53:
            if (evt.shiftKey) {
                repr = '%';
            } else {
                repr = '5';
            }
            break;
        case 54:
            if (evt.shiftKey) {
                repr = '^';
            } else {
                repr = '6';
            }
            break;
        case 55:
            if (evt.shiftKey) {
                repr = '&';
            } else {
                repr = '7';
            }
            break;
        case 56:
            if (evt.shiftKey) {
                repr = '*';
            } else {
                repr = '8';
            }
            break;
        case 57:
            if (evt.shiftKey) {
                repr = '(';
            } else {
                repr = '9';
            }
            break;
        case 96:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
            repr = (evt.keyCode - 96).toString();
            break;
        case 106:
            repr = '*';
            break;
        case 107:
            repr = '+';
            break;
        case 109:
            repr = '-';
            break;
        case 110:
            repr = '.';
            break;
        case 111:
            repr = '/';
            break;
        case 186:
            if (evt.shiftKey) {
                repr = ':';
            } else {
                repr = ';';
            }
            break;
        case 187:
            if (evt.shiftKey) {
                repr = '+';
            } else {
                repr = '=';
            }
            break;
        case 188:
            if (evt.shiftKey) {
                repr = '<';
            } else {
                repr = ',';
            }
            break;
        case 189:
            if (evt.shiftKey) {
                repr = '_';
            } else {
                repr = '-';
            }
            break;
        case 190:
            if (evt.shiftKey) {
                repr = '>';
            } else {
                repr = '.';
            }
            break;
        case 191:
            if (evt.shiftKey) {
                repr = '?';
            } else {
                repr = '/';
            }
            break;
        case 192:
            if (evt.shiftKey) {
                repr = '~';
            } else {
                repr = '`';
            }
            break;
        case 219:
            if (evt.shiftKey) {
                repr = '{';
            } else {
                repr = '[';
            }
            break;
        case 220:
            if (evt.shiftKey) {
                repr = '|';
            } else {
                repr = '\\';
            }
            break;
        case 221:
            if (evt.shiftKey) {
                repr = '}';
            } else {
                repr = ']';
            }
            break;
        case 222:
            if (evt.shiftKey) {
                repr = '"';
            } else {
                repr = "'";
            }
            break;
    }
    return repr;
}

TYPESPY.Logger = function($input, $user) {
    var self = this;
    
    this.log = [];
    this.inputElement = $($input);
    this.userElement = $($user);
    
    // Bind events to the text area
    this.inputElement.keyup(function(evt) {
        self.capture.call(self, evt);
    });
    this.inputElement.keydown(function(evt) {
        self.capture.call(self, evt);
    });

    // Temporary place to store events between keydown and keyup
    this.tempLog = {};
    
    return this;
};

TYPESPY.Logger.prototype.capture = function(evt) {
    var seenChar = TYPESPY.toChar(evt);
    if (seenChar === undefined) {
        return;
    }
    if (evt.type === 'keydown') {
        // Cache the keypress until we get the keyup
        this.tempLog[seenChar] = evt;
    } else {
        // Only record an event if there was a preceding keypress event, which
        // lets us exclude special keys (since they don't trigger keypress
        // events.
        if (this.tempLog.hasOwnProperty(seenChar)) {
            // We have a complete log record now
            var prev = this.tempLog[seenChar];
            delete this.tempLog[seenChar];
            console.log('TYPESPY: Saw character "' + seenChar + '"');
            this.log.push({
                character    : seenChar,
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
