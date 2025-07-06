
(function() {
    // Configuration
    const config = {
        containerId: 'facedown-order-form',
        baseUrl: 'https://facedownrecoveryequipment.com',
        cssUrl: 'https://cdn.tailwindcss.com',
        minHeight: '800px'
    };

    // Create the embed function
    function embedFacedownOrderForm(options = {}) {
        // Merge options with defaults
        const settings = {
            ...config,
            ...options
        };

        // Find the container
        const container = document.getElementById(settings.containerId);
        if (!container) {
            console.error('Facedown Order Form: Container element not found. Please ensure you have a div with id="' + settings.containerId + '"');
            return;
        }

        // Load Tailwind CSS if not already loaded
        if (!document.querySelector('link[href*="tailwindcss"]') && !document.querySelector('script[src*="tailwindcss"]')) {
            const tailwindScript = document.createElement('script');
            tailwindScript.src = settings.cssUrl;
            document.head.appendChild(tailwindScript);
            
            // Configure Tailwind
            tailwindScript.onload = function() {
                if (window.tailwind) {
                    window.tailwind.config = {
                        theme: {
                            extend: {
                                colors: {
                                    'medical-blue': '#154897',
                                    'medical-green': '#159764',
                                    'medical-burgundy': '#971548',
                                    'medical-amber': '#976415'
                                }
                            }
                        }
                    };
                }
            };
        }

        // Add loading indicator
        container.innerHTML = `
            <div style="
                text-align: center; 
                padding: 40px; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
                color: #666;
                min-height: ${settings.minHeight};
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f8fafc;
                border-radius: 12px;
            ">
                <div>
                    <div style="
                        width: 40px; 
                        height: 40px; 
                        border: 3px solid #159764; 
                        border-top: 3px solid transparent; 
                        border-radius: 50%; 
                        animation: spin 1s linear infinite; 
                        margin: 0 auto 16px;
                    "></div>
                    <div>Loading order form...</div>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;

        // Fetch the order form content
        fetch(settings.baseUrl + '/order1')
            .then(response => response.text())
            .then(html => {
                // Extract the main content from the HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Get the main content (skip navigation, etc.)
                const mainContent = doc.querySelector('main') || doc.querySelector('[class*="container"]') || doc.body;
                
                if (mainContent) {
                    // Clear container and add the content
                    container.innerHTML = mainContent.innerHTML;
                    
                    // Apply responsive styles
                    container.style.minHeight = settings.minHeight;
                    container.style.width = '100%';
                    container.style.maxWidth = '100%';
                    container.style.overflow = 'hidden';
                    
                    // Execute any scripts in the loaded content
                    const scripts = container.querySelectorAll('script');
                    scripts.forEach(script => {
                        const newScript = document.createElement('script');
                        if (script.src) {
                            newScript.src = script.src;
                        } else {
                            newScript.textContent = script.textContent;
                        }
                        document.head.appendChild(newScript);
                    });
                }
            })
            .catch(error => {
                console.error('Error loading order form:', error);
                container.innerHTML = `
                    <div style="
                        text-align: center; 
                        padding: 40px; 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
                        color: #dc2626;
                        min-height: ${settings.minHeight};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #fef2f2;
                        border: 1px solid #fecaca;
                        border-radius: 12px;
                    ">
                        <div>
                            <div style="font-size: 24px; margin-bottom: 8px;">⚠️</div>
                            <div>Unable to load order form. Please try again later.</div>
                        </div>
                    </div>
                `;
            });

        return container;
    }

    // Auto-embed if container exists
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (document.getElementById(config.containerId)) {
                embedFacedownOrderForm();
            }
        });
    } else {
        if (document.getElementById(config.containerId)) {
            embedFacedownOrderForm();
        }
    }

    // Make function globally available
    window.embedFacedownOrderForm = embedFacedownOrderForm;
})();
