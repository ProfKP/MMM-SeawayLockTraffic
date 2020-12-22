# MMM-SeawayLockTraffic
Display order of turn information for ships transiting the St Lawrence Seaway Locks.
The information is pulled from the Seaway site https://www.glslw-glvm.com/R2/jsp/R2.jsp?language=E&loc=VT00.jsp.
Module displays information for any one lock.

I am not a programmer or a web designer. This module should be considered a "work in progress". The module is based on the excellent example provided by Mykle1 in his https://github.com/mykle1/MMM-UFO module. 

This is my first attempt at a module and it's early to put it out for the public but the Seaway season ends shortly so after the end of Decemember very little testing can be done.

![sample output](/SeawayTraffic.JPG)

<h2> Installation </h2>
git clone https://github.com/mykle1/MMM-SeawayLockTraffic into the ~/MagicMirror/modules directory.

<h2>Configuration</h2> 

```{
    module: 'MMM-SeawayLockTraffic',
    position: 'bottom_right',
    config: {
                lock: "2305", /*  Select the number of the Lock you want to display traffic for
                        2305 - ST. LAMBERT LOCK
                        2950 - COTE STE. CATHERINE LOCK
                        3730 - LOCK 3 BEAUHARNOIS
                        3775 - LOCK 4 BEAUHARNOIS
                        4690 - SNELL LOCK
                        4765 - EISENHOWER LOCK
                        5260 - IROQUOIS LOCK
                        7315 - WELLAND LOCK 1
                        7480 - WELLAND LOCK 2
                        7690 - WELLAND LOCK 3
                        7825 - WELLAND LOCK 4 EAST
                        7840 - WELLAND LOCK 4 WEST
                        7855 - WELLAND LOCK 5 EAST
                        7870 - WELLAND LOCK 5 WEST
                        7885 - WELLAND LOCK 6 EAST
                        7900 - WELLAND LOCK 6 WEST
                        8005 - WELLAND LOCK 7
                        9040 - WELLAND LOCK 8 */
                useHeader: true,           // false if you don't want a header
                updateInterval: 15*60*1000, //in millseconds
                maxWidth: "250px",
                maxRows: 10 //maximum number of  ships to display
    }
},
```
