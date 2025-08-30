# kiểm tra tất cả các dịch vụ đang chạy

sudo systemctl list-units --type=service --state=running

# tăt dịch vụ

sudo systemctl disable --now <tên_dịch_vụ>

sudo systemctl disable --now nginx.service

sudo systemctl disable --now php8.3-fpm.service

sudo systemctl disable --now postgresql@16-main.service