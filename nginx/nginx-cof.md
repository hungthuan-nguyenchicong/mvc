# cai dat
cd /var/www/html

## link project
sudo ln -s /mnt/e/webside/mvc /var/www/html/mvc
### kiem tra link 
ls /var/www/html

## unlink /etc/nginx/sites-enabled
ls /etc/nginx/sites-enabled
sudo unlink /etc/nginx/sites-enabled/default

## ln -s /var/www/html/mvc
sudo ln -s /var/www/html/mvc/nginx/nginx-mvc /etc/nginx/sites-enabled/nginx-mvc
ls /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl reload nginx

http://localhost/
