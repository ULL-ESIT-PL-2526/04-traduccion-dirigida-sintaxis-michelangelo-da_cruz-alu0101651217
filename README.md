# Syntax Directed Translation with Jison

Jison is a tool that receives as input a Syntax Directed Translation and produces as output a JavaScript parser  that executes
the semantic actions in a bottom up ortraversing of the parse tree.
 

## Compile the grammar to a parser

See file [grammar.jison](./src/grammar.jison) for the grammar specification. To compile it to a parser, run the following command in the terminal:
``` 
➜  jison git:(main) ✗ npx jison grammar.jison -o parser.js
```

## Use the parser

After compiling the grammar to a parser, you can use it in your JavaScript code. For example, you can run the following code in a Node.js environment:

```
➜  jison git:(main) ✗ node                                
Welcome to Node.js v25.6.0.
Type ".help" for more information.
> p = require("./parser.js")
{
  parser: { yy: {} },
  Parser: [Function: Parser],
  parse: [Function (anonymous)],
  main: [Function: commonjsMain]
}
> p.parse("2*3")
6
```
## Development

**2.1. What's the difference between `/* skip whitespace */` and returning a token.**


**3. Modify the lexical analyzer in grammar.jison to skip single-line comments starting with //.**

`\/\/.*                { /* ignore comments */; }`

**4. Modify the lexical analyzer in grammar.jison to recognize floating-point numbers such as 2.35e-3, 2.35e+3, 2.35E-3, 2.35, and 23.**

`[0-9]+(\.[0-9]+)?([eE][-+][0-9]+)?            { return 'NUMBER';       }`
