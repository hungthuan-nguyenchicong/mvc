<?php

class View {
    /**
     * Renders a view file.
     *
     * @param string $viewDir The base directory for views (e.g., './').
     * @param string $viewPath The path within the 'Views' directory (e.g., 'auth', 'dashboard').
     * @param string $viewName The name of the view file (without .php extension).
     * @param array|null $data An associative array of data to pass to the view.
     * @return bool True if the view was rendered successfully, false otherwise.
     */
    private static function render(string $viewDir, string $viewPath, string $viewName, ?array $data = null): bool {
        // Construct the full path to the view file
        $viewFile = $viewDir . '/Views/' . $viewPath . '/' . $viewName . '.php';

        if (is_file($viewFile)) {
            // Extract data into the local scope so it's accessible in the view
            if ($data) {
                extract($data);
            }
            require_once $viewFile; // Use require_once to prevent re-declaration issues
            return true;
        } else {
            // Log the error and return a 404 response
            //error_log('View file not found: ' . $viewFile); // Good for debugging
            http_response_code(404);
            echo 'Error: View file not found.'; // A more generic message for the user
            return false;
        }
    }

    /**
     * Renders an admin view. This is a convenience method.
     *
     * @param string $viewPath The path within the 'Admin/Views' directory.
     * @param string $viewName The name of the view file.
     * @param array|null $data An associative array of data to pass to the view.
     * @return bool True if the view was rendered successfully, false otherwise.
     */
    public static function admin(string $viewPath, string $viewName, ?array $data = null): bool {
        // Fix: Pass the $data variable correctly to the render method
        return self::render('./../../Admin', $viewPath, $viewName, $data);
    }
}

?>