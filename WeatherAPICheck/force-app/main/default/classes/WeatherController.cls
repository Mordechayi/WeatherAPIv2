public with sharing class WeatherController {

    @AuraEnabled//(cacheable=true)
        public static List<Map<String,Object>> getCurrentWeather(Integer limitNum ,Integer offset, Boolean isCelsius) {
        Double lat, lon;
        List<Account> citiesToUpdate = new List<Account>();
        String currentWeatherEndPoint;
        Weather__mdt Weather = [SELECT API_key__c, API_Endpoint__c FROM Weather__mdt LIMIT 1];
        String baseUrl = Weather.API_Endpoint__c; //'https://api.openweathermap.org/data/2.5/weather?';
        String appid = weather.API_key__c;  //'appid=6c1293271a5671a9a0d08aa647c12bd3';
        if(isCelsius)
            appid += '&units=metric';
        else
            appid += '&units=imperial';
        List<Account> allCities = [SELECT id,Temp__c, Address__City__s,Address__Longitude__s,Address__Latitude__s FROM Account WHERE Address__City__s != NULL ORDER BY Id LIMIT :limitNum OFFSET :offset];
        System.debug(allCities);
        List <map<String,Object>> ListResult = new list <map<String,Object>>();
        for (Account city : allCities) {
            if (city != null && !(city.Address__Longitude__s == null) && !(city.Address__Latitude__s == null)) {
                lat = city.Address__Latitude__s;
                lon = city.Address__Longitude__s;
                currentWeatherEndPoint = baseUrl +'lat=' + lat +'&lon=' + lon +'&' + appid;
                HttpRequest req = new HttpRequest();
                System.debug('currentWeatherEndPoint   ' +city +'   ' + currentWeatherEndPoint);
                req.setEndpoint(currentWeatherEndPoint);
                req.setMethod('GET');
                Map <String, Object> result = new Map<String, Object>();
                String responseBody = '';
                try {
                    Http http = new Http();
                    System.debug('req' + req);
                    HttpResponse res = http.send(req);
                    if (res.getStatusCode() == 200) {
                        responseBody = res.getBody();
                        System.debug('responseBody' + responseBody);
                    }
                    else {
                        System.debug('res.getBody()' + res.getBody());
                        throw new CalloutException(res.getBody());
                    }
                } catch (Exception e) {
                    System.debug('e' + e);
                    throw new AuraHandledException(e.getMessage());
                }
                if (String.isNotBlank(responseBody)) {
                    result = (Map<String, Object>) JSON.deserializeUntyped(responseBody);
                    System.debug(result);
                    ListResult.add(result);
                    addTempToAccounts(result,city,citiesToUpdate);
                }
            }
        }
        if (!ListResult.isEmpty()) {
            //updateTempAccounts(citiesToUpdate);
            try {
                update citiesToUpdate;
            } catch (Exception e) {
                throw new ExternalObjectException(e.getMessage());
            }
            return ListResult;
         }
        return  null;
    }
    public static void addTempToAccounts(Map<String, Object> result, Account city, List<Account> citiesToUpdate){
        Map<String, Object> mainData = (Map<String, Object>) result.get('main');
        if (mainData != null) {
            System.debug('mainData.get(\'temp\')' + mainData.get('temp'));
            city.Temp__c = (Double) mainData.get('temp');
            citiesToUpdate.add(city);
        }
    }
    // public void updateTempAccounts(List<Account> citiesToUpdate){
        
    // }
        
}