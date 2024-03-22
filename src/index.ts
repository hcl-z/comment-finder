
export * from './parse'
export { CommentType } from './const'

import { parse } from './parse'

let res = parse({
    content: `
         /* This is a
         multi-line comment */
        `
})
console.log(res)