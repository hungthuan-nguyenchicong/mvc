import { serve } from "bun";
// import { SQL } from "bun";
// const db = new SQL({
//   url: "postgres://cong:Cong12345@localhost:5432/mvcdb",
//   // Có thể cấu hình thêm hostname, port, username, password, database...
// });

import { db } from "./core/Conection";
const rows = await db`SELECT * FROM users`;
console.log(rows);
serve({
    routes: {
        '/': async ()=> {
            return new Response('/ duong dan');
        },
        '/users': async ()=>{
            return Response('/users duong dan')
        },
        '/users/:id': req => {
            const {id} = req.params;
            //return Response.json({id:`${id}`});
            return Response(`User có Id: ${id}`);
        },
        '/posts/:id': req => new Response(`Post co id: ${req.params.id}`),
        '/api/posts': {
            GET: () => new Response('list Post'),
            POST: async req => {
                const post = await req.json();
                return Response.json({ id: crypto.randomUUID(), ...post });
            },
            PUT: async req => {
                const update = await req.json();
                return Response.json({update: true, ...update});
            },
            //DELETE: ()=> new Response(null, {status: 204})
            DELETE: ()=> new Response('Delete')

        }
    },


    fetch(req) {
        return new Response('Bun vannila run tesst app');
    }
});

console.log('dang chay bun');