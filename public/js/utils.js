monkeyspace.utils = {
    pad: function(value) {
        if (value < 10) {
            value = "0" + value;
        }

        return value.toString();
    },

    formatTime: function(beginTime, endTime) {
        var beginHours = this.pad(beginTime.getHours());
        var beginMinutes = this.pad(beginTime.getMinutes());
        var endHours = this.pad(endTime.getHours());
        var endMinutes = this.pad(endTime.getMinutes());
        var time = beginHours + ":" + beginMinutes + " - " + endHours + ":" + endMinutes;
        
        return time;
    },

    getMonth: function(monthNumber) {
        var month = new Array(12);
        month[0] = "Jan";
        month[1] = "Feb";
        month[2] = "Mar";
        month[3] = "Apr";
        month[4] = "May";
        month[5] = "Jun";
        month[6] = "Jul";
        month[7] = "Aug";
        month[8] = "Sep";
        month[9] = "Oct";
        month[10] = "Nov";
        month[11] = "Dec";

        return month[monthNumber];
    },

    getWeekday: function(day) {
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        return weekday[day];
    },
    createRevealId: function(value) {
        return value.replace(/ /g, "-").toLowerCase();
    }
};