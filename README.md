# GA Legacy Cookie Parser

Once upon a time, people used to parse Google Analytics cookies to retrieve and store user and campaign data in their 
database. Unfortunately, with Universal Analytics (UA), it's not possible to retrieve the GA cookie values anymore, 
since Universal Analytics script does not store relevant data on a cookie but processes it on server side.

This script provides a replacement for environments using Universal Analytics. It includes the old `ga.js`, makes sure 
it runs smoothly besides `analytics.js`, replicates several removed GA functions and provides an interface for 
accessing the data.

**Attention:**
- This script is based on the deprecated `ga.js`, it is very likely that some day it will stop working. 
Nevertheless, it will probably work for some more years since many websites are still actively using old GA versions.
- This script possibly violates Google's TOC. **Use at your own risk.**

If you are looking for a "compliant" solution, have a look at [this](https://github.com/dm-guy/utm-alternative/)
library, it replicates the tracking functionality of Google Analytics. 

# Constructor

* `new GAParser([domains], trackingId = 'UA-XXXYYYZZZ-1', limitRelevant = true)`

Returns a new instance.
- `domains` must be an array of all domains you want to include in tracking.
- `trackingId` can be used to link the legacy tracking with an actual GA property, but isn't required at all. Make sure to not use the same property for Universal Analytics and legacy tracking, as this will corrupt the collected data.

# Methods

* `getInfo()`

Returns an object containing the parsed information.

```
{
    userId: 'User ID',
    initialVisit: 'Initial visit timestamp',
    source: 'Source',
    campaign: 'Campaign,
    medium: 'Medium',
    keywords: 'Keywords',
    content: 'Content'
}
```

* `setCookie(name = '_ga-legacy-tracking', overrideExisting = true)`

Sets a cookie containing a JSON string with parsed information.

* `addToForm(formId, inputName = '_ga-legacy-tracking')`

Adds a hidden input to the specified form containing a JSON string with parsed information.

# Usage

```
<!-- Add before </body> for all domains you want to include in tracking -->
<script src="https://cdn.jsdelivr.net/gh/spiritix/ga-legacy-cookie-parser@0.3.0/dist/ga-legacy-cookie-parser.min.js"></script>
<script>
    var parser = new GAParser(['mydomain.com', 'second.com']);
    console.log(parser.getInfo()); // Output info to console
    parser.setCookie(); // Set info to cookie
    parser.addToForm('test-form'); // Add info to form as hidden input
</script>
```

## Usage with Google Ads (AdWords)

Since Google Ads nowadays uses a URL parameter called ``gclid`` which can't be parsed on runtime by ``analytics.js``, you'll need to [setup manual tagging](https://docs.heapanalytics.com/docs/manual-and-autotagging-for-adwords) if you like your Google Ads data to be included in the information provided by this library.

# License

GA Legacy Cookie Parser is free software distributed under the terms of the MIT license.
