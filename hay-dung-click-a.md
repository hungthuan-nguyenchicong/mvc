## ngăn router fronend

// Check if the clicked element is an 'a' tag with 'Edit' text
        if (event.target.tagName === 'A' && event.target.textContent === 'Edit') {
            const isConfirmed = confirm('Bạn có muốn sửa bài viết này không?');
            if (!isConfirmed) {
                event.preventDefault(); // Stop the default link behavior
                event.stopPropagation(); // Stop the event from bubbling up
            }
        }