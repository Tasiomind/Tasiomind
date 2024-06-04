export const loading = async (isLoading) => {
	const loadingElement = document.querySelector('.loading');

	if (isLoading) {
		if (!loadingElement) {
			const newLoadingElement = document.createElement('div');
			newLoadingElement.classList.add('loading');
			const loaderElement = document.createElement('div');
			loaderElement.classList.add('loader');
			for (let i = 1; i <= 4; i++) {
				const divElement = document.createElement('div');
				divElement.style.setProperty('--i', i);
				loaderElement.appendChild(divElement);
			}
			newLoadingElement.appendChild(loaderElement);
			document.body.appendChild(newLoadingElement);
			return newLoadingElement;
		}
	} else {
		if (loadingElement) {
			loadingElement.remove();
		}
	}
};
