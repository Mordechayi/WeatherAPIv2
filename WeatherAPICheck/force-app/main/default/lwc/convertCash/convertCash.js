import { LightningElement,wire,track } from 'lwc';
import  getExchange from '@salesforce/apex/getExchangeRate.getLatestExchangeRates';

export default class ConvertCash extends LightningElement {
    @track dataOption = [];
    @track valueFrom = '';
    @track valueTo = '';
    @track valueNum = '';
    @track valueResulte;
    @track isResulteDisabled = true;
    @wire(getExchange) 
    wiredStores({ error, data }) {
        if (data) {
            console.log(data);
            console.log(typeof data.data);
            
            // Check if data is defined and not null before processing it
            const a = JSON.parse(data);
            this.dataOption = Object.keys(a.data).map(key => ({ label: key, value: key, rate: a.data[key]}));
            console.log(JSON.stringify(this.dataOption));//this.dataOption);
            
        } else if (error) {
            console.log(error);
        }
    }
    handleFromChange(event){

        this.valueFrom  = event.detail.value;
        // const selectedOption = this.dataOption.find(option => option.label === this.valueFrom);
        console.log(event.detail.value);

        // console.log(selectedOption);
        // console.log(selectedOption.rate);
    }
    handleToChange(event){
        this.valueTo = event.detail.value;
        // const selectedOption = this.dataOption.find(option => option.label === this.valueFrom);
    }
    handleNumChange(event){
        this.valueNum = event.detail.value;
    }
    handleClickConvert(){
        let selectedOptionFrom = this.dataOption.find(option => option.label === this.valueFrom);
        console.log(selectedOptionFrom.data);
        let selectedOptionTo = this.dataOption.find(option => option.label === this.valueTo);
        console.log(selectedOptionTo.data);
        let value = (this.valueNum / selectedOptionFrom.data) * selectedOptionTo.data;
        this.valueResulte = this.formatNumber(value);
        console.log(this.valueResulte);
        this.valResulteFrom = this.valueFrom;
        this.valResulteTo = this.valueTo;
        this.isResulteDisabled = false;
    }
    formatNumber(num) {
        return Math.round(num * 100000) / 100000;
    }
    handleChangeDirection(){
        let temp = this.valueFrom;
        this.valueFrom = this.valueTo;
        this.valueTo = temp;
    }
    get isDirectionDisabled(){
        return !( this.valueFrom && this.valueTo);
    }
    get isConvertDisabled(){
        return !( this.valueNum && this.valueFrom && this.valueTo);
    }
    get computedLabel() {
        return `Convert ${this.valueNum} ${this.valueFrom} to ${this.valueTo}`;
    }

    // get isResulteDisabled(){
        
    // }
    // get dataOption(){
    //     return getExchange;
    // }
}