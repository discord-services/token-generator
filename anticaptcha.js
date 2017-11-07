var Anticaptcha = function(clientKey) {
    return new function(clientKey) {
        this.params = {
            host: 'api.anti-captcha.com',
            port: 80,
            clientKey: clientKey,

            // reCAPTCHA 2
            websiteUrl: null,
            websiteKey: null,
            websiteSToken: null,
            proxyType: 'http',
            proxyAddress: null,
            proxyPort: null,
            proxyLogin: null,
            proxyPassword: null,
            userAgent: '',

            // image
            phrase: null,
            case: null,
            numeric: null,
            math: null,
            minLength: null,
            maxLength: null,

            softId: null,
            languagePool: null
        };

        var connectionTimeout = 20,
            firstAttemptWaitingInterval = 5,
            normalWaitingInterval = 2;

        this.getBalance = function (cb) {
            var postData = {
                clientKey: this.params.clientKey
            };

            this.jsonPostRequest('getBalance', postData, function (err, jsonResult) {
                if (err) {
                    return cb(err, null, jsonResult);
                }

                cb(null, jsonResult.balance, jsonResult);
            });
        };

        this.createTask = function (cb, type, taskData) {
            type = typeof type == 'undefined' ? 'NoCaptchaTask' : type;
            var taskPostData = this.getPostData(type);
            taskPostData.type = type;

            // Merge incoming and already fetched taskData, incoming data has priority
            if (typeof taskData == 'object') {
                for (var i in taskData) {
                    taskPostData[i] = taskData[i];
                }
            }

            var postData = {
                clientKey: this.params.clientKey,
                task: taskPostData,
                softId: this.params.softId !== null ? this.params.softId : 0
            };

            if (this.params.languagePool !== null) {
                postData.languagePool = this.params.languagePool;
            }

            this.jsonPostRequest('createTask', postData, function (err, jsonResult) {
                if (err) {
                    return cb(err, null, jsonResult);
                }

                // Task created
                var taskId = jsonResult.taskId;

                cb(null, taskId, jsonResult);
            });
        };

        this.createTaskProxyless = function (cb) {
            this.createTask(cb, 'NoCaptchaTaskProxyless');
        };

        this.createImageToTextTask = function (taskData, cb) {
            this.createTask(cb, 'ImageToTextTask', taskData);
        };

        this.getTaskSolution = function (taskId, cb, currentAttempt, tickCb) {
            currentAttempt = currentAttempt || 0;

            var postData = {
                clientKey: this.params.clientKey,
                taskId: taskId
            };

            var waitingInterval;
            if (currentAttempt == 0) {
                waitingInterval = firstAttemptWaitingInterval;
            } else {
                waitingInterval = normalWaitingInterval;
            }

            console.log('Waiting %s seconds', waitingInterval);

            var that = this;

            setTimeout(function() {
                that.jsonPostRequest('getTaskResult', postData, function (err, jsonResult) {
                    if (err) {
                        return cb(err, null, jsonResult);
                    }

                    if (jsonResult.status == 'processing') {
                        // Every call I'm ticki-ing
                        if (tickCb) {
                            tickCb();
                        }
                        return that.getTaskSolution(taskId, cb, currentAttempt + 1, tickCb);
                    } else if (jsonResult.status == 'ready') {
                        return cb(null, typeof jsonResult.solution.gRecaptchaResponse != 'undefined' ? jsonResult.solution.gRecaptchaResponse : jsonResult.solution.text, jsonResult);
                    }
                });
            }, waitingInterval * 1000);
        };

        this.getPostData = function(type) {
            switch (type) {
                case 'ImageToTextTask':
                    return {
                        phrase:         this.params.phrase,
                        case:           this.params.case,
                        numeric:        this.params.numeric,
                        math:           this.params.math,
                        minLength:      this.params.minLength,
                        maxLength:      this.params.maxLength
                    };
                    break;
                case 'NoCaptchaTaskProxyless':
                    return {
                        websiteURL:     this.params.websiteUrl,
                        websiteKey:     this.params.websiteKey,
                        websiteSToken:  this.params.websiteSToken
                    };
                    break;
                default: // NoCaptchaTask
                    return {
                        websiteURL:     this.params.websiteUrl,
                        websiteKey:     this.params.websiteKey,
                        websiteSToken:  this.params.websiteSToken,
                        proxyType:      this.params.proxyType,
                        proxyAddress:   this.params.proxyAddress,
                        proxyPort:      this.params.proxyPort,
                        proxyLogin:     this.params.proxyLogin,
                        proxyPassword:  this.params.proxyPassword,
                        userAgent:      this.params.userAgent
                    };
            }


        };

        this.jsonPostRequest = function(methodName, postData, cb) {
            if (typeof process === 'object' && typeof require === 'function') { // NodeJS
                var http = require('http');

                // http request options
                var options = {
                    hostname: this.params.host,
                    port: this.params.port,
                    path: '/' + methodName,
                    method: 'POST',
                    headers: {
                        'accept-encoding':  'gzip,deflate',
                        'content-type':     'application/json; charset=utf-8',
                        'accept':           'application/json',
                        'content-length':   Buffer.byteLength(JSON.stringify(postData))
                    }
                };

                // console.log(options);
                // console.log(JSON.stringify(postData));

                var req = http.request(options, function(response) { // on response
                    var str = '';

                    // another chunk of data has been recieved, so append it to `str`
                    response.on('data', function (chunk) {
                        str += chunk;
                    });

                    // the whole response has been recieved, so we just print it out here
                    response.on('end', function () {
                        // console.log(str);

                        try {
                            var jsonResult = JSON.parse(str);
                        } catch (err) {
                            return cb(err);
                        }

                        if (jsonResult.errorId) {
                            return cb(new Error(jsonResult.errorDescription, jsonResult.errorCode), jsonResult);
                        }

                        return cb(null, jsonResult);
                    });
                });

                // send post data
                req.write(JSON.stringify(postData));
                req.end();

                // timeout in milliseconds
                req.setTimeout(connectionTimeout * 1000);
                req.on('timeout', function() {
                    console.log('timeout');
                    req.abort();
                });

                // After timeout connection throws Error, so we have to handle it
                req.on('error', function(err) {
                    console.log('error');
                    return cb(err);
                });

                return req;
            } else if ((typeof window !== 'undefined' || typeof chrome === 'object') && typeof $ == 'function') { // in browser or chrome extension with jQuery
                $.ajax(
                      (window.location.protocol == 'https:' ? 'https:' : 'http:') + '//'
                    + this.params.host
                    + (window.location.protocol != 'https:' ? ':' + this.params.port : '')
                    + '/' + methodName,
                    {
                        method: 'POST',
                        data: JSON.stringify(postData),
                        dataType: 'json',
                        success: function (jsonResult) {
                            if (jsonResult && jsonResult.errorId) {
                                return cb(new Error(jsonResult.errorDescription, jsonResult.errorCode), jsonResult);
                            }

                            cb(false, jsonResult);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            cb(new Error(textStatus != 'error' ? textStatus : 'Unknown error, watch console')); // should be errorThrown
                        }
                    }
                );
            } else {
                console.error('Application should be run either in NodeJs environment or has jQuery to be included');
            }
        };

        this.setClientKey = function (value) {
            this.params.clientKey = value;
        };

        //proxy access parameters
        this.setWebsiteURL = function (value) {
            this.params.websiteUrl = value;
        };

        this.setWebsiteKey = function (value) {
            this.params.websiteKey = value;
        };

        this.setWebsiteSToken = function (value) {
            this.params.websiteSToken = value;
        };

        this.setProxyType = function (value) {
            this.params.proxyType = value;
        };

        this.setProxyAddress = function (value) {
            this.params.proxyAddress = value;
        };

        this.setProxyPort = function (value) {
            this.params.proxyPort = value;
        };

        this.setProxyLogin = function (value) {
            this.params.proxyLogin = value;
        };

        this.setProxyPassword = function (value) {
            this.params.proxyPassword = value;
        };

        this.setUserAgent = function (value) {
            this.params.userAgent = value;
        };

        // image
        this.setPhrase = function (value) {
            this.params.phrase = value;
        };

        this.setCase = function (value) {
            this.params.case = value;
        };

        this.setNumeric = function (value) {
            this.params.numeric = value;
        };

        this.setMath = function (value) {
            this.params.math = value;
        };

        this.setMinLength = function (value) {
            this.params.minLength = value;
        };

        this.setMaxLength = function (value) {
            this.params.maxLength = value;
        };


        this.setSoftId = function (value) {
            this.params.softId = value;
        };

        this.setLanguagePool = function (value) {
            this.params.languagePool = value;
        };

        this.setHost = function (value) {
            this.params.host = value;
        };

        this.setPort = function (value) {
            this.params.port = value;
        };

    }(clientKey);
};

if (typeof process === 'object' && typeof require === 'function') { // NodeJS
    module.exports = Anticaptcha;
}
