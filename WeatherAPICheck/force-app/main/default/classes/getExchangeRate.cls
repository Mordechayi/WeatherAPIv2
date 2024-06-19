public with sharing class getExchangeRate {
   
    @AuraEnabled(cacheable=true)
    public static String getLatestExchangeRates() {
        //String endpoint = 'http://data.fixer.io/api/latest?access_key=66cfbddf7634b286ee432298dce5e929';
        String endpoint = 'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_dZSbjX55Drdn2INusEAesTtszHWzjmscQRoYeAVX';
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(endpoint);
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        if (response.getStatusCode() == 200) {
            String responseBody = response.getBody();
            System.debug(responseBody);
            return responseBody;
            // Process the JSON response
            // You can deserialize the JSON response into a custom Apex class or parse it as needed
        } else {
            System.debug('Error from API: ' + response.getStatusCode() + ' ' + response.getStatus());
            return null;
        }
        
    }
}