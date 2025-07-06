
(function() {
    // Embed configuration
    const config = {
        containerId: 'recovery-order-form',
        formUrl: window.location.origin + '/embed-order-form.html',
        width: '100%',
        height: '800px',
        minHeight: '600px'
    };

    // Create the embed function
    function embedRecoveryOrderForm(options = {}) {
        // Merge options with defaults
        const settings = {
            ...config,
            ...options
        };

        // Find the container
        const container = document.getElementById(settings.containerId);
        if (!container) {
            console.error('Recovery Order Form: Container element not found. Please ensure you have a div with id="' + settings.containerId + '"');
            return;
        }

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src = settings.formUrl;
        iframe.style.width = settings.width;
        iframe.style.height = settings.height;
        iframe.style.minHeight = settings.minHeight;
        iframe.style.border = 'none';
        iframe.style.borderRadius = '12px';
        iframe.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        iframe.frameBorder = '0';
        iframe.scrolling = 'auto';
        iframe.title = 'Recovery Equipment Order Form';

        // Make responsive
        iframe.style.maxWidth = '100%';
        
        // Handle responsive height
        function adjustHeight() {
            if (window.innerWidth < 768) {
                iframe.style.height = '900px';
            } else {
                iframe.style.height = settings.height;
            }
        }

        // Adjust height on load and resize
        adjustHeight();
        window.addEventListener('resize', adjustHeight);

        // Clear container and add iframe
        container.innerHTML = '';
        container.appendChild(iframe);

        // Add loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.innerHTML = '<div style="text-align: center; padding: 40px; font-family: Arial, sans-serif; color: #666;">Loading order form...</div>';
        container.insertBefore(loadingDiv, iframe);

        // Remove loading indicator when iframe loads
        iframe.onload = function() {
            if (loadingDiv.parentNode) {
                loadingDiv.parentNode.removeChild(loadingDiv);
            }
        };

        return iframe;
    }

    // Auto-embed if container exists
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (document.getElementById(config.containerId)) {
                embedRecoveryOrderForm();
            }
        });
    } else {
        if (document.getElementById(config.containerId)) {
            embedRecoveryOrderForm();
        }
    }

    // Make function globally available
    window.embedRecoveryOrderForm = embedRecoveryOrderForm;
})();
