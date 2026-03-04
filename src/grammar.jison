/* Lexer */
%lex
%%
\s+                                           { /* skip whitespace */; }
\/\/[^\n]*                                    { /* ignore comments */; }
[0-9]+(\.[0-9]+)?([eE][-+][0-9]+)?            { return 'NUMBER';       }
"**"                                          { return 'OPOW';         }
[*/]                                          { return 'OPMU';          }
[-+]                                          { return 'OPAD';         }
<<EOF>>                                       { return 'EOF';          }
.                                             { return 'INVALID';      }
/lex

/* Parser */
%start expressions
%token NUMBER
%%

expressions
    : expression EOF
        { return $expression; }
    ;

expression
    : expression OPAD term
        { $$ = operate($OPAD, $expression, $term); }
    | term
        { $$ = $term; }
    ;

term
    : term OPMU power
        { $$ = operate($OPMU, $term, $power); }
    | power
        { $$ = $power; }
    ;

power
    : factor OPOW power
        { $$ = operate($OPOW, $factor, $power); }
    | factor
        { $$ = $factor; }
    ;

factor
    : NUMBER
        { $$ = Number(yytext); }
    ;
%%

function operate(op, left, right) {
    switch (op) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/': return left / right;
        case '**': return Math.pow(left, right);
    }
}