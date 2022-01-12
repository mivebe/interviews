// Input	Expected	Notes
// ['a', 'ab', 'abc']	'abc'	Basic: returns longest by character count
// ['big', [0,1,2,3,4], 'tiny']	'tiny'	Arrays ignored even if length > string length
// ['Hi', 'World', '你好']	'World'	Unicode: 你好 = 2 chars, World = 5 chars
// [true, false, 'lol']	'lol'	Booleans are ignored
// [{object: true}, 'x']	'x'	Objects are ignored
