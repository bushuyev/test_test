import {User} from 'src/elements/model/user.js';

export var MyTest2 = {
    is: "my-test2",

    method: function () {
      console.log("method, user=" + this.val);
    },

    ready: function () {
      this.user = new User('Dilly');
      console.log("ready: val=" + this.val + " e=" + new Error().stack);
    }
};