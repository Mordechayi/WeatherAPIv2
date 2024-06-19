trigger AccountAddressTrigger on Account (before insert) {
    // if(Trigger.new.Match_Billing_Address__c){
    //     System.debug('enter to condition'+Trigger.new.Match_Billing_Address__c);
    //     Trigger.new.ShippingAddress = Trigger.new.Match_Billing_Address__c;
    // }
    for (Account acc : Trigger.new) {
        // Check if Match Billing Address is true
        if (acc.Match_Billing_Address__c) {
            System.debug('enter to condition'+acc.Match_Billing_Address__c);
            // Set Shipping Postal Code to match Billing Postal Code
            acc.ShippingPostalCode = acc.BillingPostalCode;
        }
    }
}