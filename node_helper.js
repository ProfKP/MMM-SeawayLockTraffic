/* Magic Mirror
 * Module: MMM-SeawayLockTraffic
 *
 * By  ProfKP
 *
 */
const NodeHelper = require('node_helper');
const http = require('http');
//const cheerio = require('cheerio');
const jsdom = require('jsdom');
const {
    JSDOM
} = jsdom;

function tableToJson(table) {
    var data = [];

    // first row needs to be headers
    var headers = [];
    //need to add headers manually becasue there are in two rows of a separate table
    headers[0] = "Vessel_Name";
    headers[1] = "Other_Vessels_With";
    headers[2] = "Blank";
    headers[3] = "Direction";
    headers[4] = "Last_Loc";
    headers[5] = "ATA";
    headers[6] = "ETA";
    headers[7] = "Next_Loc";
    // go through cells
    for (var i = 0; i < table.rows.length; i++) {
        var tableRow = table.rows[i];
        var rowData = {};
        for (var j = 0; j < tableRow.cells.length; j++) {
            rowData[headers[j]] = tableRow.cells[j].textContent;
        }
        data.push(rowData);
    }
    return data;
};

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getTraffic: function(url) {
        var self = this;
        console.log("node_helper recd " + url);
        var data = 'ORDER=5260&hiddenName=';
        var options = {
            host: 'www.glslw-glvm.com',
            port: 80,
            path: '/R2/jsp/VT00.jsp?language=E',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data)
            }
        };
        var mydata = '';
        var req = http.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(d) {
                mydata += d;
            });
            res.on('end', function() {
                //console.log(mydata);
                const dom = new JSDOM(mydata);
                console.log("this should be the json sting  " + JSON.stringify(tableToJson(dom.window.document.getElementsByTagName("table")[5])));
                self.sendSocketNotification("Traffic_RESULT", tableToJson(dom.window.document.getElementsByTagName("table")[5]));
                console.log(" results have been returned");
            });
        });
        req.write(data);
        req.end();
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_Traffic') {
            this.getTraffic(payload);
        }
    }
});
