<template>
    <div class="not-found">
      <h1 style="font-size: 2em; color: red;">Page introuvable</h1>
      <p style="font-size: 1.2em; margin-bottom: 20px;">Désolé, la page que vous recherchez n'existe pas.</p>
    </div>
</template>

<script lang="ts">
export default {
    name: 'NotFound',
};
</script>

<style scoped>
.not-found {
    text-align: center;
    margin-top: 50px;
}

</style>
  