/**********************************************************************************************************************
This function ensures that the provided callback function fn is executed when the DOM is ready.
It checks the document.readyState to determine if the DOM is already loaded or still being parsed,
and triggers the callback accordingly.
@param {function} fn - The callback function to be executed when the DOM is ready.
*/

function ready (fn) {
	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		// DOM is already loaded or being parsed, execute the callback asynchronously after a short delay
		setTimeout(fn, 1);

		// Remove the event listener to avoid duplicate execution
		document.removeEventListener('DOMContentLoaded', fn);
	} else {
		// DOM is still being loaded, add an event listener to execute the callback when DOMContentLoaded event occurs
		document.addEventListener('DOMContentLoaded', fn);
	}
}

function initializeMultistepForm (element) {
	// Global Constants
	const sr_module = element;
	const multistepForm = sr_module.querySelector('.multistep-form__form');

	const tabItems = multistepForm.querySelectorAll('[role="tab"]'),
		tabPanels = multistepForm.querySelectorAll('[role="tabpanel"]');

	window.addEventListener('message', (event) => {
		if ('hsFormCallback' === event.data.type && 'onFormReady' === event.data.eventName) {
			handlePrefilled();
		}
	});

	let currentStep = 0;

	// Form Validation

	/**********************************************************************************************************************
	This function checks if the provided value is a valid phone number.
	@param {string} val - The value to be checked as a phone number.
	@returns {boolean} - Returns true if the value is a valid phone number, false otherwise.
	*/

	const isValidPhone = (val) => /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/i.test(val);

	/**********************************************************************************************************************
	This function checks if the provided value is a valid email address.
	@param {string} val - The value to be checked as an email address.
	@returns {boolean} - Returns true if the value is a valid email address, false otherwise.
	*/

	const isValidEmail = (val) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/.test(val);

	/**********************************************************************************************************************
	This function validates a text field by checking if it is empty or not based on its value and required attribute.
	@param {HTMLInputElement} field - The text field element to be validated.
	@returns {Object} - Returns an object with a boolean property 'isValid' indicating if the field is valid or not.
	*/

	const validateText = (field) => {
		const val = field.value.trim();
		return {
			isValid: !(val === '' && field.required),
		};
	};

	/**********************************************************************************************************************
	This function validates a select field by checking if an option is selected or not based on its value and required attribute.
	@param {HTMLSelectElement} field - The select field element to be validated.
	@returns {Object} - Returns an object with a boolean property 'isValid' indicating if the field is valid or not, and an optional 'message' property for error message.
	*/

	const validateSelect = (field) => {
		const val = field.value.trim();
		return val === '' && field.required ? { isValid: false, message: 'Please select an option from the dropdown menu.' } : { isValid: true };
	};

	/**********************************************************************************************************************
	This function validates a group of radio buttons or checkboxes within a fieldset by checking if any option is selected or not based on their required attribute.
	@param {HTMLFieldSetElement} fieldset - The fieldset element containing the radio buttons or checkboxes to be validated.
	@returns {Object} - Returns an object with a boolean property 'isValid' indicating if the group is valid or not, and an optional 'message' property for error message.
	*/

	const validateGroup = (fieldset) => {
		const choices = fieldset.querySelectorAll('input[type="radio"], input[type="checkbox"]');
		let isRequired = false,
			isChecked = false;

		for (const choice of choices) {
			if (choice.required) isRequired = true;
			if (choice.checked) isChecked = true;
		}

		return !isChecked && isRequired ? { isValid: false, message: 'Please make a selection.' } : { isValid: true };
	};

	/**********************************************************************************************************************
	This function validates a choice field (radio button or checkbox) by checking if any option is selected within its closest fieldset element.
	@param {HTMLInputElement} field - The choice field element to be validated.
	@returns {Object} - Returns an object with a boolean property 'isValid' indicating if the field is valid or not, and an optional 'message' property for error message.
	*/

	const validateChoice = (field) => validateGroup(field.closest('fieldset'));

	/**********************************************************************************************************************
	This function validates a phone number field by checking if it is empty (when required) or if it is a valid phone number.
	@param {HTMLInputElement} field - The phone number field element to be validated.
	@returns {Object} - Returns an object with a boolean property 'isValid' indicating if the field is valid or not, and an optional 'message' property for error message.
	*/

	const validatePhone = (field) => {
		const val = field.value.trim();

		if (val === '' && field.required) {
			return { isValid: false };
		}

		return val === '' || isValidPhone(val) ? { isValid: true } : { isValid: false, message: 'Please provide a valid phone number.' };
	};

	/**********************************************************************************************************************
	This function validates an email field by checking if it is empty (when required) or if it is a valid email address.
	@param {HTMLInputElement} field - The email field element to be validated.
	@returns {Object} - Returns an object with a boolean property 'isValid' indicating if the field is valid or not, and an optional 'message' property for error message.
	*/

	const validateEmail = (field) => {
		const val = field.value.trim();

		if (val === '' && field.required) {
			return { isValid: false };
		}

		return val === '' || isValidEmail(val) ? { isValid: true } : { isValid: false, message: 'Please provide a valid email address.' };
	};

	/**********************************************************************************************************************

	This function retrieves validation data for a given field based on its type.
	@param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field - The field element to retrieve validation data for.
	@returns {Object} - Returns an object with validation data including 'isValid' property indicating if the field is valid or not, and an optional 'message' property for error message.
	@throws {Error} - Throws an error if the provided field type is not supported in the form.
	*/

	const getValidationData = (field) => {
		switch (field.type) {
			case 'text':
			case 'textarea':
				return validateText(field);
			case 'select-one':
				return validateSelect(field);
			case 'fieldset':
				return validateGroup(field);
			case 'radio':
			case 'checkbox':
				return validateChoice(field);
			case 'tel':
				return validatePhone(field);
			case 'email':
				return validateEmail(field);
			default:
				throw new Error(`The provided field type '${field.tagName}:${field.type}' is not supported in this form.`);
		}
	};

	/**********************************************************************************************************************
	This function checks if a field is valid based on its validation data.
	@param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field - The field element to check for validity.
	@returns {boolean} - Returns true if the field is valid, false otherwise.
	*/

	const isValid = (field) => getValidationData(field).isValid;

	/**********************************************************************************************************************
	This function validates all fields within a given step and returns a promise that resolves if all fields are valid or rejects with an array of invalid fields.
	@param {number} currentStep - The index of the current step to validate.
	@returns {Promise} - Returns a promise that resolves if all fields are valid or rejects with an array of invalid fields.
	*/

	const validateStep = (currentStep) => {
		const fields = tabPanels[currentStep].querySelectorAll('fieldset, input:not([type="radio"]):not([type="checkbox"]), select, textarea');
		const invalidFields = [...fields].filter((field) => !isValid(field));

		return new Promise((resolve, reject) => (invalidFields.length === 0 ? resolve() : reject(invalidFields)));
	};

	// Form Error and Success

	const FIELD_PARENT_CLASS = 'form__field',
		FIELD_ERROR_CLASS = 'form__error-text';

	/**********************************************************************************************************************
	This function updates the validation status and error message for a group of radio or checkbox input elements within a fieldset.
	@param {Node} fieldset - The fieldset element that contains the radio or checkbox input elements.
	@param {string} status - The validation status of the group. (e.g., 'valid', 'invalid')
	@param {string} errorId - Optional. The ID of the error message element to associate with the inputs.
	*/

	function updateChoice (fieldset, status, errorId = '') {
		const choices = fieldset.querySelectorAll('[type="radio"], [type="checkbox"]');

		for (const choice of choices) {
			if (status) {
				choice.setAttribute('aria-invalid', 'true');
				choice.setAttribute('aria-describedby', errorId);
			} else {
				choice.removeAttribute('aria-invalid');
				choice.removeAttribute('aria-describedby');
			}
		}
	}

	/**********************************************************************************************************************
	This function reports an error for a given field by adding an error message element and updating the validation status of the field.
	@param {HTMLElement} field - The field element to report the error for.
	@param {string} message - Optional. The error message to display. Default is 'Please complete this required field.'
	*/

	function reportError (field, message = 'Please complete this required field.') {
		const fieldParent = field.closest(`.${FIELD_PARENT_CLASS}`);

		if (multistepForm.contains(fieldParent)) {
			let fieldError = fieldParent.querySelector(`.${FIELD_ERROR_CLASS}`),
				fieldErrorId = '';

			if (!fieldParent.contains(fieldError)) {
				fieldError = document.createElement('p');
				if (field.matches('fieldset')) {
					fieldErrorId = `${field.id}__error`;
					updateChoice(field, true, fieldErrorId);
				} else if (field.matches('[type="radio"], [type="checkbox"]')) {
					fieldErrorId = `${field.closest('fieldset').id}__error`;
					updateChoice(field.closest('fieldset'), true, fieldErrorId);
				} else {
					fieldErrorId = `${field.id}__error`;
					field.setAttribute('aria-invalid', 'true');
					field.setAttribute('aria-describedby', fieldErrorId);
				}
				fieldError.id = fieldErrorId;
				fieldError.classList.add(FIELD_ERROR_CLASS);
				fieldParent.appendChild(fieldError);
			}

			fieldError.textContent = message;
		}
	}

	/**********************************************************************************************************************
	This function reports a success state for a given field by removing the error message element and updating the validation status of the field.
	@param {HTMLElement} field - The field element to report the success state for.
	*/

	function reportSuccess (field) {
		const fieldParent = field.closest(`.${FIELD_PARENT_CLASS}`);

		if (multistepForm.contains(fieldParent)) {
			const fieldError = fieldParent.querySelector(`.${FIELD_ERROR_CLASS}`);

			if (fieldParent.contains(fieldError)) {
				if (field.matches('fieldset')) {
					updateChoice(field, false);
				} else if (field.matches('[type="radio"], [type="checkbox"]')) {
					updateChoice(field.closest('fieldset'), false);
				} else {
					field.removeAttribute('aria-invalid');
					field.removeAttribute('aria-describedby');
				}
				fieldParent.removeChild(fieldError);
			}
		}
	}

	/**********************************************************************************************************************
	This function reports the validity of a given field by calling the appropriate error reporting function based on its validation data.
	@param {HTMLElement} field - The field element to report the validity for.
	*/

	function reportValidity (field) {
		const validation = getValidationData(field);

		if (!validation.isValid && validation.message) {
			reportError(field, validation.message);
		} else if (!validation.isValid) {
			reportError(field);
		} else {
			reportSuccess(field);
		}
	}

	// Form Progression

	/**********************************************************************************************************************
	This function deactivates all tab items and panels by resetting their attributes.
	*/

	function deactivateTabs () {
		tabItems.forEach((tab) => {
			tab.setAttribute('aria-selected', 'false');
			tab.setAttribute('tabindex', '-1');
		});

		tabPanels.forEach((panel) => {
			panel.setAttribute('hidden', '');
		});
	}

	/**********************************************************************************************************************
	This function activates a tab and its associated panel by updating their attributes and focusing the tab element.
	@param {number} index - The index of the tab to activate.
	*/

	function activateTab (index) {
		const thisTab = tabItems[index];
		const thisPanel = tabPanels[index];

		deactivateTabs();

		thisTab.focus();
		thisTab.setAttribute('aria-selected', 'true');
		thisTab.removeAttribute('tabindex');

		thisPanel.removeAttribute('hidden');

		currentStep = index;
	}

	/**********************************************************************************************************************
	This function triggers the activation of a tab based on a click event by calling the activateTab function with the index of the clicked tab.
	@param {Event} e - The click event.
	*/

	function clickTab (e) {
		activateTab([...tabItems].indexOf(e.currentTarget));
	}

	/**********************************************************************************************************************
	This function handles tab navigation using arrow keys by activating the previous or next tab based on the key.
	@param {KeyboardEvent} e - The keyboard event.
	*/

	function arrowTab (e) {
		const { key, target } = e;

		const targetPrev = target.previousElementSibling;
		const targetNext = target.nextElementSibling;
		const targetFirst = target.parentElement.firstElementChild;
		const targetLast = target.parentElement.lastElementChild;

		const isDisabled = (node) => node.hasAttribute('aria-disabled');

		switch (key) {
			case 'ArrowLeft':
				if (multistepForm.contains(targetPrev) && !isDisabled(targetPrev)) {
					activateTab(currentStep - 1);
				} else if (!isDisabled(targetLast)) {
					activateTab(tabItems.length - 1);
				}
				break;
			case 'ArrowRight':
				if (multistepForm.contains(targetNext) && !isDisabled(targetNext)) {
					activateTab(currentStep + 1);
				} else if (!isDisabled(targetFirst)) {
					activateTab(0);
				}
				break;
		}
	}

	/**********************************************************************************************************************
	This function updates the visual state of the progress bar and enables the next tab for interaction (if available).
	@param {boolean} isComplete - Indicates whether the current step is complete or not.
	*/

	// Immediately attach event listeners to the first tab (happens only once)
	tabItems[0].addEventListener('click', clickTab);
	tabItems[0].addEventListener('keydown', arrowTab);

	function handleProgress (isComplete) {
		const currentTab = tabItems[currentStep];
		const nextTab = tabItems[currentStep + 1];

		if (isComplete) {
			currentTab.dataset.complete = 'true';
			handlePrefill();
			if (multistepForm.contains(nextTab)) {
				nextTab.removeAttribute('aria-disabled');
				nextTab.addEventListener('click', clickTab);
				nextTab.addEventListener('keydown', arrowTab);
			}
		} else {
			currentTab.dataset.complete = 'false';
		}
	}

	multistepForm.addEventListener('keydown', function (e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			validateStep(currentStep)
				.then(() => {
					if (currentStep + 1 != tabPanels.length) {
						handleProgress(true);
						activateTab(currentStep + 1);
						tabPanels[currentStep].querySelector('.form__field .form__field-input').focus();
					} else {
						multistepForm.dispatchEvent(new Event('submit'));
					}
				})
				.catch((invalidFields) => {
					console.log(invalidFields)
					handleProgress(false);
					invalidFields.forEach(reportValidity);
					invalidFields[0]?.focus();
				});
		}
	});

	// Form Interactions

	/**********************************************************************************************************************

	This function creates a debounced version of a given function that delays its execution until a specified delay has passed.
	@param {Function} fn - The function to be debounced.
	@param {number} delay - Optional. The delay in milliseconds before executing the debounced function. Default is 500ms.
	@returns {Function} - Returns the debounced function.
	*/

	const debounce = (fn, delay = 500) => {
		let timeoutID;

		return (...args) => {
			clearTimeout(timeoutID);
			timeoutID = setTimeout(() => {
				fn(...args);
				timeoutID = null;
			}, delay);
		};
	};

	/**********************************************************************************************************************
	Attaches a debounced event listener to the input events on the multistepForm element.
	This debounced listener validates the current step and updates the progress bar accordingly.
	It also reports the validity of the input field and displays or removes error messages.
	*/

	multistepForm.addEventListener(
		'input',
		debounce((e) => {
			const { target } = e;
			validateStep(currentStep)
				.then(() => handleProgress(true))
				.catch(() => handleProgress(false));

			reportValidity(target);
		})
	);

	/**********************************************************************************************************************
	Attaches a click event listener to the multistepForm element.

	It performs different actions based on the clicked target element:
		If the target element has a "data-action" attribute equal to "next"
			it validates the current step, updates the progress bar, and progresses to the next step.

		If the target element has a "data-action" attribute equal to "prev"
			it revisits the previous step.
	*/

	multistepForm.addEventListener('click', async (e) => {
		const { target } = e;

		if (target.matches('[data-action="next"]')) {
			validateStep(currentStep)
				.then(() => {
					handleProgress(true);
					activateTab(currentStep + 1);
					tabPanels[currentStep].querySelector('.form__field .form__field-input').focus();
				})
				.catch((invalidFields) => {
					handleProgress(false);
					invalidFields.forEach(reportValidity);
					invalidFields[0]?.focus();
				});
		}

		if (target.matches('[data-action="prev"]')) {
			activateTab(currentStep - 1);
			tabPanels[currentStep].querySelector('.form__field .form__field-input').focus();
		}
	});

	// Form Submission

	/**********************************************************************************************************************
	This function handles a successful form submission by displaying the thank you panel and logging the response.
	@param {any} response - The response received from the form submission.
	*/

	function handleSuccess () {
		const hsForm = sr_module.querySelector('.multistep-form__hs-form form');
		if (!hsForm) {
			return new Promise((resolve, reject) => {
				console.error('No HubSpot form found. Did you forget to add it?');
				resolve();
			});
		}
		const thankYou = multistepForm.querySelector('.multistep-form__thank-you');
		const redirectUrl = thankYou.dataset.redirect;

		// Select the abandoned input field within the form (if present) and set its value to 'false'
		const abandoned = hsForm.querySelector('input[name="abandoned"]');
		if (abandoned) {
			abandoned.value = 'false';

			// Dispatch a 'change' event on the abandoned input field to trigger any associated event listeners
			abandoned.dispatchEvent(new Event('change', { bubbles: true }));
		}

		hsForm.submit();

		console.log('Form submitted');

		if (redirectUrl) {
			window.location.href = redirectUrl;
		} else {
			while (multistepForm.firstElementChild !== thankYou) {
				multistepForm.firstElementChild.remove();
			}

			thankYou.removeAttribute('hidden');
		}
	}

	/**********************************************************************************************************************
	This function handles an error that occurred during form submission by updating the state of the submit button and displaying an error message.
	@param {any} error - The error that occurred during form submission.
	*/

	function handleError (error) {
		const submitButton = multistepForm.querySelector('[type="submit"]');
		if (multistepForm.contains(submitButton)) {
			submitButton.disabled = false;
			submitButton.textContent = 'Submit';

			const errorText = document.createElement('p');
			errorText.className = 'm-0 form__error-text';
			errorText.textContent = `Sorry, your submission could not be processed.
				Please try again. If the issue persists, please contact our support
				team. Error message: ${error}`;

			submitButton.parentElement.prepend(errorText);
		}
	}
	/**********************************************************************************************************************
	This function handles pre-filled form fields by retrieving the values of the form fields with existing values,
	and updating the corresponding fields in the multistep form.
	*/
	function handlePrefilled () {
		const hsForm = sr_module.querySelector('.multistep-form__hs-form form');
		const formFields = hsForm.querySelectorAll('input, select, textarea');
		const fieldsWithValue = [];

		formFields.forEach(function (field) {
			if (field.value.trim() !== '') {
				const fieldName = field.name;
				const fieldValue = field.value;
				const fieldType = field.type;

				if (fieldType === 'checkbox' && field.checked) {
					if (fieldsWithValue.hasOwnProperty(fieldName)) {
						fieldsWithValue[fieldName].push(fieldValue);
					} else {
						fieldsWithValue[fieldName] = [fieldValue];
					}
				} else if (fieldType === 'radio' && field.checked) {
					fieldsWithValue[fieldName] = fieldValue;
				} else if (fieldType !== 'checkbox' && fieldType !== 'radio') {
					fieldsWithValue[fieldName] = fieldValue;
				}
			}
		});


		const multistepFields = multistepForm.querySelectorAll('input, select, textarea');

		multistepFields.forEach(function (field) {
			const fieldName = field.name;

			if (fieldsWithValue.hasOwnProperty(fieldName)) {
				const fieldValue = fieldsWithValue[fieldName];

				if (field.tagName === 'SELECT') {
					Array.from(field.options).forEach(function (option) {
						option.selected = option.value === fieldValue;
					});
				} else if (field.type === 'checkbox') {
					field.checked = Array.isArray(fieldValue) ? fieldValue.includes(field.value) : false;
				} else if (field.type === 'radio') {
					field.checked = fieldValue === field.value;
				} else {
					field.value = fieldValue;
				}
			}
		});

	}

	function handlePrefill () {
		const formFields = Array.from(multistepForm.elements)
			.filter((element) =>
				['input', 'select', 'textarea'].includes(element.tagName.toLowerCase())
			)
			.map((element) => {
				let value;
				if (element.type === 'checkbox') {
					value = element.checked ? element.value : '';
				} else if (element.type === 'radio') {
					if (element.checked) {
						value = element.value;
					}
				} else {
					value = element.value;
				}
				return { name: element.name, value };
			}).filter(field => field.value !== undefined);

		const groupedByName = formFields.reduce((acc, obj) => {
			const key = obj['name'];

			if (!acc[key]) {
				acc[key] = obj;
			} else {
				if (Array.isArray(acc[key].value)) {
					acc[key].value.push(obj.value);
				} else {
					acc[key].value = [acc[key].value, obj.value];
				}
			}

			return acc;
		}, {});

		const combinedArray = Object.values(groupedByName);

		combinedArray.forEach((field) => {
			const inputs = sr_module.querySelectorAll(
				`.multistep-form__hs-form [name="${field.name}"]`
			);

			if (inputs.length > 0) {
				const fieldType = inputs[0].type;
				const fieldName = inputs[0].name;

				switch (fieldType) {
					case 'text':
					case 'number':
					case 'email':
					case 'tel':
					case 'textarea':
					case 'hidden':
						inputs.forEach((input) => {
							input.value = field.value;
						});
						break;
					case 'checkbox':
						if (Array.isArray(field.value)) {
							const checkboxValues = field.value;

							inputs.forEach((input) => {
								input.checked = checkboxValues.includes(input.value);
							});

							if (checkboxValues.length === 0) {
								inputs.forEach((input) => {
									input.checked = false;
								});
							}
						} else {
							inputs.forEach((input) => {
								input.checked = field.value === input.value;
							});
						}
						break;
					case 'radio':
						inputs.forEach((input) => {
							input.checked = field.value.includes(input.value);
						});
						break;
					case 'select-one':
						inputs.forEach((input) => {
							Array.from(input.options).forEach((option) => {
								option.selected = option.value === field.value;
							});
						});
						break;
					default:
						console.error(`Unsupported field type: '${fieldName}:${fieldType}'`);
						break;
				}

				inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
			} else {
				console.warn(
					`Input field not found for: ${field.name.toUpperCase()}. Did you forget to add it to the HubSpot Form?`
				);
			}
		});
	}

	/**********************************************************************************************************************
	Attaches a submit event listener to the multistepForm element.
	It prevents the form from submitting and performs the following tasks:

	1. Validates the current step.
	2. Disables the submit button.
	3. Prepares the form data and handles success by calling the handleSuccess function.
	4. Handles errors by displaying error messages and focusing on the first invalid field.
	*/

	multistepForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		try {
			await validateStep(currentStep);
			handleSuccess();
		} catch (invalidFields) {
			console.log(invalidFields);
			invalidFields.forEach(reportValidity);
			invalidFields[0]?.focus();
		}
	});

	// Get all elements with data-conditional="true"
	const conditionalFields = document.querySelectorAll('[data-conditional="true"]');

	// Attach event listeners to text fields, select elements, and checkboxes
	conditionalFields.forEach((div) => {
		div.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"], input[type="number"], input[type="textarea"]').forEach((field) => {
			field.addEventListener('keyup', handleFieldChange);
		});

		div.querySelectorAll('select, [type="checkbox"], [type="radio"]').forEach((field) => {
			field.addEventListener('change', handleFieldChange);
		});
	});

	/**********************************************************************************************************************
	When a field's value changes, it retrieves the necessary attributes from the dataset of the closest parent element with the attribute data-conditional="true".
	@param {Event} event - The event object representing the field change event.
	*/
	function handleFieldChange(event) {
        const currentField = event.target;
        const conditionalDiv = currentField.closest('[data-conditional="true"]');

        // Retrieve required attributes using destructuring
        const { validationType, property, value } = conditionalDiv.dataset;
        const properties = property.split(',').map(p => p.trim());
        const values = value.split(',').map(v => v.trim());

        if (properties.length !== values.length) {
            console.error('The number of properties and values must match.');
            return;
        }

        let isFieldFound = false;

        properties.forEach((prop, index) => {
            const associatedElement = multistepForm.querySelector(`[name="${prop}"]`);
            if (associatedElement) {
                const associatedField = associatedElement.closest('.form__field');

                if (associatedField) {
                    isFieldFound = true;
                    const expectedValue = values[index];

                    const isHidden = () => {
                        switch (validationType) {
                            case 'IS_EMPTY':
                                return currentField.value === '';
                            case 'IS_NOT_EMPTY':
                                return currentField.value !== '';
                            case 'EQUAL':
                                return currentField.value === expectedValue;
                            case 'NOT_EQUAL':
                                return currentField.value !== expectedValue;
                            case 'GREATER_THAN':
                                return parseFloat(currentField.value) > parseFloat(expectedValue);
                            case 'LESS_THAN':
                                return parseFloat(currentField.value) < parseFloat(expectedValue);
                            default:
                                return false;
                        }
                    };

                    if (isHidden()) {
                        associatedField.removeAttribute('hidden');
                    } else {
                        associatedField.setAttribute('hidden', '');
                    }
                }
            }
        });

        if (!isFieldFound) {
            console.warn('No associated field found for the properties:', properties);
        }
    }


	const intro = sr_module.querySelector('.multistep-form_intro');

	if (intro) {
		const button = intro.querySelector('button');
		// Add a click event listener to the button
		button.addEventListener('click', function () {
			// Remove the class from the parent element
			intro.remove();
		});
	}

	// Select the exit form element
	const exitForm = sr_module.querySelector('.exit-form');

	if (exitForm) {
		// Select the body element
		const body = document.querySelector('body');

		// Define a handler function for the mouseleave event
		const handleMouseleave = (event) => {
			// Get the current Y position of the mouse
			const mouseY = event.clientY;

			// Check if the mouse is moved above the viewport (Y position < 0)
			if (mouseY < 0) {
				// Select the form element within the multistep form
				const hsForm = sr_module.querySelector('.multistep-form__hs-form form');

				// Select the email and firstname input fields within the form
				const email = hsForm.querySelector('input[name="email"]');

				// Check if both email and firstname inputs have a value
				if (email.value) {
					// Select the abandoned input field within the form (if present) and set its value to 'true'
					const abandoned = hsForm.querySelector('input[name="abandoned"]');
					if (abandoned) {
						abandoned.value = 'true';

						// Dispatch a 'change' event on the abandoned input field to trigger any associated event listeners
						abandoned.dispatchEvent(new Event('change', { bubbles: true }));
					}

					// Submit the form
					hsForm.submit();

					console.log('Form abandoned');

					// Remove the mouseleave event listener from the body element once the form is submitted
					body.removeEventListener('mouseleave', handleMouseleave);
				}
			}
		};

		// Attach the mouseleave event listener to the body element with a 3-second delay
		setTimeout(() => {
			body.addEventListener('mouseleave', handleMouseleave);
		}, 3000);
	}
}

ready(() => {
	Array.from(document.querySelectorAll('.multistep-form')).forEach(initializeMultistepForm);
});