document.addEventListener('DOMContentLoaded', function() {
    const moduleInstances = document.querySelectorAll('.sr-image-hotspot-01');

    moduleInstances.forEach(initializeModule);
});

function initializeModule(module) {
    const moduleId = module.getAttribute('data-module-id');
    const isEditMode = module.getAttribute('data-edit-mode') === 'true';
    const config = {
        arrow: module.getAttribute('data-arrow') === 'true',
        duration: parseInt(module.getAttribute('data-duration')) || 500,
        maxWidth: parseInt(module.getAttribute('data-width')) || 350,
        animation: module.getAttribute('data-animation') || 'scale'
    };

    const points = module.querySelectorAll('.point');
    const mainImage = module.querySelector('.main-image');

    if (isEditMode) {
        initializeEditMode(module, points, mainImage);
    } else {
        initializeViewMode(points, config, moduleId);
    }
}

function initializeEditMode(module, points, mainImage) {
    // Initialize coordinates for existing points
    points.forEach(initializePointCoordinates);

    // Create new point on click
    mainImage.addEventListener('mousedown', (e) => {
        if (e.target.closest('.point')) return;

        const coords = getCoordinates(e, mainImage);
        const newPoint = createPoint(coords, module.querySelectorAll('.point').length + 1);
        setupPointDragging(newPoint, mainImage);
        mainImage.appendChild(newPoint);
    });

    // Setup dragging for existing points
    for (const point of points) {
        setupPointDragging(point, mainImage);
    }
}

function initializeViewMode(points, config, moduleId) {
    for (const point of points) {
        const placement = point.getAttribute('data-placement') || 'top';
        tippy(point, {
            content: point.querySelector('.point__tooltip').innerHTML,
            allowHTML: true,
            placement: placement,
            theme: 'custom',
            arrow: config.arrow,
            duration: config.duration,
            offset: [0, 22],
            maxWidth: config.maxWidth,
            animation: config.animation,
            role: 'tooltip',
            interactive: true,
            onCreate(instance) {
                instance.popper.classList.add(`tooltip-${moduleId}`);
            }
        });
    }
}

function initializePointCoordinates(point) {
    const style = getComputedStyle(point);
    const x = parseFloat(style.getPropertyValue('--x')) || 0;
    const y = parseFloat(style.getPropertyValue('--y')) || 0;

    updateCoordinateDisplay(point, x.toFixed(1), y.toFixed(1));
}

function createPoint(coords, index) {
    const point = document.createElement('button');
    point.className = 'point';
    point.type = 'button';
    point.setAttribute('data-index', index);
    point.style.setProperty('--x', `${coords.x}%`);
    point.style.setProperty('--y', `${coords.y}%`);
    point.style.setProperty('--icon-width', '18px');
    point.style.bottom = `calc(${coords.y}% - var(--icon-width)/2)`;
    point.style.left = `calc(${coords.x}% - var(--icon-width)/2)`;

    point.innerHTML = `
        <div class="point__icon point__icon-${index}" style="--icon-color: var(--primary); --icon-background: rgba(255, 255, 255, 0.9);">
            <span class="icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                </svg>
            </span>
        </div>
        <div class="coordinate-display">
            <p>X:<span class="x-coordinate">${coords.x}</span>%</p>
            <p>Y:<span class="y-coordinate">${coords.y}</span>%</p>
        </div>
        <div class="point__tooltip">
            <div>
                <h4>New Point ${index}</h4>
                <div class="col-content">Click to configure this point</div>
            </div>
        </div>
    `;

    return point;
}

function setupPointDragging(point, mainImage) {
    const xDisplay = point.querySelector('.x-coordinate');
    const yDisplay = point.querySelector('.y-coordinate');
    let isDragging = false;

    function updatePosition(e) {
        const coords = getCoordinates(e, mainImage);
        updateCoordinateDisplay(point, coords.x, coords.y);
        point.style.setProperty('--x', `${coords.x}%`);
        point.style.setProperty('--y', `${coords.y}%`);
        point.style.bottom = `calc(${coords.y}% - var(--icon-width)/2)`;
        point.style.left = `calc(${coords.x}% - var(--icon-width)/2)`;
    }

    function handlePointerMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        updatePosition(e);
    }

    function handlePointerUp(e) {
        if (!isDragging) return;
        isDragging = false;
        point.classList.remove('dragging');
        point.releasePointerCapture(e.pointerId);

        point.removeEventListener('pointermove', handlePointerMove);
        point.removeEventListener('pointerup', handlePointerUp);
        point.removeEventListener('pointercancel', handlePointerUp);
    }

    point.addEventListener('pointerdown', (e) => {
        if (e.button === 2) return; // Ignore right click
        isDragging = true;
        point.classList.add('dragging');
        point.setPointerCapture(e.pointerId);
        e.preventDefault();

        point.addEventListener('pointermove', handlePointerMove);
        point.addEventListener('pointerup', handlePointerUp);
        point.addEventListener('pointercancel', handlePointerUp);
    });

    // Right click to delete point
    point.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        point.remove();
    });
}

function getCoordinates(event, mainImage) {
    const rect = mainImage.getBoundingClientRect();
    return {
        x: ((event.clientX - rect.left) / rect.width * 100).toFixed(1),
        y: (100 - (event.clientY - rect.top) / rect.height * 100).toFixed(1)
    };
}

function updateCoordinateDisplay(point, x, y) {
    const xDisplay = point.querySelector('.x-coordinate');
    const yDisplay = point.querySelector('.y-coordinate');
    if (xDisplay) xDisplay.textContent = x;
    if (yDisplay) yDisplay.textContent = y;
}
