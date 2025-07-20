## Tải Động cho các thành phần Backend (Controller, Model, View)

Ví dụ Cụ thể:
Giả sử bạn có một module OrderService rất lớn và phức tạp:

TypeScript

// backend/src/services/OrderService.ts
import { db } from '../config/database'; // Giả định
import { EmailService } from './EmailService'; // Giả định
import { PaymentGateway } from './PaymentGateway'; // Giả định

export class OrderService {
    private emailService: EmailService;
    private paymentGateway: PaymentGateway;

    constructor() {
        console.log('OrderService module loaded and initialized!');
        this.emailService = new EmailService();
        this.paymentGateway = new PaymentGateway();
    }

    async createOrder(userId: string, cartItems: any[], paymentInfo: any) {
        // Rất nhiều logic phức tạp:
        // 1. Validate cart items and payment info
        // 2. Process payment via payment gateway
        // 3. Save order to database (multiple tables: orders, order_items)
        // 4. Update product stock
        // 5. Send confirmation email
        // ...
        console.log(`Creating order for user ${userId}...`);
        // Simulate database and external service calls
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate DB write
        await this.paymentGateway.processPayment(paymentInfo);
        await this.emailService.sendOrderConfirmation(userId);
        console.log('Order created successfully!');
        return { orderId: 'ORD-' + Date.now(), status: 'completed' };
    }
}
Trong router hoặc controller của bạn:

TypeScript

// backend/src/controllers/PublicController.ts (hoặc server.ts)
import { serve } from "bun";

serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);

    // --- Xử lý ĐẶT HÀNG (POST /api/orders) ---
    if (url.pathname === '/api/orders' && request.method === 'POST') {
      try {
        console.log("Request to create order. Dynamically importing OrderService...");

        // Tải động OrderService chỉ khi có yêu cầu đặt hàng
        const { OrderService } = await import('../services/OrderService.ts');
        const orderService = new OrderService();

        const requestBody = await request.json(); // Đọc dữ liệu từ request

        const userId = requestBody.userId;
        const cartItems = requestBody.items;
        const paymentInfo = requestBody.payment;

        // Gọi logic xử lý đặt hàng
        const newOrder = await orderService.createOrder(userId, cartItems, paymentInfo);

        return new Response(JSON.stringify({ success: true, order: newOrder }), {
          headers: { 'Content-Type': 'application/json' },
        });

      } catch (error) {
        console.error('Error creating order:', error);
        return new Response(JSON.stringify({ success: false, message: 'Failed to create order' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // --- Các chức năng ĐỌC thông thường (Import tĩnh) ---
    if (url.pathname === '/api/products' && request.method === 'GET') {
      // Giả sử ProductService là nhỏ và thường xuyên được dùng, nên được import tĩnh ở đầu file nếu không quá lớn
      // import { ProductService } from '../services/ProductService.ts';
      // const products = await ProductService.getAllProducts();
      // return new Response(JSON.stringify(products), ...);
      return new Response(JSON.stringify({ message: 'Products list (static import)' }));
    }

    return new Response('API endpoint not found', { status: 404 });
  },
});

console.log('Bun server running with mixed import strategies on http://localhost:3000');
Ưu và Nhược điểm của chiến lược này (Client Public: Đọc tĩnh, Ghi động)
Ưu điểm:

Tối ưu hóa Thời gian Khởi động & Bộ nhớ cho các Chức năng Đọc (Core): Các chức năng đọc cốt lõi (ví dụ: hiển thị sản phẩm) được tải tĩnh, đảm bảo chúng luôn sẵn sàng trong bộ nhớ và phản hồi cực nhanh, không có cold start.

Giảm Tiêu thụ Bộ nhớ Tổng thể: Các module phức tạp liên quan đến ghi chỉ được tải vào RAM khi chúng thực sự được kích hoạt, giảm áp lực lên bộ nhớ server khi không có hành động ghi.

Giảm Thời gian Khởi động Server Tổng thể: Nếu các module ghi này rất lớn, việc tải động chúng sẽ giúp server của bạn khởi động nhanh hơn đáng kể.

Phân tách Logic Hiệu quả: Tăng cường sự tách biệt giữa logic đọc và ghi, giúp quản lý code dễ hơn.

Nhược điểm:

Độ trễ Nhỏ cho Request Ghi Đầu tiên: Người dùng có thể cảm nhận một độ trễ rất nhỏ cho lần đầu tiên module ghi cụ thể đó được tải (ví dụ: lần đầu tiên ai đó thêm vào giỏ hàng hoặc đặt hàng trong một phiên mới của server). Tuy nhiên, như đã phân tích, điều này thường chấp nhận được đối với các hành động ghi.

Độ phức tạp trong Codebase: Quản lý các điểm tải động, đặc biệt khi có nhiều module lớn cần tải động, có thể làm cho code base hơi phức tạp hơn so với việc tải tĩnh tất cả. Cần đảm bảo rằng các module được tải động được xử lý đúng cách và các lỗi tải được bắt.

