<template>
  <div :id="editorId"></div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import "quill/dist/quill.snow.css"
import { useImageStore } from "@/stores/image"

import Quill from "quill";
import ImageResize from "quill-image-resize-module-react";
Quill.register("modules/imageResize", ImageResize);

import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import php from "highlight.js/lib/languages/php";
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("php", php);

// bạn có thể đổi sang "vs2015.css" nếu thích VS Code dark theme
import "highlight.js/styles/github.css";

export default {
  props: {
    id: {
      type: String,
      default: "editor"
    },
    modelValue: String,
    placeholder: {
      type: String,
      default: "Nhập nội dung..."
    }
  },
  setup(props, { emit }) {
    const editorContent = ref(props.modelValue);
    let quill = null;
    const store = useImageStore()
    const editorId = props.id || "quill-" + Math.random().toString(36).slice(2, 9);

    onMounted(async () => {
      const Quill = (await import("quill")).default;

      quill = new Quill(`#${editorId}`, {
        theme: "snow",
        placeholder: props.placeholder,
        modules: {
          toolbar: {
            syntax: {
              highlight: text => hljs.highlightAuto(text).value
            },
            container: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              [{ script: "sub" }, { script: "super" }],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ direction: "rtl" }],
              [{ align: [] }],
              ["blockquote", "code-block"],
              ["link", "image", "video"],
              ["clean"],
              ["myCodeBtn"] // 👉 thêm nút custom
            ],
            handlers: {
              image: function () {
                const input = document.createElement("input");
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/*");
                input.click();

                input.onchange = async () => {
                  const file = input.files && input.files[0];
                  if (!file) return;

                  if (file) {
                    const formData = new FormData();
                    formData.append('upload', file);

                    try {
                      const response = await store.uploadImage(formData);
                      const imageUrl = response?.url || response;
                      if (imageUrl) {
                        const range = quill.getSelection();
                        quill.insertEmbed(range.index, "image", imageUrl);
                      } else {
                        alert("Upload thất bại");
                      }
                    } catch (e) {
                      console.error("Upload error:", e);
                      alert("Có lỗi xảy ra khi upload");
                    }
                  }
                };
              },
              // 👉 handler cho nút custom
              myCodeBtn: function () {
                const range = quill.getSelection();
                if (range) {
                  const format = quill.getFormat(range);
                  quill.format("code-block", !format["code-block"]);
                }
              }
            },
          },
          imageResize: {
            modules: ["Resize", "DisplaySize", "Toolbar"],
          },
        },
      });

      if (props.modelValue) {
        quill.clipboard.dangerouslyPasteHTML(props.modelValue);
      }

      quill.on("text-change", () => {
        emit("update:modelValue", quill.root.innerHTML);
      });
    });

    watch(
      () => props.modelValue,
      (newVal) => {
        if (quill && newVal !== quill.root.innerHTML) {
          const sel = quill.getSelection();
          quill.clipboard.dangerouslyPasteHTML(newVal || "");
          if (sel) quill.setSelection(sel);
        }
      }
    );

    return { editorId };
  },
};
</script>

<style>
#editor {
  min-height: 138px;
}

.ql-editor.ql-blank::before {
  font-size: 16px;
  color: #999;
}

/* code block style */
.ql-syntax {
  background: #1e1e1e;  /* nền tối */
  color: #f8f8f2;
  padding: 12px 16px;
  border-radius: 6px;
  overflow-x: auto;
  white-space: pre;
  font-family: Consolas, "Courier New", monospace;
  font-size: 14px;
  line-height: 1.5;
  margin: 12px 0;
  border: 1px solid #333;
}

/* 👉 custom nút </> */
.ql-myCodeBtn::before {
  content: "</>";
  font-weight: bold;
  font-size: 14px;
}
</style>
