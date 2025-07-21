## nhiều cấu hình

import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => {
  // `command` là 'serve' (trong dev) hoặc 'build'
  // `mode` là chuỗi chế độ được chỉ định bởi --mode (mặc định là 'development' trong dev, 'production' trong build)

  if (mode === 'admin') {
    return {
      // Cấu hình đặc biệt cho chế độ 'admin'
      build: {
        outDir: 'public/admin_dist',
        rollupOptions: {
          input: './src/admin/main.js',
        },
      },
      // ... các cấu hình khác cho admin
    };
  } else if (mode === 'client') {
    return {
      // Cấu hình đặc biệt cho chế độ 'client'
      build: {
        outDir: 'public/client_dist',
        rollupOptions: {
          input: './src/client/main.js',
        },
      },
      // ... các cấu hình khác cho client
    };
  }

  // Cấu hình mặc định
  return {
    build: {
      outDir: 'public/default_dist',
      rollupOptions: {
        input: './src/main.js',
      },
    },
    // ... cấu hình chung
  };
});

## ver 2

Không, một vite.config.jstệp không thể có nhiều buildcấu hình trực tiếp trong cùng một đối tượng cho một lần thực thi duy nhất.

Tùy chọn của Vite buildlà một đối tượng cấu hình duy nhất. Khi bạn chạy vite build, nó sẽ xử lý một thao tác xây dựng hoàn chỉnh dựa trên buildcấu hình duy nhất đó.

Cách xử lý nhiều cấu hình bản dựng
Mặc dù bạn không thể có nhiều buildđối tượng, nhưng có một số cách phổ biến và hiệu quả để quản lý các kịch bản xây dựng khác nhau trong một dự án Vite duy nhất, đạt được cùng mục tiêu như khi có "nhiều bản dựng":

1. Sử dụng các chế độ (khuyến nghị) 🚀
Đây là cách tiếp cận phổ biến và linh hoạt nhất. Bạn vite.config.jscó thể trả về các cấu hình khác nhau một cách linh hoạt dựa trên --modecờ được truyền cho Vite CLI.

JavaScript

// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
  if (mode === 'client') {
    return {
      build: {
        outDir: 'public/client_dist', // Specific output directory for 'client' mode
        rollupOptions: {
          input: resolve(__dirname, './src/client/main.js'), // Specific entry point for 'client'
        },
      },
      // ... other client-specific configurations
    };
  } else if (mode === 'admin') {
    return {
      build: {
        outDir: 'public/admin_dist', // Specific output directory for 'admin' mode
        rollupOptions: {
          input: resolve(__dirname, './src/admin/main.js'), // Specific entry point for 'admin'
        },
      },
      // ... other admin-specific configurations
    };
  }

  // Default build configuration (e.g., for general development or main app)
  return {
    build: {
      outDir: 'public/default_dist',
      rollupOptions: {
        input: resolve(__dirname, './src/main.js'),
      },
    },
    // ... default configurations
  };
});
Cách chạy:

Đối với bản dựng của khách hàng:bun run vite build --mode client

Đối với bản dựng quản trị:bun run vite build --mode admin

Đối với bản dựng mặc định:bun run vite build

Bạn thường sẽ định nghĩa chúng là các tập lệnh riêng biệt trong package.json:

JSON

"scripts": {
  "build:client": "vite build --mode client",
  "build:admin": "vite build --mode admin",
  "build:default": "vite build"
}
2. Sử dụng các tệp cấu hình khác nhau ( --config) 📁
Vite cho phép bạn chỉ định một tệp cấu hình khác bằng tùy chọn CLI --config(hoặc -c). Điều này hữu ích nếu cấu hình bản dựng của bạn rất khác nhau và khó quản lý trong một tệp duy nhất bằng cách sử dụng chế độ.

vite.config.client.js:

JavaScript

// vite.config.client.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'public/client_dist',
    rollupOptions: {
      input: resolve(__dirname, './src/client/main.js'),
    },
  },
});
vite.config.admin.js:

JavaScript

// vite.config.admin.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'public/admin_dist',
    rollupOptions: {
      input: resolve(__dirname, './src/admin/main.js'),
    },
  },
});
Cách chạy:

Đối với bản dựng của khách hàng:bun run vite build --config vite.config.client.js

Đối với bản dựng quản trị:bun run vite build --config vite.config.admin.js

Một lần nữa, bạn sẽ đưa những điều này vào package.jsontập lệnh của mình:

JSON

"scripts": {
  "build:client": "vite build -c vite.config.client.js",
  "build:admin": "vite build -c vite.config.admin.js"
}
Cách tiếp cận này tạo ra nhiều tệp cấu hình hơn nhưng có thể phân tách rõ ràng hơn nếu cấu hình phức tạp và khác biệt.

Tóm lại, mặc dù bạn không thể đặt nhiều buildđối tượng vào một vite.config.jstệp, Vite cung cấp nhiều cách mạnh mẽ để đạt được nhiều đầu ra và cấu hình bản dựng thông qua các chế độ hoặc tệp cấu hình riêng biệt .

## ver 3

