monkeyspace.home = {
    init: function() {
        this.getSpeakers();
        this.getSessions();
        this.getSchedule();
        this.showMap();
        this.showVideos();
    },

    showVideos: function() {
        $('#intro-video-nav a').bind('click', function(e) {
            e.preventDefault();
            $('#intro-video-player div').hide(); // hide all Vimeo embeds
            $('#intro-video-nav a').removeClass('selected'); // deselect all navigation thumbnails
            $($(this).attr('href')).show(); // show the Vimeo embed for the clicked link
            $(this).addClass('selected'); // select the clicked link
        });
    },

    showMap: function() {
        var $map = $("#map");
        //var venueLatLng = new google.maps.LatLng(42.361291, -71.08119);
        //var hotelLatLng = new google.maps.LatLng(42.363007, -71.086060);
        //var venueLatLng = new google.maps.LatLng(41.859923,-87.627322);
        //var hotelLatLng = new google.maps.LatLng(41.873364,-87.624378);
        var venueLatLng = new google.maps.LatLng(53.3321, -6.234201);

        var options = {
            center: venueLatLng,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map($map[0], options);

        //var venue = new google.maps.Marker({
        //    position: venueLatLng,
        //    map: map,
        //    title: "Microsoft NERD Center"
        //});

        //var venue = new google.maps.Marker({
        //    position: venueLatLng,
        //    map: map,
        //    title: "Columbia College"
        //});

        var venue = new google.maps.Marker({
            position: venueLatLng,
            map: map,
            title: "Ballsbridge Hotel"
        });

        //var hotel = new google.maps.Marker({
        //    position: hotelLatLng,
        //    map: map,
        //    title: "Boston Marriott Cambridge"
        //});

        //var hotel = new google.maps.Marker({
        //    position: hotelLatLng,
        //    map: map,
        //    title: "Renaissance Blackstone Chicago Hotel"
        //});
    },

    displaySchedule: function(schedule) {
        var scheduleArea = $("#tabs");

        if (schedule) {
            var ul = $("<ul id=\"tab-nav\"></ul>");
            for (var i = 0; i < schedule.days.length; i++) {
                var day = schedule.days[i];
                var date = monkeyspace.utils.createEstDate(day.date);
                var li = $("<li><a href=\"#" + monkeyspace.utils.getWeekday(date.getDay()).toLowerCase() + "\">Day " + (i + 1) + "</a></li>");
                li.appendTo(ul);
            }
            ul.appendTo(scheduleArea);

            for (var i = 0; i < schedule.days.length; i++) {
                var day = schedule.days[i];
                var date = monkeyspace.utils.createEstDate(day.date);
                var dayDivWrapper = $("<div id=\"" + monkeyspace.utils.getWeekday(date.getDay()).toLowerCase() + "\"></div>");
                var dayTable = $("<table></table>");

                var headerRow = $("<tr><th class=\"col1\">Time</th><th class=\"col2\">Talk</th><th class=\"col3\">Speaker</th><th class=\"col4\">Location</th></tr>");
                headerRow.appendTo(dayTable);

                var previousSessionTime = "";
                for (var j = 0; j < day.sessions.length; j++) {
                    var session = day.sessions[j];
                    var begins = monkeyspace.utils.createEstDate(session.begins);
                    var ends = monkeyspace.utils.createEstDate(session.ends);

                    var dataRow = $("<tr></tr>");

                    var timeColumn = $("<td class=\"col1\"></td>");
                    var thisSessionTime = monkeyspace.utils.formatTime(begins, ends);
                    if (thisSessionTime != previousSessionTime) {
                        timeColumn.html(monkeyspace.utils.formatTime(begins, ends));
                        previousSessionTime = thisSessionTime;
                    }
                    else {
                        timeColumn.addClass("no-border");
                    }

                    var titleColumn = $("<td class=\"col2\"><a href=\"#\" data-reveal-id=\"session-" + session.id + "\">"  + session.title + "</a></td>");

                    var speakerNameColumn = $("<td class=\"col3\"></td>");
                    var speakers = "";
                    for (var k = 0; k < session.speakers.length; k++) {
                        if (k != 0) {
                            speakers += "<br/>";
                        }
                        speakers += "<a href=\"#\" data-reveal-id=\"" + monkeyspace.utils.createRevealId(session.speakers[k].name.replace("'", "")) + "\">" + session.speakers[k].name + "</a>";
                        speakerNameColumn.html(speakers);
                    }

                    var locationColumn = $("<td class=\"col4\">" + session.location + "</td>");
                    timeColumn.appendTo(dataRow);
                    titleColumn.appendTo(dataRow);
                    speakerNameColumn.appendTo(dataRow);
                    locationColumn.appendTo(dataRow);
                    dataRow.appendTo(dayTable);
                }

                dayTable.appendTo(dayDivWrapper);
                dayDivWrapper.appendTo(scheduleArea);
            }

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
        else {
            var p = $("<p>The schedule will be released shortly after the call for speakers is closed.</p>");
            p.appendTo(scheduleArea.parent());
        }
    },

    getSchedule: function(data) {
        $.ajaxSetup ({
            cache: false
        });

        var uri = monkeyspace.utils.parseUri(document.URL);
        var scheduleUri = uri.pathname + "data/schedule.json";

        $.getJSON(scheduleUri, this.displaySchedule);
    },

    displaySessions: function(sessions) {
        if (sessions) {
            var body = $("body");
            for (var i = 0; i < sessions.length; i++) {
                var session = sessions[i];

                var modalHtml = "<div id=\"session-" + session.id + "\" class=\"reveal-modal\">";
                modalHtml += "<div class=\"content\">";
                modalHtml += "<h5>" + session.title + "</h5>";
                modalHtml += "<p>" + session.abstract.replace(/\n([ \t]*\n)+/g, "</p><p>") + "</p>";

                if (session.vimeoId && session.vimeoId != "") {
                    modalHtml += "<iframe src=\"http://player.vimeo.com/video/" + session.vimeoId + "\" style=\"width: 500px;height: 281px\" frameborder=\"0\" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>";
                }

                modalHtml += "</div>";
                modalHtml += "</div>";
                var modal = $(modalHtml);
                modal.appendTo(body);

                var plink = $('#session-' + session.id + ' div.content p:contains("http")');
                plink.html('<a href="' + plink.text() + '">' + plink.text() + '<a>');
            }
        }
    },

    getSessions: function() {
        $.ajaxSetup ({
            cache: false
        });

        var uri = monkeyspace.utils.parseUri(document.URL);
        var sessionsUri = uri.pathname + "data/sessions.json";

        $.getJSON(sessionsUri, this.displaySessions);
    },

    displaySpeakers: function(speakers) {
        var speakersArea = $("#speakers-area");

        if (speakers) {
            var body = $("body");
            for (var i = 0; i < speakers.length; i++) {
                var speaker = speakers[i];
                var li = $("<li><a href=\"#\" data-reveal-id=\"" + monkeyspace.utils.createRevealId(speaker.name.replace("'", "")) + "\"><img src=\"" + speaker.headshotUrl + "\" title=\"" + speaker.name + "\" alt=\"" + speaker.name + "\" width=\"159\" height=\"159\" /></a></li>");
                if (((i + 1) % 5) == 0 || (i == speakers.length)) {
                    li.addClass("last");
                }
                li.appendTo(speakersArea);

                var modalHtml = "<div id=\"" + monkeyspace.utils.createRevealId(speaker.name.replace("'", "")) + "\" class=\"reveal-modal\">";
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
        }
        else {
            $("#speakers-area").remove();
            var speakerSectionWrapper = $("#speakers").children(".wrapper");
            //var p = $("<p>Call for proposals is now open, please view our <a href=\"/call\">CFP</a> on how to submit your proposal.</p>");
            var p = $("<p>Call for proposals is now closed. We'll announce the lineup soon!</p>");
            p.appendTo(speakerSectionWrapper);
        }
    },

    getSpeakers: function(data) {
        $.ajaxSetup ({
            cache: false
        });

        var uri = monkeyspace.utils.parseUri(document.URL);
        var speakersUri = uri.pathname + "data/speakers.json";

        $.getJSON(speakersUri, this.displaySpeakers);
    }
};