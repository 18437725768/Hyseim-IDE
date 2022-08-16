require('source-map-support/register');

console.error('\n[hyseim debug] debugger loader.');
console.error('\n * ' + process.argv.join('\n * '));
process.title = 'gdb-session';

require('./backend');
