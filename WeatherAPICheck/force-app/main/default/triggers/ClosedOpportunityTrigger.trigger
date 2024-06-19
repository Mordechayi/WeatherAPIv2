trigger ClosedOpportunityTrigger on Opportunity (after insert) {
    List<Task> listTasksToAdd = new List<Task>();
    for(Opportunity opp : Trigger.new){
        if(opp.StageName == 'Closed won'){
            Task newTask = new Task();
            newTask.Subject = 'Follow Up Test Task';
            newTask.WhatId = opp.Id;
            listTasksToAdd.add(newTask);
        }
    }
    if(!listTasksToAdd.isEmpty()){
        insert listTasksToAdd;
    }
}