/*!
 * GA Legacy Cookie Parser v0.1.0
 *
 * A workaround for accessing GA data in Universal Analytics environments.
 * https://github.com/spiritix/ga-legacy-cookie-parser
 *
 * Copyright © Matthias Isler <mi@matthias-isler.ch>
 * Licensed under MIT
 */
(function (window, undefined) {
    'use strict';

    function getHostname() {
        var hostname = document.location.hostname;
        hostname = hostname.match(/(([^.\/]+\.[^.\/]{2,3}\.[^.\/]{2})|(([^.\/]+\.)[^.\/]{2,5}))(\/.*)?$/)[1];

        return hostname.toLowerCase();
    }

    function setupAnalytics(hostname) {
        window._gaq = window._gaq || [];

        window._gaq.push(['xxga._setAccount', 'UA-XXXYYYZZZ-1']);
        window._gaq.push(['xxga._setDomainName', hostname]);
        window._gaq.push(['xxga._setAllowLinker', true]);
        window._gaq.push(['xxga._trackPageview']);

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;

        var protocolDomain = 'https:' == document.location.protocol ? 'https://ssl' : 'http://www';
        script.src = (protocolDomain) + '.google-analytics.com/ga.js';

        var firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(script, firstScript);
    }

    function trackLinks(hostname, domains) {
        var links = document.getElementsByTagName('a');

        for (var i = 0; i < links.length; i++) {
            var onClick = links[i].getAttribute('onclick');
            var name = '';

            try {
                name = links[i].hostname.match(/(([^.\/]+\.[^.\/]{2,3}\.[^.\/]{2})|(([^.\/]+\.)[^.\/]{2,5}))(\/.*)?$/)[1];
                name = name.toLowerCase();
            } catch (err) {
                name = links[i].href;
            }

            if (onClick != null) {
                onClick = String(onClick);

                if (onClick.indexOf('_gasf.push') > -1) {
                    continue;
                }
            }

            for (var j = 0; j < domains.length; j++) {
                if (name != hostname && name.indexOf(domains[j]) != -1 && name.indexOf('mailto:') == -1) {

                    links[i].setAttribute('onclick',
                        '' + ((onClick != null) ? onClick + '; ' : '') +
                        "_gaq.push(['sfga._link', '" + links[i].href + "']); return false;"
                    );
                }
            }
        }
    }

    function parseCookies() {
        var cookies = {
            utma: {},
            utmb: {},
            utmc: {},
            utmz: {}
        };

        document.cookie.replace(/(?:^| |;)__(utm[^;$]*)/g, function (_, tagMatch) {
            var type = tagMatch.slice(0, 4);
            var contentStr = tagMatch.slice(5);
            var content = contentStr.split('.');
            var info = cookies[type];

            if (!info) {
                return;
            }

            if (type === 'utma') {
                info.domainHash = content[0];
                info.userId = content[1];
                info.initialVisit = content[2] && Number(content[2]);
                info.previousVisit = content[3] && Number(content[3]);
                info.currentVisit = content[4] && Number(content[4]);
                info.pageViews = content[5] && Number(content[5]);
            }
            else if (type === 'utmb') {
                info.domainHash = content[0];
                info.pageViews = content[1] && Number(content[1]);
                info.outboundClick = content[2] && Number(content[2]);
                info.currentVisit = content[3] && Number(content[3])
            }
            else if (type === 'utmc') {
                info.domainHash = content[0];
            }
            else if (type === 'utmz') {
                info.domainHash = !isNaN(content[0]) ? content[0] : undefined;
                info.lastCookiesUpdate = content[1] && Number(content[1]);
                info.sessionCounter = content[2] && Number(content[2]);
                info.resourceCounter = content[3] && Number(content[3]);

                var utmzParams = contentStr.slice(contentStr.indexOf('utm'));

                if (utmzParams) {
                    utmzParams.split('|').map(function (param) {

                        param = param.split('=');

                        try {
                            info[param[0]] = global.unescape(/^\(.*\)$/.test(param[1]) ?
                                param[1].replace(/^\(?(.*?)\)?$/, '$1') :
                                param[1]);
                        }
                        catch (e) {
                            info[param[0]] = param[1];
                        }
                    });
                }
            }
        });

        return cookies;
    }

    var GAParser = function (domains, limitRelevant) {
        limitRelevant = limitRelevant || true;

        var hostname = getHostname();
        setupAnalytics(hostname);
        trackLinks(hostname, domains);

        this.getInfo = function () {
            var info = parseCookies();

            if (limitRelevant) {
                info = {
                    userId: info.utma.userId,
                    initialVisit: info.utma.initialVisit,
                    source: info.utmz.utmcsr,
                    campaign: info.utmz.utmccn,
                    medium: info.utmz.utmcmd,
                    keywords: info.utmz.utmctr,
                    content: info.utmz.utmcct
                };
            }

            return info;
        };

        this.setCookie = function (name) {
            name = name || '_ga-legacy-tracking';

            var cookie = [
                name,
                '=',
                JSON.stringify(this.getInfo()),
                '; domain=.', window.location.host.toString(),
                '; path=/;'
            ].join('');

            document.cookie = cookie;
        };

        this.addToForm = function (formId, inputName) {
            inputName = inputName || '_ga-legacy-tracking';

            var element1 = document.createElement('input');
            element1.type = 'hidden';
            element1.value = JSON.stringify(this.getInfo());
            element1.name = inputName;

            document.getElementById(formId).appendChild(element1);
        };

        return this;
    };

    if (typeof (exports) !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = GAParser;
        }
        exports.GAParser = GAParser;
    }
    else {
        if (typeof (define) === 'function' && define.amd) {
            define(function () {
                return GAParser;
            });
        } else if (window) {
            window.GAParser = GAParser;
        }
    }

})(typeof window === 'object' ? window : this);
