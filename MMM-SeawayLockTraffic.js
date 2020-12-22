/* Magic Mirror
 * Module: MMM-SeawayLockTraffic
 *
 * By ProfKP
 *
 */
Module.register("MMM-SeawayLockTraffic", {

    // Module config defaults.
    defaults: {
        lock: "2305",
        useHeader: false, // false if you don't want a header
        header: "Traffic", // Any text you want lock name will be prepended
        maxWidth: "300px",
        rotateInterval: 15 * 60 * 1000,
        animationSpeed: 3000, // fade in and out speed
        initialLoadDelay: 3000,
        retryDelay: 2500,
        updateInterval: 60 * 15 * 1000,
        maxRows: 10 //maximum number of ships to display

    },
    getScripts: function() {
        return ["moment.js", "moment-timezone.js"];
    },
    getStyles: function() {
        return ["MMM-SeawayLockTraffic.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.0",

            // Set locale.
            this.url = this.config.lock;
        this.Traffic = [];
        this.activeItem = 0; // <-- starts rotation at item 0 (see Rotation below)
        this.rotateInterval = null; // <-- sets rotation time (see below)
        this.scheduleUpdate(); // <-- When the module updates (see below)
    },

    getDom: function() {

        // creating the wrapper
        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        // The loading sequence
        if (!this.loaded) {
            wrapper.innerHTML = "Loading Ship Traffic";
            wrapper.classList.add("small");
            return wrapper;
        }
        //trying tables

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("small", "bright");
            var lockName = "Test";
            switch (this.config.lock) {
                case "2305":
                    lockName = "ST. LAMBERT LOCK";
                    break;
                case "2950":
                    lockName = "COTE STE. CATHERINE LOCK";
                    break;
                case "3730":
                    lockName = "LOCK 3 BEAUHARNOIS";
                    break;
                case "3775":
                    lockName = "LOCK 4 BEAUHARNOIS";
                    break;
                case "4690":
                    lockName = "SNELL LOCK";
                    break;
                case "4765":
                    lockName = "EISENHOWER LOCK";
                    break;
                case "5260":
                    lockName = "IROQUOIS LOCK";
                    break;
                case "7315":
                    lockName = "WELLAND LOCK 1";
                    break;
                case "7480":
                    lockName = "WELLAND LOCK 2";
                    break;
                case "7690":
                    lockName = "WELLAND LOCK 3";
                    break;
                case "7825":
                    lockName = "WELLAND LOCK 4 EAST";
                    break;
                case "7840":
                    lockName = "WELLAND LOCK 4 WEST";
                    break;
                case "7855":
                    lockName = "WELLAND LOCK 5 EAST";
                    break;
                case "7870":
                    lockName = "WELLAND LOCK 5 WEST";
                    break;
                case "7885":
                    lockName = "WELLAND LOCK 6 EAST";
                    break;
                case "7900":
                    lockName = "WELLAND LOCK 6 WEST";
                    break;
                case "8005":
                    lockName = "WELLAND LOCK 7";
                    break;
                case "9040":
                    lockName = "WELLAND LOCK 8";
                    break;
                default:
                    lockName = "Lock not listed";
            }
            header.innerHTML = lockName + " " + this.config.header;
            wrapper.appendChild(header);
        }

        var myships = this.Traffic;
        // Create the table
        // creates a <table> element and a <tbody> element
        var tbl = document.createElement("table");
        var tblBody = document.createElement("tbody");
        tblBody.classList.add("xsmall");

        // creater the header row of the table
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        var cellText = document.createTextNode("Vessel Name");
        cell.appendChild(cellText);
        row.appendChild(cell);
        var cell = document.createElement("td");
        var cellText = document.createTextNode("      ETA      ");
        cell.appendChild(cellText);
        row.appendChild(cell);
        var cell = document.createElement("td");
        var cellText = document.createTextNode("Direction");
        cell.appendChild(cellText);
        row.appendChild(cell);
        // add the row to the end of the table body
        tblBody.appendChild(row);

        // creating  cells

        // Create a <td> element and a text node, make the text
        // node the contents of the <td>, and put the <td> at
        // the end of the table row
        var i = 0;
        var j = 0;
        while ((j < this.config.maxRows) && (i < myships.length)) {
            if ((moment(myships[i].ETA, "YYYY-MM-DD HH:mm")) > moment()) {
                // creates a table row
                var row = document.createElement("tr");
                var cell = document.createElement("td");
                var cellText = document.createTextNode(myships[i].Vessel_Name);
                cell.appendChild(cellText);
                row.appendChild(cell);
                var cell = document.createElement("td");
                var cellText = document.createTextNode(myships[i].ETA);
                cell.appendChild(cellText);
                row.appendChild(cell);
                var cell = document.createElement("td");
                var cellText = document.createTextNode(myships[i].Direction);
                cell.appendChild(cellText);
                row.appendChild(cell);
                // add the row to the end of the table body
                tblBody.appendChild(row);
                j++;
            }
            i++;
        };

        // put the <tbody> in the <table>
        tbl.appendChild(tblBody);
        // appends <table> into <body>
        wrapper.appendChild(tbl);
        // sets the border attribute of tbl to 2;
        //tbl.setAttribute("border", "2");
        return wrapper;
    }, // <-- closes the getDom function from above

    // this processes your data
    processTraffic: function(data) {
        this.Traffic = data;
        //console.log("In MMM-SeawayLockTraffic  " + this.Traffic); // uncomment to see if you're getting data (in dev console)
        this.loaded = true;
    },


    // this rotates your data
    scheduleCarousel: function() {
        //    console.log("Carousel of SeawayLockTraffic!"); // uncomment to see if data is rotating (in dev console)
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    // this tells module when to update
    scheduleUpdate: function() {
        setInterval(() => {
            this.getTraffic();
        }, this.config.updateInterval);
        this.getTraffic(this.config.initialLoadDelay);
        var self = this;
    },


    // this asks node_helper for data
    getTraffic: function() {
        this.sendSocketNotification('GET_Traffic', this.url);
    },


    // this gets data from node_helper
    socketNotificationReceived: function(notification, payload) {
        if (notification === "Traffic_RESULT") {
            this.processTraffic(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    }
});
