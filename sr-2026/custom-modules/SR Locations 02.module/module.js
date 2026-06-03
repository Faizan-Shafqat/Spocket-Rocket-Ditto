document.addEventListener('DOMContentLoaded', () => {
    const moduleInstances = document.querySelectorAll('.sr-locations-02');

    moduleInstances.forEach(initializeModule);
});

function initializeModule(module) {
    const moduleId = module.getAttribute('data-module-id');
    const isEditMode = module.getAttribute('data-edit-mode') === 'true';
    const config = {
        arrow: module.getAttribute('data-arrow') === 'true',
        duration: Number.parseInt(module.getAttribute('data-duration')) || 500,
        maxWidth: Number.parseInt(module.getAttribute('data-width')) || 350,
        animation: module.getAttribute('data-animation') || 'scale'
    };

    const points = module.querySelectorAll('.dot');
    const mapBg = module.querySelector('.map-bg');

    // Add loaded class after a short delay to trigger animations
    setTimeout(() => module.classList.add('loaded'), 100);

    if (isEditMode) {
        initializeEditMode(module, points, mapBg);
    } else {
        initializeViewMode(points, config, moduleId);
    }
}

function initializeEditMode(module, points, mapBg) {
    // Initialize coordinates for existing dots
    points.forEach(initializeDotCoordinates);

    // Create new dot on click
    mapBg.addEventListener('mousedown', (e) => {
        if (e.target.closest('.dot')) return;

        const coords = getCoordinates(e, mapBg);
        const newDot = createDot(coords, module.querySelectorAll('.dot').length + 1);
        setupDotDragging(newDot, mapBg);
        mapBg.appendChild(newDot);
    });

    // Setup dragging for existing dots
    for (const point of points) {
        setupDotDragging(point, mapBg);
    }
}

function initializeViewMode(points, config, moduleId) {
    for (const point of points) {
        const placement = point.getAttribute('data-placement') || 'top';
        tippy(point, {
            content: point.querySelector('.dot-card-wrapper').innerHTML,
            allowHTML: true,
            placement,
            theme: 'custom',
            ...config,
            offset: [0, 22],
            role: 'tooltip',
            interactive: true,
            onCreate(instance) {
                instance.popper.classList.add(`tooltip-${moduleId}`);
            }
        });
    };
}

function initializeDotCoordinates(point) {
    const style = getComputedStyle(point);
    const x = Number.parseFloat(style.getPropertyValue('--x')) || 0;
    const y = Number.parseFloat(style.getPropertyValue('--y')) || 0;

    updateCoordinateDisplay(point, x.toFixed(1), y.toFixed(1));
}

function createDot(coords, index) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.setAttribute('data-index', index);
    dot.style.setProperty('--x', `${coords.x}%`);
    dot.style.setProperty('--y', `${coords.y}%`);

    dot.innerHTML = `
        <div class="dot-pointer"></div>
        <div class="coordinate-display">
            <p>X:<span class="x-coordinate">${coords.x}</span>%</p>
            <p>Y:<span class="y-coordinate">${coords.y}</span>%</p>
        </div>
    `;

    return dot;
}

function setupDotDragging(dot, mapBg) {
    const xDisplay = dot.querySelector('.x-coordinate');
    const yDisplay = dot.querySelector('.y-coordinate');
    let isDragging = false;

    function updatePosition(e) {
        const coords = getCoordinates(e, mapBg);
        updateCoordinateDisplay(dot, coords.x, coords.y);
        dot.style.setProperty('--x', `${coords.x}%`);
        dot.style.setProperty('--y', `${coords.y}%`);
    }

    function handlePointerMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        updatePosition(e);
    }

    function handlePointerUp(e) {
        if (!isDragging) return;
        isDragging = false;
        dot.classList.remove('dragging');
        dot.releasePointerCapture(e.pointerId);

        dot.removeEventListener('pointermove', handlePointerMove);
        dot.removeEventListener('pointerup', handlePointerUp);
        dot.removeEventListener('pointercancel', handlePointerUp);
    }

    dot.addEventListener('pointerdown', (e) => {
        if (e.button === 2) return; // Ignore right click
        isDragging = true;
        dot.classList.add('dragging');
        dot.setPointerCapture(e.pointerId);
        e.preventDefault();

        dot.addEventListener('pointermove', handlePointerMove);
        dot.addEventListener('pointerup', handlePointerUp);
        dot.addEventListener('pointercancel', handlePointerUp);
    });

    // Right click to delete dot
    dot.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        dot.remove();
    });
}

function getCoordinates(event, mapBg) {
    const rect = mapBg.getBoundingClientRect();
    return {
        x: ((event.clientX - rect.left) / rect.width * 100).toFixed(1),
        y: (100 - (event.clientY - rect.top) / rect.height * 100).toFixed(1)
    };
}

function updateCoordinateDisplay(dot, x, y) {
    const xDisplay = dot.querySelector('.x-coordinate');
    const yDisplay = dot.querySelector('.y-coordinate');
    if (xDisplay) xDisplay.textContent = x;
    if (yDisplay) yDisplay.textContent = y;
}