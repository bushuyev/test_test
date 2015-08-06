import {User} from 'elements/model/user.js';

Polymer({
//export const Elt = {
  is: "my-test",

  method: function(){
    console.log("method, user="+this.val);
  },

  ready: function(){
    this.user= new User('Billy');
    console.log("ready: val=" + this.val+" e="+new Error().stack);
  }
});