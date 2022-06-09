<template>
  <div>
    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </p>
  </div>
</template>

<script>
export default {
  name: 'ValidationErrors',
  props: {
    errors: Array
  }  
}
</script>

