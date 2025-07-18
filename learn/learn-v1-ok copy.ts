import figlet from "figlet";
import { parseJsonSourceFileConfigFileContent } from "typescript";

const server = Bun.serve({
    port: 3000,
    fetch(req) {
        const body = figlet.textSync('Bun!');
        return new Response(body);
    }
})