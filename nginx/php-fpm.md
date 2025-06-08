# cai dat php

sudo apt install php-fpm
php -v PHP 8.3.6

sudo systemctl start php8.3-fpm
sudo systemctl enable php8.3-fpm

## sua file nginx-mvc.conf
index index.html index.htm index.php;
location ~ \.php$ {
		include snippets/fastcgi-php.conf;
	
		# With php-fpm (or other unix sockets):
		fastcgi_pass unix:/run/php/php8.3-fpm.sock;
		# With php-cgi (or other tcp sockets):
		# fastcgi_pass 127.0.0.1:9000;
	}

sudo systemctl reload nginx

## test info.php

phpinfor();

