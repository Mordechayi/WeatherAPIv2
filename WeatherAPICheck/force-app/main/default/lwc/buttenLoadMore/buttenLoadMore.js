import { LightningElement,api } from 'lwc';

export default class ButtenLoadMore extends LightningElement {
    @api nextCities = false;
    @api preCities = false;

    handlePreviousClick(){
        this.dispatchEvent(new CustomEvent('previousclick'))
    }
    handleNextClick(){
        this.dispatchEvent(new CustomEvent('nextclick'))
    }
}