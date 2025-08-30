console.log("Client-side JavaScript đã tải.");
document.addEventListener("DOMContentLoaded", () => {
  const counterButton = document.getElementById("counter-button");
  const appMessage = document.getElementById("app-message");
  const clientMessage = document.getElementById("client-message");
  let count = 0;
  if (appMessage) {
    appMessage.textContent = "Phần 'app' đã được render từ máy chủ và bây giờ được 'hydrate' bởi client-side JS.";
  } else {
    console.warn("Phần tử với id 'app-message' không được tìm thấy. Vui lòng đảm bảo nó được SSR.");
  }
  if (counterButton) {
    counterButton.textContent = `Nhấn vào đây: ${count}`;
    counterButton.addEventListener("click", () => {
      count++;
      counterButton.textContent = `Nhấn vào đây: ${count}`;
    });
  } else {
    console.warn("Phần tử với id 'counter-button' không được tìm thấy. Vui lòng đảm bảo nó được SSR.");
  }
  if (clientMessage) {
    clientMessage.style.color = "#10b981";
    clientMessage.textContent = "Thông báo từ client-side.";
  } else {
    console.warn("Phần tử với id 'client-message' không được tìm thấy. Vui lòng đảm bảo nó được SSR.");
  }
});
