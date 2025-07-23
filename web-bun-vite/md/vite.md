## tao du an

bun create vite web-bun-vite
cd web-bun-vite
bun install
bun run dev

## Cài đặt concurrently

bun add -D concurrently

    {
      "name": "bun-vite-hmr",
      "private": true,
      "version": "0.0.0",
      "type": "module",
      "scripts": {
        "dev": "concurrently \"bunx --bun vite\" \"bun run server.js\"",
        "build": "vite build",
        "preview": "vite preview",
        "server": "bun run server.js"
      },
      "devDependencies": {
        "concurrently": "^8.2.2",
        "vite": "^5.0.0"
      },
      "dependencies": {
        "bun": "^1.1.13"
      }
    }
    