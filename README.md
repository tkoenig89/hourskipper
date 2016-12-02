# SkipHours
JavaScript module, to wrap functions and only forward calls at specified hours during the day.

#Example

```javascript
var SkipHours = require("skiphours");

//function to add +12 to the provided value only between 15::PM and 15:59PM 
var add12OnlyAt3PM = SkipHours((t) => {
    return t + 12;
}, { hours: "15" });

var result = add12OnlyAt3PM(3);

//check if the function has actually be called or not
if(result.isCalled){
    console.log(result.returnValue);
}
```
