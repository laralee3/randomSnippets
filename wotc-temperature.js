/**
 * Reads temperature from external source, with thresholds for boiling and freezing.
 * Sends alert if threshold temperature is reached exactly.
 * 
 * 
 * @constructor
 * @param {boolean} useFahrenheit - Set to true if output should be in Fahrenheit, defaults to false/Celsius
 * @param {number} initialTemp - Set an initial temperature in Celcius before data is fetched (single decimal precision),
 *      defaults to a typical room temp
 * @param {number} freezingPoint - Set a freezing point in Celcius
 * @param {number} boilingPoint - Set a boiling point in Celcius
 * @param {string} url - Set the target api url for fetching weather data
 * 
 * @param {object} alert - Alert settings
 * @param {number} alert.thresholdRange - Sets numerical range difference before threshold is retriggered, e.g.
 *     with a thresholdRange of 5, if a threshold is triggered, temps will have to drift 5 units away before
 *     the alert is allowed to retrigger. Defaults to 0, which alerts every time thresholds are passed.
 *     Can set to an absurdly large number to disable alerts entirely.
 * @param {boolean} alert.oneWay - Set to true if alert should only trigger when going up to boiling point, or
 *     going down to freezing, and not vice versa. Otherwise defaults to alerting whenever threshold is hit
 * @param {boolean} alert.triggerBoilAlert - Flag for whether boil alert should trigger.
 *     Setting to true guarantees at least one alert. Disables boil alerts entirely if false (default).
 * @param {boolean} alert.triggerFreezeAlert - Flag for whether freeze alert should trigger.
 *     Setting to true guarantees at least one alert. Disables freeze alerts entirely if false (default).
 */

class Temperature {
    constructor(useFahrenheit, initialTemp, freezingPoint, boilingPoint, url, alert) {
        let defaultAlertSettings = {
            thresholdRange: 0,
            oneWay: false,
            triggerBoilAlert: false,
            triggerFreezeAlert: false
        }

        this.fahrenheit = useFahrenheit || false;
        this.temp = (initialTemp) ? this.setTempPrecision(initialTemp) : 22;
        this.freeze = freezingPoint || 0;
        this.boiling = (boilingPoint) ? boilingPoint : 100;
        this.url = url || 'https://fake.weather.api.temp.source.com/location/etc/etc';
        this.alert = {...defaultAlertSettings, ...alert};

        if (this.fahrenheit) {
            this.temp = this.convertToFahrenheit(this.temp);
            this.freeze = this.convertToFahrenheit(this.freeze);
            this.boiling = this.convertToFahrenheit(this.boiling);
        }

        this.apiService = new ApiService();
    }

    alertMessage(message) {
        // Or can alert in some other method, or display it inline, etc.
        window.alert('Threshold reached! ' + message);
    }

    convertToFahrenheit(celsiusTemp) {
        return (celsiusTemp * (9/5)) + 32;
    }

    handleUpdatedTemp() {
        // Insert code here to update subscribers of the new temp data, etc, beyond any binding to this.temp
        this.modelToViewBinding = this.temp + (this.fahrenheit) ? ' F' : ' C';

        // Check if current temp is below boil + threshold, if true enable alert
        if (this.temp <= this.boiling - this.thresholdRange) {
            this.alert.triggerBoilAlert = true;
        }

        // Check if current temp is above freeze + threshold, if true enable alert
        if (this.temp >= this.freeze + this.thresholdRange) {
            this.alert.triggerFreezeAlert = true;
        }

        // Handle other scenarios if not one way
        if (!this.alert.oneWay) {
            if (this.temp >= this.boiling + this.thresholdRange) {
                this.alert.triggerBoilAlert = true;
            }

            if (this.temp <= this.freeze - this.thresholdRange) {
                this.alert.triggerFreezeAlert = true;
            }
        }

        if (this.alert.triggerBoilAlert) {
            if (this.temp === this.boiling) {
                this.alertMessage('Boiling!');
                this.alert.triggerBoilAlert = false;
            }
        }

        if (this.alert.triggerFreezeAlert) {
            if (this.temp === this.freeze) {
                this.alertMessage('Freezing!');
                this.alert.triggerFreezeAlert = false;
            }
        }
    }

    setTempPrecision(temp) {
        return Math.round(temp * 10) / 10; // Single Decimal Place. Could make this customizable
    }

    startIntervalCheck(timing) {
        timing = timing || 10000; // Check every 10 seconds

        this.timedCheck = window.setInterval(updateTemp, timing);
    }

    stopIntervalCheck() {
        window.clearInterval(this.timedCheck);
    }

    updateTemp() {
        // Filler API call code to imaginary external source; 

        this.apiService.get(this.url, {/* Various settings for the call */})
            .then(jsonData => {
                let updatedTemp = jsonData.newTempCelsius;
                this.temp = this.setTempPrecision((this.fahrenheit) ? this.convertToFahrenheit(updatedTemp) : updatedTemp);
                this.handleUpdatedTemp();
            })
            .catch(error => {
                console.log('Error! ', error);
                // handle error
            });
    }
}

class ApiService {
    constructor() {
        this.defaultSettings = {
            cache: 'default',
            credentials: 'same-origin'
            // etc
        };
    }

    generic(url, settings) {
        return fetch(url, {...this.defaultSettings, ...settings})
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    // handle error
                }
            });
    }

    get(url, settings) {
        let getSettings = {
            method: 'GET'
        };

        return this.generic(url, {...getSettings, ...settings});
    }

    post(url, settings, payload) {
        // etc
    }
}