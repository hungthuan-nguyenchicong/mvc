import dashboard from "../public/dashboard.html";
import { serve } from "bun";

serve({
  routes: {
    "/": dashboard,
  },

  async fetch(req) {
    // ...api requests
    return new Response("hello world");
  },
});