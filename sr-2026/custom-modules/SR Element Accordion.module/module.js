document.querySelectorAll('.sr-accordion').forEach(accordion => {
	const accordionContent = accordion.querySelectorAll('.accordion_content');
	const expandedContent = accordion.querySelector('.accordion_group.expanded .accordion_content');
	if (expandedContent) {
		const contentHeight = expandedContent.scrollHeight;
		const contentPadding =
			  parseInt(window.getComputedStyle(expandedContent).getPropertyValue('padding-top')) +
			  parseInt(window.getComputedStyle(expandedContent).getPropertyValue('padding-bottom'));
		const contentBorder =
			  parseInt(window.getComputedStyle(expandedContent).getPropertyValue('border-top-width')) +
			  parseInt(window.getComputedStyle(expandedContent).getPropertyValue('border-bottom-width'));
		expandedContent.style.maxHeight = `${contentHeight + contentPadding + contentBorder}px`;
	}

	const accordionHeader = accordion.querySelectorAll('.accordion_header');
	accordionHeader.forEach(header => {
		header.addEventListener('click', function () {
			const accordionGroup = this.parentElement;
			const accordionContent = accordionGroup.querySelector('.accordion_content');
			accordionGroup.classList.toggle('expanded');
			if (accordionGroup.classList.contains('expanded')) {
				const contentHeight = accordionContent.scrollHeight;
				const contentPadding =
					  parseInt(window.getComputedStyle(accordionContent).getPropertyValue('padding-top')) +
					  parseInt(window.getComputedStyle(accordionContent).getPropertyValue('padding-bottom'));
				const contentBorder =
					  parseInt(window.getComputedStyle(accordionContent).getPropertyValue('border-top-width')) +
					  parseInt(window.getComputedStyle(accordionContent).getPropertyValue('border-bottom-width'));
				accordionContent.style.maxHeight = `${contentHeight + contentPadding + contentBorder}px`;
			} else {
				accordionContent.style.maxHeight = null;
			}
		});
	});
});