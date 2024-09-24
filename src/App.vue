<template>
  <div class="editor-container">
    <div id="editor"></div>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import Moondown from 'moondown';
import {initialData} from "./initialData.ts";

onMounted(() => {
  const editorElement = document.getElementById('editor');
  if (editorElement) {
    new Moondown(editorElement, initialData);
  }
});
</script>

<style>
.editor-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f3f4f6;
}

#editor {
  width: 950px;
  height: 90vh;
  background-color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
}

#editor .cm-editor {
  height: 100%;
  padding: 20px;
}

#editor .cm-scroller {
  font-family: "Microsoft Yahei", "PingFang SC", "YouYuan", sans-serif;
  color: #333;
  font-size: 16px;
  overflow: auto;
  scrollbar-width: none;
}

#editor .cm-scroller::-webkit-scrollbar {
  display: none;
}

#editor .cm-content {
  text-align: left;
}

#editor .cm-focused {
  outline: none;
}
</style>