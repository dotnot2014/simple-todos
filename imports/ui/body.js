import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import { ReactiveDict } from 'meteor/reactive-dict';

import './task.js';
import './body.html';

//add reactive-dict
Template.body.onCreated(function bodyOnCreated(){
  this.state = new ReactiveDict();
});

Template.body.helpers({
  //return local collections
  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the tasks
    // Show newest tasks at the top
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  //return incompleteCount
  incompleteCount() {
  return Tasks.find({ checked: { $ne: true } }).count();
  },

});

Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    Meteor.call('tasks.insert', text);

    // Insert a task into the collection
    Tasks.insert({
      text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });

    // Clear form
    target.text.value = '';
  },
  'change .hide-completed input'(event,instance){
    instance.state.set('hideCompleted',event.target.checked);
  },
});
// Status API Training Shop Blog About
