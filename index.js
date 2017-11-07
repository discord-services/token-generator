var anticaptcha = require('./anticaptcha')('tokenhere'); //<<< your anticaptcha token

var fs = require('fs');
anticaptcha.setWebsiteURL("https://discordapp.com/register");
anticaptcha.setWebsiteKey("6Lef5iQTAAAAAKeIvIY-DeexoO3gj7ryl9rLMEnn");
anticaptcha.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116");
anticaptcha.getBalance(function (err, balance) {
    if (err) {
        console.error(err);
        return;
    }

    if (balance > 0) {
        anticaptcha.createTaskProxyless(function (err, taskId) {
            if (err) {
                console.error(err);
                return;
            }

            console.log(taskId);

            anticaptcha.getTaskSolution(taskId, function (err, taskSolution) {
                if (err) {
                    console.error(err);
                    return;
                }

                console.log(taskSolution);
				  fs.writeFile('1234.txt', taskSolution, function(err) {
					});
            });
        });
    }
});
