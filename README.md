# GA Legacy Cookie Parser

Once upon a time, people used to parse Google Analytics cookies to retrieve and store user and campaign data in their 
database. Unfortunately, with Universal Analytics (UA), it was not possible to retrieve the GA cookie values anymore, 
since Universal Analytics script does not store relevant data on a cookie but processes it on server side.

This script provides a replacement for environments using Universal Analytics. It includes the old `ga.js`, makes sure 
it runs smoothly besides `analytics.js`, replicates several removed GA functions and provides an interface for 
accessing the data.

**Attention:**
- This script is based on the deprecated `ga.js`, it is very likely that some day it will stop working. 
Nevertheless, it will probably work for some more years since many websites are still actively using old GA versions.
- While I am not a lawyer myself, I suspect that using this script does violate most of Google's TOC as well as most 
countries' data protection laws. I would strongly recommend to inform your users about your tracking activities and 
perform a risk assessment.

If you are looking for a "compliant" solution, have a look at [this](https://github.com/dm-guy/utm-alternative/)
library, it replicates the tracking functionality of Google Analytics. 

# Constructor

# Methods

# Usage

# License

GA Legacy Cookie Parser is free software distributed under the terms of the MIT license.