Khi chạy chế độ dev với nhiều tệp cấu hình chung trong một vite.config.js, bạn vẫn sẽ sử dụng phương pháp dựa trên mode (chế độ) như đã thảo luận. Vite được thiết kế để phục vụ một ứng dụng tại một thời điểm trong chế độ dev.

Điều này có nghĩa là bạn sẽ cần chạy các lệnh dev riêng biệt cho từng cấu hình bạn muốn phục vụ.

Cấu hình vite.config.js cho Chế độ Dev đa năng
Bạn sẽ cấu trúc vite.config.js để trả về cấu hình phù hợp dựa trên biến mode.

JavaScript

// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
  // `command` sẽ là 'serve' khi chạy dev
  // `mode` sẽ là giá trị bạn truyền vào (ví dụ: 'admin', 'client', hoặc 'development' mặc định)

  if (mode === 'admin') {
    console.log('--- Đang chạy DEV cho Admin App ---');
    return {
      root: resolve(__dirname, 'src/admin'), // Thư mục gốc cho admin app
      // Cấu hình server dev cụ thể cho admin
      server: {
        port: 3001, // Admin app chạy trên cổng 3001
        open: '/dashboard.html', // Mở trang dashboard khi khởi động
      },
      build: {
        // Cấu hình build admin (sẽ không được dùng trong dev)
        outDir: 'public/admin_dist',
        rollupOptions: {
          input: {
            dashboard: resolve(__dirname, 'src/admin/dashboard.html'),
            login: resolve(__dirname, 'src/admin/login.html'),
            // ... các entry points khác của admin
          },
        },
      },
      // Thêm các plugin hoặc alias dành riêng cho admin nếu cần
    };
  } else if (mode === 'client') {
    console.log('--- Đang chạy DEV cho Client App ---');
    return {
      root: resolve(__dirname, 'src/client'), // Thư mục gốc cho client app
      server: {
        port: 3000, // Client app chạy trên cổng 3000
        open: true, // Mở trình duyệt với index.html mặc định
      },
      build: {
        // Cấu hình build client (sẽ không được dùng trong dev)
        outDir: 'public/client_dist',
        rollupOptions: {
          input: resolve(__dirname, 'src/client/index.html'),
        },
      },
      // Thêm các plugin hoặc alias dành riêng cho client nếu cần
    };
  }

  // Cấu hình mặc định cho dev (ví dụ: main app)
  console.log('--- Đang chạy DEV cho Main App ---');
  return {
    root: resolve(__dirname, 'src'), // Thư mục gốc mặc định
    server: {
      port: 3000, // Cổng mặc định cho main app
      open: true,
    },
    build: {
      // Cấu hình build mặc định
      outDir: 'public/default_dist',
      rollupOptions: {
        input: resolve(__dirname, 'src/index.html'),
      },
    },
    // ... cấu hình chung cho tất cả các chế độ hoặc mặc định
  };
});
Chạy các Chế độ Dev khác nhau
Bạn sẽ định nghĩa các script riêng biệt trong package.json để dễ dàng khởi động từng chế độ dev:

JSON

{
  "name": "my-project",
  "scripts": {
    "dev": "vite",               // Chạy chế độ dev mặc định (Main App)
    "dev:admin": "vite --mode admin", // Chạy chế độ dev cho Admin App
    "dev:client": "vite --mode client"  // Chạy chế độ dev cho Client App
    // ... các script build tương ứng
  }
}
Cách sử dụng:

Để chạy chế độ dev cho Main App: bun run dev (hoặc npm run dev / yarn dev)

Để chạy chế độ dev cho Admin App: bun run dev:admin

Để chạy chế độ dev cho Client App: bun run dev:client

Lưu ý quan trọng khi chạy Dev:
Một Vite Dev Server tại một thời điểm: Mỗi lệnh vite chỉ có thể khởi động một dev server. Nếu bạn muốn chạy cả dev:admin và dev:client cùng lúc, bạn sẽ cần mở hai cửa sổ terminal riêng biệt và chạy từng lệnh trong mỗi cửa sổ. Mỗi server sẽ lắng nghe trên một cổng khác nhau (ví dụ: 3000 và 3001).

root Option: Khi chạy dev với nhiều ứng dụng, tùy chọn root trong cấu hình Vite trở nên cực kỳ quan trọng.

root định nghĩa thư mục gốc của ứng dụng Vite hiện tại. Tất cả các đường dẫn tương đối (như import './style.css') sẽ được giải quyết tương đối với root này.

publicDir (nếu có) cũng được tìm kiếm tương đối với root.

Bạn cần đảm bảo root trỏ đúng đến thư mục chứa mã nguồn của ứng dụng bạn đang muốn phát triển (ví dụ: src/admin cho admin app, src/client cho client app).

build trong dev: Khi command là serve (chế độ dev), Vite sẽ không sử dụng cấu hình build. Tuy nhiên, việc giữ nó trong cùng một return block cho mỗi mode giúp tổ chức code và đảm bảo rằng cấu hình build tương ứng với chế độ dev đó đã sẵn sàng khi bạn chuyển sang build.

Với cách tiếp cận này, bạn có thể quản lý nhiều ứng dụng hoặc nhiều phần của một ứng dụng lớn trong một dự án Vite duy nhất, phục vụ chúng một cách độc lập trong quá trình phát triển.