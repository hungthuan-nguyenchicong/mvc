const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.[contenthash].js',
        // Vì index.html sẽ ở thư mục gốc, và bundle.js cũng cần được tải,
        // chúng ta có thể giữ output.path là 'public' để tách biệt code build,
        // HOẶC đặt nó vào thư mục gốc nếu muốn.
        // Option A: Vẫn xuất vào 'public' và điều chỉnh devServer.static
        path: path.resolve(__dirname, 'public'),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack App',
            template: './index.html', // <<< THAY ĐỔI ĐƯỜNG DẪN MẪU TẠI ĐÂY
            // File HTML đầu ra mặc định là index.html, và nó sẽ được đặt trong output.path (tức là public)
            // Nếu bạn muốn nó được đặt vào thư mục gốc, bạn cần cấu hình thêm filename và publicPath.
            // Ví dụ: filename: '../index.html' (nếu output.path là 'public') hoặc
            // đơn giản nhất là để HtmlWebpackPlugin đặt nó vào output.path
            // Thêm tùy chọn scriptLoading vào đây để sử dụng type="module"
            scriptLoading: 'module',
        }),
    ],
    devServer: {
        // Cần điều chỉnh devServer.static để nó phục vụ thư mục 'public' (nơi chứa bundle.js)
        // VÀ cũng phục vụ thư mục gốc (nơi chứa index.html).
        // Cách đơn giản nhất là chỉ phục vụ output.path của bạn.
        static: {
            directory: path.join(__dirname, 'public'), // devServer vẫn phục vụ public
            // Vì index.html mẫu ở gốc, nhưng file index.html được tạo ra sẽ nằm trong public.
            // Do đó, devServer chỉ cần phục vụ thư mục public là đủ.
        },
        compress: true,
        port: 9000,
        open: {
            app: {
                name: 'chrome',
            },
        },
        historyApiFallback: true,
    }
};