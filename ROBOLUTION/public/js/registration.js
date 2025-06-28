// Function to handle showing/hiding payment section based on workshop selection
document.addEventListener('DOMContentLoaded', function() {
    const workshopCheckboxes = document.querySelectorAll('input[name="workshop[]"]');
    
    // Find the payment section - using a more compatible selector strategy
    let paymentSection = null;
    // Look for sections with IDs or specific content
    const allSections = document.querySelectorAll('.section');
    for (const section of allSections) {
        // Check if this section contains payment elements
        if (section.querySelector('#payment') || 
            section.querySelector('.payment-options') ||
            section.textContent.includes('PAYMENT OPTIONS')) {
            paymentSection = section;
            break;
        }
    }

    // Function to check if any workshop checkbox is selected
    function updatePaymentSection() {
        // Check if any workshop checkbox is selected
        const isAnyWorkshopSelected = Array.from(workshopCheckboxes).some(checkbox => {
            return checkbox.checked && checkbox.value !== 'OTHER';
        });

        // Only show payment section if a workshop is selected
        if (paymentSection) {
            paymentSection.style.display = isAnyWorkshopSelected ? 'block' : 'none';
            
            // Make payment upload required only if a workshop is selected
            const paymentInput = document.getElementById('payment');
            if (paymentInput) {
                if (isAnyWorkshopSelected) {
                    paymentInput.setAttribute('required', '');
                } else {
                    paymentInput.removeAttribute('required');
                }
            }
        }
    }

    // Add event listeners to all workshop checkboxes
    workshopCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updatePaymentSection);
    });

    // Initialize on page load
    updatePaymentSection();
}); 