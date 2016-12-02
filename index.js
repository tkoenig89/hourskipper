module.exports = SkipHours;

/**
 * Wrapps the provided function inside the returned function. The provided function will only be called when the current hour matches the configured ones.
 * @param {Function} fn
 * @param {{hours: string}} opts
 * @returns {Function}
 */
function SkipHours(fn, opts) {
    opts = opts || {};
    var hoursArray = parseTime(opts);

    return (...args) => {
        var result = { isCalled: false, returnValue: null };
        if (testIfCallingShouldHappen()) {
            result.isCalled = true;
            result.returnValue = fn(...args);
            return result;
        } else {
            return result;
        }
    };

    /**
     * Tests if calling the wrapped function is allowed at the moment
     */
    function testIfCallingShouldHappen() {
        var now = new Date();
        return hoursArray[now.getHours()]
    }

    /**
     * Parses the given options into an array of hours. Hours where calling the function is allowed are set to true.
     * Possible values for opts.hours are: '1-12'; '1,2,3,7,23' or '!5,12-15'. Where '!' is used to only define hours, where nothing should happen.
     * @param {{hours:string}} opts
     * @returns {[boolean]}
     */
    function parseTime(opts) {
        var hours = opts.hours;
        if (hours) {
            let inverse = hours.startsWith("!");
            let hoursArray = initHours(inverse);

            let hour_elements = hours.replace("!", "").split(",");
            for (let i = 0; i < hour_elements.length; i++) {
                let hour_elem = hour_elements[i];
                if (hour_elem.indexOf("-") > 0) {
                    //range
                    var hour_elem_split = hour_elem.split("-");
                    let min = parseInt(hour_elem_split[0]), max = parseInt(hour_elem_split[1]);
                    for (var j = min; j <= max; j++) {
                        hoursArray[j] = !inverse;
                    }
                } else {
                    //single value
                    var h = parseInt(hour_elem);
                    hoursArray[h] = !inverse;
                }
            }
            return hoursArray;
        }
    }

    /**
     * Creates a 24 hour array with preset boolean values.
     * @param {boolean} inverse set to true if the function should be called each hour by default.
     * @returns {[boolean]}
     */
    function initHours(inverse) {
        inverse = inverse || false;
        var a = [];
        for (let i = 0; i < 24; i++) {
            a[i] = inverse;
        }
        return a;
    }
}
