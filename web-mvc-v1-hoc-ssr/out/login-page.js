function D(){function k(){let q=x(C),j=x(A);return`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            ${z}
        </head>
        <body>
            <script>
                // Chèn trực tiếp phần thân của hàm
                ${j}
                ${q}; // Gọi hàm scriptFrontend sau khi chèn
            </script>
        </body>
        </html>
        `}return{render:k}}var z=`
    <style>
        h1 {
            color: red;
        }
        #login {
            color: blue;
        }
    </style>
`;function A(){console.log(1)}function C(){(function(){let k=document.createElement("h1");k.innerHTML="Login",document.body.appendChild(k);let q=document.createElement("form");q.id="login";let j=document.createElement("label");j.textContent="Username:  ";let w=document.createElement("input");w.name="username",w.autocomplete="username",j.appendChild(w),q.appendChild(j),document.body.appendChild(q)})()}function x(k){let j=k.toString().match(/\{([\s\S]*)\}/);if(j&&j[1])return j[1].trim();return""}export{D as loginPage};
