const cardBlocks = document.querySelectorAll('.sr-cards-flip-01 .trigger-click .card-block');
const toggleExpand = (element) => {
  const parentCard = element.parentElement;
  const isCurrentlyExpanded = parentCard.classList.contains('expand');
  
  // Close all cards first
  cardBlocks.forEach(card => {
    card.parentElement.classList.remove('expand');
  });
  
  // If the clicked card wasn't expanded, expand it
  if (!isCurrentlyExpanded) {
    parentCard.classList.add('expand');
  }
};

cardBlocks.forEach(card => {
  card.addEventListener('click', () => toggleExpand(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleExpand(card);
    }
  });
});