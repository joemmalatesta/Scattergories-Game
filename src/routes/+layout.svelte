<script>
	import '../app.css';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });
</script>

<h1 class="flex justify-center items-center flex-col">
	<a
		href="/"
		class="md:text-7xl text-5xl font-semibold text-transparent bg-black bg-clip-text p-3 flex items-center"
	>
		<!-- <img src="svelteLogo.png" alt="Svelte Logo" class="md:w-16 w-12 mr-1" /> -->
		Groople
	</a>
</h1>
<slot />
