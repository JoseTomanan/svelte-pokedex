<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/pokeball.svg';
	import NavBar from '$lib/components/NavBar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Oak's Assistant</title>
</svelte:head>

<NavBar/>
<div class="flex items-center bg-fixed">
	<div class="container">
		{@render children()}
	</div>
</div>
