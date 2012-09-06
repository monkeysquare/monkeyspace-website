monkeyspace.home = {
    init: function() {
        this.initSchedule();
        this.getSpeakers();
        this.showMap();
    },

    showMap: function() {
        var $map = $("#map");
        var venueLatLng = new google.maps.LatLng(42.361291, -71.08119);
        var hotelLatLng = new google.maps.LatLng(42.363007, -71.086060);
        var options = {
            center: venueLatLng,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map($map[0], options);

        var venue = new google.maps.Marker({
            position: venueLatLng,
            map: map,
            title: "Microsoft NERD Center"
        });

        var hotel = new google.maps.Marker({
            position: hotelLatLng,
            map: map,
            title: "Boston Marriott Cambridge"
        });
    },

    displaySpeakers: function(speakers) {
        var speakersArea = $("#speakers-area");
        var body = $("body");
        for (var i = 0; i < speakers.length; i++) {
            var speaker = speakers[i];
            var li = $("<li><a href=\"#\" data-reveal-id=\"" + speaker.name.replace(/ /g, "-").toLowerCase() + "\"><img src=\"" + speaker.headshotUrl + "\" title=\"" + speaker.name + "\" alt=\"" + speaker.name + "\" width=\"159\" height=\"159\" /></a></li>");
            if (((i + 1) % 5) == 0 || (i == speakers.length)) {
                li.addClass("last");
            }
            li.appendTo(speakersArea);

            var modalHtml = "<div id=\"" + speaker.name.replace(/ /g, "-").toLowerCase() + "\" class=\"reveal-modal\">";
            modalHtml += "<img src=\"" + speaker.headshotUrl + "\" width=\"120\" height=\"120\" />";
            modalHtml += "<div class=\"content\">";
            modalHtml += "<h5>" + speaker.name + "</h5>";
            modalHtml += "<p>" + speaker.bio.replace(/\n([ \t]*\n)+/g, "</p><p>") + "</p>";
            if (speaker.twitterHandle) {
                modalHtml += "<a href=\"https://twitter.com/" + speaker.twitterHandle + "\">Follow on Twitter</a>";
            }
            modalHtml += "</div>";
            modalHtml += "</div>";
            var modal = $(modalHtml);
            modal.appendTo(body);
        }
    },

    getSpeakers: function(data) {
        $.ajaxSetup ({
            cache: false
        });

        $.getJSON("/data/speakers.json", this.displaySpeakers);
    },

    initSchedule: function() {
        $('#tabs div').hide(); // Hide all divs
        $('#tabs div:first').show(); // Show the first div
        $('#tabs ul#tab-nav li:first').addClass('active'); // Set the class for active state

        $('#tabs ul#tab-nav li a').click(function(){ // When link is clicked
            $('#tabs ul#tab-nav li').removeClass('active'); // Remove active class from links
            $(this).parent().addClass('active'); //Set parent of clicked link class to active
            var currentTab = $(this).attr('href'); // Set currentTab to value of href attribute
            $('#tabs div').hide(); // Hide all divs
            $(currentTab).show(); // Show div with id equal to variable currentTab
            return false;
        });
    }
};