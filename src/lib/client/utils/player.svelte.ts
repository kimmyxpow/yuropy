interface AudioController {
	el: HTMLAudioElement | null;
	isPlaying: boolean;
	text: string;
	endedHandler?: () => void;
}

export function createAudioPlayer() {
	const controllers = $state<Record<string, AudioController>>({});

	const playTTS = (id: string, controller: AudioController) => {
		window.speechSynthesis.cancel();
		const utterance = new SpeechSynthesisUtterance(controller.text);
		utterance.lang = 'en-GB';
		utterance.rate = 1;
		utterance.pitch = 1;
		const ukVoice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith('en-GB'));
		if (ukVoice) utterance.voice = ukVoice;

		utterance.onstart = () => {
			controllers[id] = { ...controller, isPlaying: true };
		};
		utterance.onend = () => {
			controllers[id] = { ...controller, isPlaying: false };
		};
		utterance.onerror = () => {
			controllers[id] = { ...controller, isPlaying: false };
		};

		window.speechSynthesis.speak(utterance);
	};

	const stop = (id: string) => {
		const controller = controllers[id];
		if (!controller) return;
		controller.el?.pause();
		controller.isPlaying = false;
	};

	const play = async (id: string) => {
		const controller = controllers[id];
		if (!controller) return;

		if (!controller.el) {
			console.warn(`Audio element for '${id}' not found, using TTS fallback.`);
			playTTS(id, controller);
			return;
		}

		try {
			await controller.el.play();
			controller.isPlaying = true;
		} catch (error) {
			console.warn(`Audio for '${id}' failed, falling back to TTS:`, error);
			playTTS(id, controller);
		}
	};

	function register(id: string, el: HTMLAudioElement | null, text: string) {
		const controller = controllers[id] || { el: null, isPlaying: false, text: '' };

		if (controller.el && controller.el !== el && controller.endedHandler) {
			controller.el.removeEventListener('ended', controller.endedHandler);
		}

		controller.el = el;
		controller.text = text;

		controller.endedHandler = () => {
			controllers[id] = { ...controller, isPlaying: false };
		};

		if (el) {
			el.addEventListener('ended', controller.endedHandler);
		}

		controllers[id] = controller;
	}

	async function toggle(id: string) {
		const controllerToToggle = controllers[id];
		if (!controllerToToggle || !controllerToToggle.text) return;

		for (const key in controllers) {
			if (key !== id) {
				stop(key);
			}
		}
		window.speechSynthesis.cancel();

		if (controllerToToggle.isPlaying) {
			stop(id);
		} else {
			await play(id);
		}
	}

	function isPlaying(id: string): boolean {
		return controllers[id]?.isPlaying ?? false;
	}

	function cleanup() {
		for (const id in controllers) {
			const controller = controllers[id];
			if (controller?.el && controller.endedHandler) {
				controller.el.removeEventListener('ended', controller.endedHandler);
			}
		}
		for (const id in controllers) {
			delete controllers[id];
		}
	}

	return {
		register,
		toggle,
		isPlaying,
		cleanup
	};
}
