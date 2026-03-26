// Create a global variable for context (this lives in the
// global scope - window).
var context = "Global (ie. window)";


// Create an object.
var objectA = {
context: "Object A"
};


// Create another object.
var objectB = {
context: "Object B"
};


// -------------------------------------------------- //
// -------------------------------------------------- //


// Define a function that uses an argument AND a reference
// to this THIS scope. We will be invoking this function
// using a variety of approaches.
function testContext( approach ){

console.log( approach, "==> THIS ==>", this.context );

}


// -------------------------------------------------- //
// -------------------------------------------------- //


// Invoke the unbound method with standard invocation.
testContext( "testContext()" );

// Invoke it in the context of Object A using call().
testContext.call(
objectA,
".call( objectA )"
);

// Invoke it in the context of Object B using apply().
testContext.apply(
objectB,
[ ".apply( objectB )" ]
);


// -------------------------------------------------- //
// -------------------------------------------------- //


// Now, let's set the test method as an actual property
// of the object A.
objectA.testContext = testContext;


// -------------------------------------------------- //
// -------------------------------------------------- //


// Invoke it as a property of object A.
objectA.testContext( "objectA.testContext()" );

// Invoke it in the context of Object B using call.
objectA.testContext.call(
objectB,
"objectA.testContext.call( objectB )"
);

// Invoke it in the context of Window using apply.
objectA.testContext.apply(
window,
[ "objectA.testContext.apply( window )" ]
);