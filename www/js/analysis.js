/*
 * analysis.js
 * Author: George Lesica <george@lesica.com>
 * Description: Code to do some basic analysis on the typing data collected and
 * generate some reports and such for the user.
 */

TYPESPY.Analyzer = function(logger) {
    this.logger = logger;
    this.log = logger.log;
    this.logLength = this.log.length;

    // Sort the log various ways -------------------------------------------

    // Sorted by key down time
    this.logByDownTime = this.log.sort(function(a, b) {
        if (a.downTime < b.downTime) {
            return -1;
        }
        if (b.downTime < a.downTime) {
            return 1;
        }
        return 0;
    });

    // Bunch of averages ---------------------------------------------------
    
    // Average time keys were held down
    this.overallAverage = logger.log.reduce(function(val, next) {
        return val + next.duration;
    }, 0) / logger.log.length;

    // Slice and dice ------------------------------------------------------

    // Key press matrix - this is the time between keypresses for various keys
    // that occurred one after the other in the sample. So, for example, if the
    // sequence 'at' occurred several times, the corresponding matrix element
    // will contain the average amount of time between the keypress for 'a' and
    // the keypress for 't'.
    this.keyPressMatrix = [];
    var counts = [];
    for (var i = 0; i < this.logLength - 1; i++) {
        var currentEntry = this.logByDownTime[i];
        var ckc = currentEntry.keyCode;
        var cdt = currentEntry.downTime;
        var nextEntry = this.logByDownTime[i + 1];
        var nkc = nextEntry.keyCode;
        var ndt = nextEntry.downTime;

        if (this.keyPressMatrix[ckc] === undefined) {
            this.keyPressMatrix[ckc] = [];
            counts[ckc] = [];
        }
        if (this.keyPressMatrix[ckc][nkc] === undefined) {
            this.keyPressMatrix[ckc][nkc] = ndt - cdt;
            counts[ckc][nkc] = 1;
        } else {
            this.keyPressMatrix[ckc][nkc] += ndt - cdt;
            counts[ckc][nkc] += 1;
        }
    }
    for (var i = 0; i < this.logLength - 1; i++) {
        var ckc = this.logByDownTime[i].keyCode;
        var nkc = this.logByDownTime[i + 1].keyCode;

        this.keyPressMatrix[ckc][nkc] /= counts[ckc][nkc];
    }
};


TYPESPY.Visualizer = function(logger, analyzer) {
    this.logger = logger;
    this.analyzer = analyzer;
};

TYPESPY.Visualizer.prototype.matrixPlot = function(tid) {
    var target = d3.select(tid);
    var analyzer = this.analyzer;

    target
    .append('table.matrix-plot')
    .selectAll('tr')
    .data(analyzer.keyPressMatrix)
    .enter().append('tr')
    .selectAll('td')
    .data(function(d) {
        return d;
    })
    .enter().append('td')
    .style('border', '1px black solid')
    .style('padding', '10px')
    .text(function(d) {
        return d;
    })
    .style('font-size', '12px');
};
