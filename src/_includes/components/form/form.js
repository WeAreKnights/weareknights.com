// Contact form behaviour: stamps the load time and a random arithmetic question for the spam checks in src/api/contact.php, submits by fetch, and reports the result.

document.querySelectorAll("[data-form]").forEach((form) => {
	const timestampField = form.querySelector('[name="timestamp"]');
	if (timestampField) timestampField.value = String(Date.now());

	const mathLabel = form.querySelector("[data-form-math-label]");
	const mathA = form.querySelector('[name="mathA"]');
	const mathB = form.querySelector('[name="mathB"]');
	const mathAnswer = form.querySelector('[name="mathAnswer"]');

	const setMathQuestion = () => {
		if (!mathLabel || !mathA || !mathB) return;
		const firstNumber = Math.floor(Math.random() * 9) + 1;
		const secondNumber = Math.floor(Math.random() * 9) + 1;
		mathA.value = String(firstNumber);
		mathB.value = String(secondNumber);
		mathLabel.textContent = `What's ${firstNumber} + ${secondNumber}?`;
	};
	setMathQuestion();

	if (mathAnswer) {
		mathAnswer.addEventListener("input", () => {
			mathAnswer.value = mathAnswer.value.replace(/\D/g, "");
		});
	}

	const status = form.querySelector("[data-form-status]");

	const showStatus = (message, isError) => {
		if (!status) return;
		status.textContent = message;
		status.classList.toggle("form-status-error", isError);
		status.classList.toggle("form-status-success", !isError);
	};

	if (new URLSearchParams(window.location.search).has("error")) {
		showStatus("Something went wrong. Please check your details and try again, or email us directly.", true);
	}

	form.addEventListener("submit", async (event) => {
		event.preventDefault();
		const submitButton = form.querySelector('button[type="submit"]');
		submitButton.disabled = true;
		showStatus("Sending…", false);

		try {
			const response = await fetch(form.action, {
				method: "POST",
				body: new FormData(form),
				headers: { Accept: "application/json" },
			});
			const data = await response.json();
			showStatus(data.message, !data.success);
			if (data.success) {
				window.trackConversion?.();
				form.reset();
				setMathQuestion();
			}
		} catch (error) {
			showStatus("Something went wrong. Please email us directly.", true);
		} finally {
			submitButton.disabled = false;
		}
	});
});
