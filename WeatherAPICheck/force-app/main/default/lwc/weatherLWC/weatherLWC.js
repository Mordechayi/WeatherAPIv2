import { LightningElement, track } from 'lwc';
import getCurrentWeather from '@salesforce/apex/WeatherController.getCurrentWeather';
//import { refreshApex } from '@salesforce/apex';
import myResource from '@salesforce/resourceUrl/weather';
export default class weatherLWC extends LightningElement {
    @track currentWeather = [];
    @track flagFirstTime = true;
    @track buttonDisable = true;
    @track isCelsius = true;
    @track isLoading = false; 
    weatherDataMap = new Map();
    weatherDataResponse;
    offset = 0;  
    chunck = 16;
    limitNumber = 16;

    handleRefresh() {
        console.log('start');
        this.fetchWeather(this.limitNumber);
        // refreshApex(this.getCurrentWeather)
        //     .then(() => {
        //         console.log('refreshApex completed');
        //         this.fetchWeather();
        //     })
        //     .catch(error => {
        //         console.error('Error refreshing weather data:', error);
        //     })
        //     .finally(() => {
        //         console.log('end');
        //     });
    }

    connectedCallback() {
        this.fetchWeather(32);
    }

    async fetchWeather(limit) {
        const key =  `${this.offset}-${this.chunck}`; 
        console.log('key ', key);
        this.isLoading = true;
        await getCurrentWeather({limitNum : limit, offset: this.offset, isCelsius : this.isCelsius})
        .then(result => {
            console.log('result', result);
            this.weatherDataResponse = result;
            const formattedData = this.newFormattedData(result);
            if(this.flagFirstTime){
                const nextOffset = this.offset + this.chunck;
                const nextkey =  `${nextOffset}-${this.chunck}`; 
                const firstSlice = formattedData.slice(0, this.chunck );
                this.weatherDataMap.set(key, firstSlice);
                this.weatherDataMap.set(nextkey,formattedData.slice(this.chunck));
                this.currentWeather = [...firstSlice];
                this.flagFirstTime = false;
            }
            else{
                this.weatherDataMap.set(key,formattedData);
            }
            this.buttonDisable = false;
        }) 
        .catch(error => {
            console.log('error = ', error);
        })
        .finally(() => {
            this.isLoading = false;
        });
            
    }
    handlePreviousClick(){
        if (this.offset >= this.chunck) {  
            this.offset -= this.chunck;
            const key = `${this.offset}-${this.chunck}`; 
            if (this.weatherDataMap.has(key)) {
                this.currentWeather =  [...this.weatherDataMap.get(key)];
            }
            else
                this.fetchWeather(this.limitNumber);
        }
    }
    
    handleNextClick(){
        this.offset += this.chunck;
        const key = `${this.offset}-${this.chunck}`; 
        const nextOffset = (this.offset + this.chunck);
        const nextKey = `${nextOffset}-${this.chunck}`; 
        if(this.weatherDataMap.has(key)){
            this.currentWeather = [...this.weatherDataMap.get(key)];
        }
        else{
            this.fetchWeather(this.limitNumber);
            console.log('!has(key)');
        }
        if(!this.weatherDataMap.has(nextKey)){
            this.offset += this.chunck;
            this.fetchWeather(this.limitNumber).then(()=>{
                this.offset -= this.chunck;
            });
            console.log('!has(nextKey)');
        }
    }
    get rangeDisplay() {
        return `${this.offset} - ${this.offset + this.chunck}`;
    }
    
    newFormattedData(data) {
        return data.map(item => ({
            temp: item.main.temp,
            name: item.name,
            urlToIcon: myResource +'/icons/' + item.weather[0].icon +'.png',
            // urlToIcon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
            description: item.weather[0].description
        }));
    }
    get celsiusButtonVariant() {
        return this.isCelsius ? 'brand' : 'neutral';
    }
    
    get fahrenheitButtonVariant() {
        return this.isCelsius ? 'neutral' : 'brand';
    }
    
    setCelsius() {
        this.isCelsius = true;
        this.currentWeather.forEach(item => {
            if(item.temp != null)
            item.temp = this.fahrenheitToCelsius(item.temp)
    });
}

setFahrenheit() {
    this.isCelsius = false;
        this.currentWeather.forEach(item => {
            if(item.temp != null)
        item.temp = this.celsiusToFahrenheit(item.temp);
            
    });
}

    celsiusToFahrenheit(celsius){
        return (celsius * 9 / 5 + 32).toFixed(2);
    }
    fahrenheitToCelsius(fahrenheit){
        return ((fahrenheit - 32) * (5 / 9)).toFixed(2);
    }        
}
// handleNextClick(){
    //     this.offset += this.chunck;
    //     const key = `${this.offset}-${this.chunck}`; 
    //     if(this.nextWeather && !this.nextWeather.includes(-999)){
        //         this.currentWeather = this.weatherDataMap.get(key);
        //     }
//     // const nextOffset = this.offset + this.chunck;
//     // console.log('next offset  ' , nextOffset);
//     // const nextKey = `${nextOffset}-${this.chunck}`; 
//     console.log('key 1234  ' , key);

//     if (!this.weatherDataMap.has(key)) {
//         this.fetchWeather();
//         console.log('has(nextKey)  ');

//     //     this.currentWeather =  this.weatherDataMap.get(key);
//     }
//     else{
    //         this.nextWeather = this.weatherDataMap.get(key);
//     }

// }

// newFormattedData(data) {
    //     let tempIcon = data.map(item => item.weather.icon);
    //     console.log('tempIcon', tempIcon);
    //     for(let i = 0; i < tempIcon.length; i++) {
        //         tempIcon[i] = `https://openweathermap.org/img/wn/${tempIcon[i]}@2x.png`;
    //         console.log('tempIcon[i]', tempIcon[i]);    
    //         this.currentWeather[i] = data.map(item => ({
        //             temp: item.main.temp,
        //             name: item.name,
        //             urlToIcon: tempIcon,
        //             description: item.weather.description
        //         }));
        //     }
        
        //     console.log('this.currentWeather', JSON.stringify(this.currentWeather));
        // }