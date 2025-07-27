// vite-html-minify-plugin.js
import { minify as htmlMinifier } from 'html-minifier-terser';
// NO LONGER import { minify as terserMinify } from 'terser'; // REMOVE THIS IMPORT

const defaultMinifyOptions = {
    collapseWhitespace: true,
    removeComments: true, // html-minifier-terser will remove comments from HTML, CSS, JS
    minifyCSS: true,
    minifyJS: { // THIS IS THE KEY: html-minifier-terser uses Terser here
        compress: true,
        mangle: true,
    },
    // ... (rest of your options) ...
};

export function htmlMinifyPlugin() {
    return {
        name: 'html-minify-plugin',
        async transform(code, id) {
            if (id.includes('backend/admin/views/login/') && (id.endsWith('.js') || id.endsWith('.ts'))) {
                let modifiedCode = code;
                const htmlTemplateRegex = /(\/\*\s*html\s*\*\/\s*`)([\s\S]*?)(`)/g;
                const matches = [...code.matchAll(htmlTemplateRegex)];

                for (const match of matches) {
                    const prefix = match[1];
                    const htmlContent = match[2]; // This HTML string now contains JS that is only "cleaned", not fully minified.
                    const suffix = match[3];

                    try {
                        // htmlMinifier will now perform the full minification on the *entire* HTML chunk,
                        // including the JS within <script> tags due to minifyJS: true.
                        const minifiedHtml = await htmlMinifier(htmlContent, defaultMinifyOptions);
                        const escapedFullMatch = match[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        modifiedCode = modifiedCode.replace(new RegExp(escapedFullMatch, 'g'), `${prefix}${minifiedHtml}${suffix}`);
                    } catch (e) {
                        this.error(`Failed to minify HTML in ${id}: ${e.message}. Using original HTML for this section.`);
                        // If you want to fall back to the unminified HTML content if error occurs, do this:
                        // modifiedCode = modifiedCode.replace(new RegExp(escapedFullMatch, 'g'), `${prefix}${htmlContent}${suffix}`);
                    }
                }
                return {
                    code: modifiedCode,
                    map: null
                };
            }
            return null;
        }
    };
}